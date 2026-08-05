"use client";

import { useEffect } from "react";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const revealClass = "home-reveal";
const partnerLogos = Array.from({ length: 24 }, (_, i) => {
  const n = String(i + 1).padStart(2, "0");
  // 7번째: 성균관대 (검정 배경 제거, 학과명 유지)
  if (n === "07") return "/partners/skku-clear.png";
  return `/partners/partner-${n}.png`;
});
type HeroSlide = {
  titleLine1: string;
  titleLine2: string;
  descriptionLine1: string;
  descriptionLine2?: string;
  /** 긴 카피용: 제목 크기 축소 */
  compact?: boolean;
  /** 우측 비주얼. 없으면 협회 로고 */
  imageSrc?: string;
  imageAlt?: string;
  /** 일러스트 등 contain 표시 */
  imageContain?: boolean;
};

const heroSlides: HeroSlide[] = [
  {
    titleLine1: "우리는 머뭅니다,",
    titleLine2: "당신이 멈추지 않도록",
    descriptionLine1:
      "학생과 현업을 잇는 가장 단단한 디딤돌, 지금 KUSPBA와 함께 제약·바이오의 미래를 그리세요!",
  },
  {
    // 배너2 — 사진2
    titleLine1: "제약·바이오 직무를 함께 공부하는",
    titleLine2: "KUSPBA 디딤돌 프로젝트",
    descriptionLine1: "산업을 이해하고 진로를 구체화하는 12주 스터디 프로그램",
    compact: true,
    imageSrc: "/hero/banner-2.png",
    imageAlt: "KUSPBA 디딤돌 프로젝트 17기 Orientation",
  },
  {
    // 배너3 — 사진3
    titleLine1: "제약·바이오산업을 더 가까이에서",
    titleLine2: "KUSPBA 직무 세미나",
    descriptionLine1: "다양한 직무와 산업 현장을 배우는 시간",
    compact: true,
    imageSrc: "/hero/banner-3.png",
    imageAlt: "KUSPBA 제약·바이오 직무세미나",
  },
  {
    // 배너4 — 사진4
    titleLine1: "제약·바이오산업에 관심 있는 대학생이라면,",
    titleLine2: "KUSPBA와 함께해요!",
    descriptionLine1: "전국 대학(원)생과 함께하는 산업 네트워크",
    compact: true,
    imageSrc: "/hero/banner-4.png",
    imageAlt: "KUSPBA와 함께해요",
    imageContain: true,
  },
  {
    // 배너5 — 사진5
    titleLine1: "나에게 맞는 제약·바이오 직무는?",
    titleLine2: "KUSPBA 직무 MBTI 테스트",
    descriptionLine1: "16가지 직무 중 나에게 맞는 진로를 찾아보세요.",
    compact: true,
    imageSrc: "/hero/banner-5.png",
    imageAlt: "KUSPBA 직무 MBTI 테스트",
    imageContain: true,
  },
];

const HERO_AUTO_INTERVAL_MS = 5000;

function HeroArrowIcon({ direction }: { direction: "prev" | "next" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="block h-[18px] w-[18px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {direction === "prev" ? (
        <polyline points="14.5 6 9 12 14.5 18" />
      ) : (
        <polyline points="9.5 6 15 12 9.5 18" />
      )}
    </svg>
  );
}

const heroArrowBtnClass =
  "inline-flex items-center justify-center rounded-full border border-black/[0.06] bg-white text-[#1D1D1F] shadow-[0_8px_24px_rgba(0,0,0,0.1)] transition-[box-shadow,border-color,background-color,color] duration-200 ease-out hover:border-[#8ABFB2]/50 hover:bg-[#F7FFFC] hover:text-[#427A72] hover:shadow-[0_10px_28px_rgba(66,122,114,0.18)] active:bg-[#E8F0EE] active:shadow-[0_4px_14px_rgba(0,0,0,0.1)]";

export default function HomePage() {
  const [activeHeroSlide, setActiveHeroSlide] = useState(0);
  const [heroTimerKey, setHeroTimerKey] = useState(0);
  const [heroSlideDir, setHeroSlideDir] = useState<"prev" | "next">("next");
  const [isHeroHovered, setIsHeroHovered] = useState(false);
  const [openCoreValue, setOpenCoreValue] = useState<string | null>(null);

  const coreValues = [
    {
      id: "connection",
      title: "연결 (Connection)",
      desc: "개인과 개인을 잇고, 학문과 산업을 연결하여,\n세상으로 나아가는 발판을 만듭니다.",
      image: "/core-value-connect.png",
    },
    {
      id: "pioneer",
      title: "개척 (Pioneer)",
      desc: "주체적인 도전 정신으로 우리의 역량을\n산업 전체의 에너지로 확장합니다.",
      image: "/core-value-pioneer.png",
    },
    {
      id: "foundation",
      title: "토대 (Foundation)",
      desc: "학생과 산업 사이, 구성원이 어느 방향으로든\n나아갈 수 있는 신뢰의 기반을 만듭니다.",
      image: "/core-value-foundation.png",
    },
  ] as const;

  const activeCoreValue =
    coreValues.find((value) => value.id === openCoreValue) ?? null;

  useEffect(() => {
    if (!openCoreValue) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenCoreValue(null);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [openCoreValue]);

  const goToHeroSlide = (index: number) => {
    if (index === activeHeroSlide) return;
    setHeroSlideDir(index > activeHeroSlide ? "next" : "prev");
    setActiveHeroSlide(index);
    setHeroTimerKey((key) => key + 1);
  };

  const handlePrevHeroSlide = () => {
    setHeroSlideDir("prev");
    setActiveHeroSlide((prev) =>
      prev === 0 ? heroSlides.length - 1 : prev - 1,
    );
    setHeroTimerKey((key) => key + 1);
  };

  const handleNextHeroSlide = () => {
    setHeroSlideDir("next");
    setActiveHeroSlide((prev) =>
      prev === heroSlides.length - 1 ? 0 : prev + 1,
    );
    setHeroTimerKey((key) => key + 1);
  };

  useEffect(() => {
    if (isHeroHovered) return;

    const timer = window.setInterval(() => {
      setHeroSlideDir("next");
      setActiveHeroSlide((prev) =>
        prev === heroSlides.length - 1 ? 0 : prev + 1,
      );
    }, HERO_AUTO_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, [heroTimerKey, isHeroHovered]);

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY;
      const opacityLevel = Math.min(scrollY / 1000, 1);

      const bg = document.getElementById("dynamicBg");
      const orb1 = document.getElementById("orb1");
      const orb2 = document.getElementById("orb2");
      const cube = document.getElementById("cube3d");
      const pWave = document.getElementById("paraWave");

      if (bg) bg.style.opacity = `${opacityLevel}`;
      if (orb1) {
        orb1.style.opacity = `${opacityLevel * 0.6}`;
        orb1.style.transform = `translateY(${scrollY * 0.2}px)`;
      }
      if (orb2) {
        orb2.style.opacity = `${opacityLevel * 0.6}`;
        orb2.style.transform = `translateY(${scrollY * -0.15}px)`;
      }
      if (cube) {
        cube.style.transform = `rotateX(${15 + scrollY * 0.05}deg) rotateY(${
          -15 + scrollY * 0.1
        }deg)`;
      }
      if (pWave) {
        pWave.style.transform = `translateY(${scrollY * -0.15}px)`;
      }
    };

    const revealElements = document.querySelectorAll(`.${revealClass}`);
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
    );

    revealElements.forEach((el) => observer.observe(el));
    setTimeout(() => {
      document
        .querySelectorAll(".hero-wrap .home-reveal")
        .forEach((el) => el.classList.add("active"));
    }, 80);

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, []);

  const currentHeroSlide = heroSlides[activeHeroSlide];

  return (
    <div className="relative bg-white text-[#373737]">
      <div
        id="dynamicBg"
        className="pointer-events-none fixed inset-0 -z-30 opacity-0 transition-opacity duration-100"
        style={{
          background:
            "radial-gradient(circle at 50% 120%, rgba(193,228,215,0.4) 0%, rgba(193,224,228,0.2) 60%, rgba(255,255,255,0) 100%)",
        }}
      />
      <div
        id="orb1"
        className="pointer-events-none fixed -left-[140px] top-[8%] -z-20 h-[440px] w-[440px] rounded-full opacity-0 blur-[80px] transition-all"
        style={{ background: "#C1E4D7" }}
      />
      <div
        id="orb2"
        className="pointer-events-none fixed -bottom-[160px] -right-[150px] -z-20 h-[540px] w-[540px] rounded-full opacity-0 blur-[80px] transition-all"
        style={{ background: "#C1E0E4" }}
      />

      {/* hero는 overflow-x-hidden 밖에 두어 좌우 화살표가 잘리지 않게 함 */}
      <section
        className="hero-wrap relative mx-auto max-w-[1200px] overflow-visible px-6 pb-16 pt-[120px] lg:px-16 lg:pb-20 lg:pt-[170px]"
        onMouseEnter={() => setIsHeroHovered(true)}
        onMouseLeave={() => setIsHeroHovered(false)}
      >
        <button
          type="button"
          onClick={handlePrevHeroSlide}
          aria-label="이전 멘트 보기"
          className={`${heroArrowBtnClass} absolute left-1 top-[calc(50%+20px)] z-20 hidden h-12 w-12 -translate-y-1/2 lg:left-2 lg:flex xl:left-0`}
        >
          <HeroArrowIcon direction="prev" />
        </button>
        <button
          type="button"
          onClick={handleNextHeroSlide}
          aria-label="다음 멘트 보기"
          className={`${heroArrowBtnClass} absolute right-1 top-[calc(50%+20px)] z-20 hidden h-12 w-12 -translate-y-1/2 lg:right-2 lg:flex xl:right-0`}
        >
          <HeroArrowIcon direction="next" />
        </button>

        <div className="flex flex-col items-center gap-10 lg:flex-row lg:pl-10 lg:pr-10">
          <div className="min-w-0 flex-[1.15]">
            <span className="mb-6 inline-block rounded-full bg-[#C1E4D7] px-4 py-1.5 text-[13px] font-extrabold text-[#222]">
              전국 유일 대학생제약바이오산업협회
            </span>
            <div className="mb-3 flex items-center justify-between lg:hidden">
              <button
                type="button"
                onClick={handlePrevHeroSlide}
                aria-label="이전 멘트 보기"
                className={`${heroArrowBtnClass} relative z-20 h-10 w-10`}
              >
                <HeroArrowIcon direction="prev" />
              </button>
              <button
                type="button"
                onClick={handleNextHeroSlide}
                aria-label="다음 멘트 보기"
                className={`${heroArrowBtnClass} relative z-20 h-10 w-10`}
              >
                <HeroArrowIcon direction="next" />
              </button>
            </div>
            <div
              key={`${activeHeroSlide}-${heroSlideDir}`}
              data-dir={heroSlideDir}
              className="hero-slide-copy"
            >
              <h1
                className={`mb-4 max-w-[22em] break-keep font-black leading-[1.2] tracking-[-0.04em] text-[#222] md:mb-5 ${
                  currentHeroSlide.compact
                    ? "text-[28px] md:text-[36px] lg:text-[42px]"
                    : "text-[36px] md:text-[48px] lg:text-[56px]"
                }`}
              >
                {currentHeroSlide.titleLine1}
                <br />
                {currentHeroSlide.titleLine2}
              </h1>
              <p
                className={`mb-8 max-w-[34em] break-keep font-medium leading-snug text-[#555] md:mb-10 ${
                  currentHeroSlide.compact
                    ? "text-[15px] md:text-base lg:text-lg"
                    : "text-base md:text-lg lg:text-xl"
                }`}
              >
                {currentHeroSlide.descriptionLine1}
                {currentHeroSlide.descriptionLine2 ? (
                  <>
                    <br />
                    {currentHeroSlide.descriptionLine2}
                  </>
                ) : null}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/seminars"
                className="inline-flex items-center justify-center rounded-full bg-[#373737] px-8 py-3.5 text-[15px] font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#222]"
              >
                프로그램 신청하기
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center justify-center rounded-full border border-black/10 bg-white px-8 py-3.5 text-[15px] font-bold text-[#373737] transition hover:-translate-y-0.5 hover:border-[#C1E4D7]"
              >
                KUSPBA와 함께하기
              </Link>
              <Link
                href="#"
                className="inline-flex items-center justify-center rounded-full bg-[#C1E4D7] px-4 py-2 text-[13px] font-extrabold text-[#222] transition hover:-translate-y-0.5 hover:bg-[#b3dccf]"
              >
                나의 직무 MBTI는?
              </Link>
            </div>
          </div>
          <div className="relative flex h-[330px] w-full flex-[0.85] items-center justify-center md:h-[420px]">
            {currentHeroSlide.imageSrc ? (
              <div
                key={`hero-visual-${activeHeroSlide}-${heroSlideDir}`}
                data-dir={heroSlideDir}
                className={`hero-slide-visual relative h-[260px] w-full max-w-[420px] overflow-hidden rounded-[28px] border border-black/5 shadow-[0_24px_50px_rgba(0,0,0,0.1)] md:h-[320px] md:rounded-[34px] lg:h-[360px] ${
                  currentHeroSlide.imageContain ? "bg-[#F7FFFC] p-4 md:p-6" : "bg-[#F3F4F6]"
                }`}
              >
                <Image
                  src={currentHeroSlide.imageSrc}
                  alt={currentHeroSlide.imageAlt ?? "KUSPBA 배너 이미지"}
                  fill
                  sizes="(max-width: 768px) 90vw, 420px"
                  className={currentHeroSlide.imageContain ? "object-contain p-4 md:p-6" : "object-cover"}
                  priority={activeHeroSlide <= 1}
                />
              </div>
            ) : (
              <div
                id="cube3d"
                className="flex h-[260px] w-[260px] items-center justify-center rounded-[34px] border border-white/90 bg-gradient-to-br from-white/80 to-white/30 shadow-[0_30px_60px_rgba(0,0,0,0.08)] backdrop-blur-xl transition-transform duration-100 md:h-[300px] md:w-[300px] md:rounded-[42px] lg:h-[340px] lg:w-[340px]"
                style={{ transform: "rotateX(15deg) rotateY(-15deg)" }}
              >
                <div className="relative h-[186px] w-[186px] md:h-[224px] md:w-[224px] lg:h-[248px] lg:w-[248px]">
                  <Image
                    src="/logo.png"
                    alt="KUSPBA 로고"
                    fill
                    sizes="248px"
                    className="object-contain"
                    priority
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div
          className="mt-8 flex items-center justify-center gap-2.5"
          role="tablist"
          aria-label="히어로 슬라이드"
        >
          {heroSlides.map((slide, index) => {
            const isActive = index === activeHeroSlide;
            return (
              <button
                key={`${slide.titleLine1}-${index}`}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-label={`${index + 1}번째 슬라이드`}
                onClick={() => goToHeroSlide(index)}
                className={`rounded-full transition-all duration-300 ease-out ${
                  isActive
                    ? "h-2.5 w-2.5 bg-[#8ABFB2] scale-110"
                    : "h-2 w-2 bg-[#D4D4D8] hover:bg-[#B0B0B5]"
                }`}
              />
            );
          })}
        </div>
      </section>

      <div className="overflow-x-hidden">
      <section className="relative mx-auto max-w-[1000px] px-6 py-24 text-center md:py-36">
        <div
          id="paraWave"
          className="pointer-events-none absolute -right-20 top-[10%] -z-10 h-[600px] w-[380px] opacity-20"
          style={{
            background:
              "radial-gradient(circle at 20% 20%, rgba(193,228,215,0.45), rgba(193,228,215,0) 60%)",
          }}
        />
        <div className={revealClass}>
          <p className="mb-3 text-xl font-bold text-[#8ABFB2]">Our Vision</p>
          <h2 className="mb-8 text-[28px] font-black tracking-[-0.03em] text-[#222] md:whitespace-nowrap md:text-[40px]">
            &ldquo;제약&middot;바이오 인재와 산업을 잇는 가장 단단한 토대가 되는 것&rdquo;
          </h2>

          <p className="mb-3 mt-24 text-xl font-bold text-[#8ABFB2] md:mt-32">Our Mission</p>
          <h2 className="break-keep text-[26px] font-black leading-[1.4] tracking-[-0.03em] text-[#222] md:text-[34px] lg:text-[38px]">
            <span className="md:whitespace-nowrap">
              &ldquo;우리는 제약&middot;바이오 인재들이 지식의 고립을 넘어 서로를{" "}
              <span className="whitespace-nowrap">연결하고,</span>
            </span>
            <br />
            함께 성장하도록 실질적인 기회를 만듭니다&rdquo;
          </h2>
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-6 pb-28 md:pb-40">
        <div className="mb-12 text-center">
          <p className="mb-3 text-xl font-bold text-[#8ABFB2]">Core Value</p>
          <h2 className="text-[36px] font-black tracking-[-0.03em] text-[#222] md:text-[44px]">
            우리가 선택한 세 가지 태도
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3 md:gap-8">
          {coreValues.map((value) => (
            <button
              key={value.id}
              type="button"
              onClick={() => setOpenCoreValue(value.id)}
              className="group overflow-hidden rounded-[30px] border border-white bg-white/80 p-7 text-left shadow-[0_20px_40px_rgba(0,0,0,0.03)] backdrop-blur-2xl transition hover:-translate-y-2 hover:border-[#C1E4D7] hover:shadow-[0_25px_50px_rgba(0,0,0,0.06)] md:p-8"
            >
              <h3 className="mb-3 text-[26px] font-extrabold tracking-[-0.03em] text-[#222]">
                {value.title}
              </h3>
              <p className="whitespace-pre-line text-[16px] leading-relaxed text-[#555]">
                {value.desc}
              </p>
              <div className="relative mt-6 aspect-[4/3] overflow-hidden rounded-[22px] bg-[#F8F9FA] shadow-inner md:mt-8">
                <Image
                  src={value.image}
                  alt={`${value.title} 활동 이미지`}
                  fill
                  sizes="(max-width: 768px) 100vw, 360px"
                  className="object-cover transition duration-300 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/5" />
                <span className="absolute bottom-3 right-3 rounded-full bg-white/90 px-3 py-1.5 text-xs font-extrabold text-[#373737] shadow-sm">
                  크게 보기
                </span>
              </div>
            </button>
          ))}
        </div>

        {activeCoreValue && (
          <div
            className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm md:p-10"
            role="dialog"
            aria-modal="true"
            aria-label={`${activeCoreValue.title} 사진 크게 보기`}
            onClick={() => setOpenCoreValue(null)}
          >
            <button
              type="button"
              onClick={() => setOpenCoreValue(null)}
              aria-label="사진 닫기"
              className="absolute right-5 top-5 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-2xl font-black text-[#222] shadow-lg transition hover:bg-[#C1E4D7] md:right-8 md:top-8"
            >
              ×
            </button>
            <div
              className="relative h-[min(78vh,720px)] w-full max-w-[980px] overflow-hidden rounded-[24px] bg-black shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              <Image
                src={activeCoreValue.image}
                alt={`${activeCoreValue.title} 확대 이미지`}
                fill
                sizes="980px"
                className="object-contain"
                priority
              />
            </div>
          </div>
        )}
      </section>

      <section className="bg-[#F8F9FA] px-6 py-24 md:py-36">
        <div className="mx-auto max-w-[1200px]">
          <div className={`${revealClass} mb-14 text-center`}>
            <p className="mb-2 text-xl font-semibold text-[#8ABFB2]">Programs</p>
            <h2 className="mb-4 text-[38px] font-bold tracking-[-0.03em] text-[#222] md:text-[44px]">
              학생과 산업을 연결하는 디딤돌
            </h2>
            <p className="text-lg text-[#555] md:text-xl">
              모든 프로그램은 KUSPBA의 핵심가치에서 시작됩니다.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3 md:gap-8">
            {[
              {
                tag: "모집 중",
                recruiting: true,
                category: "연결",
                programs: ["직무 세미나", "봉사활동"],
                href: "/seminars" as string | undefined,
                body: (
                  <>
                    직무 세미나를 통해 교실 밖 산업 현장과 연결하고,
                    <br />
                    <strong className="font-semibold text-[#222]">사회 공헌 활동</strong>을
                    통해 나와 세상을 연결합니다.
                  </>
                ),
              },
              {
                tag: "모집 중",
                recruiting: true,
                category: "개척",
                programs: ["현장실습", "해커톤", "연합학술제"],
                href: "/seminars" as string | undefined,
                body: (
                  <>
                    현장실습과 해커톤으로
                    <br />
                    대학생의 시선에서 산업을 해석하고,
                    <br />
                    연합학술제를 통해 학계의 새로운 가능성을 직접 넓혀갑니다.
                  </>
                ),
              },
              {
                tag: "준비 중",
                recruiting: false,
                category: "토대",
                programs: ["디딤돌 프로젝트"],
                href: undefined,
                body: (
                  <>
                    디딤돌 프로젝트를 통해
                    <br />
                    산업의 언어를 배우고, 지식의 기반을 쌓아가,
                    <br />
                    나만의 디딤돌을 만들어갑니다.
                  </>
                ),
              },
            ].map((program) => (
              <article
                key={program.category}
                className={`${revealClass} flex min-h-[360px] flex-col rounded-[30px] border border-black/[0.06] bg-white p-8 shadow-[0_10px_30px_rgba(0,0,0,0.04)] transition hover:-translate-y-2 hover:border-black/15 hover:shadow-[0_20px_45px_rgba(0,0,0,0.08)] ${
                  !program.recruiting ? "bg-white/70" : ""
                }`}
              >
                <div className="mb-6 flex items-start justify-between gap-3">
                  <div className="flex flex-wrap gap-2">
                    {program.programs.map((name) => (
                      <span
                        key={name}
                        className="inline-flex items-center rounded-full bg-[#C1E4D7] px-3 py-1 text-[13px] font-semibold tracking-[-0.01em] text-[#222]"
                      >
                        {name}
                      </span>
                    ))}
                  </div>
                  <span
                    className={`inline-flex shrink-0 items-center gap-1.5 text-xs font-semibold ${
                      program.recruiting ? "text-[#427A72]" : "text-[#86868B]"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        program.recruiting ? "bg-[#427A72]" : "bg-[#A1A1A6]"
                      }`}
                    />
                    {program.tag}
                  </span>
                </div>
                <h3 className="mb-4 text-[28px] font-bold tracking-[-0.03em] text-[#222]">
                  {program.category}
                </h3>
                <p className="mb-8 flex-grow text-[16px] leading-relaxed text-[#555]">
                  {program.body}
                </p>
                <div className="border-t border-black/10 pt-5">
                  {program.href ? (
                    <Link
                      href={program.href}
                      className="text-sm font-semibold text-[#373737] transition hover:text-[#222]"
                    >
                      자세히 보기 →
                    </Link>
                  ) : (
                    <p className="text-sm font-semibold text-[#777]">오픈 예정 →</p>
                  )}
                </div>
              </article>
            ))}
          </div>
          <div className="mt-8 flex justify-end md:mt-10">
            <Link
              href="/seminars"
              className="inline-flex items-center justify-center rounded-full bg-[#373737] px-6 py-3 text-[14px] font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#222] md:px-8 md:text-[15px]"
            >
              이외 프로그램도 여기서 확인하세요!
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1000px] px-6 pb-10 pt-24 text-center md:pb-14 md:pt-32">
        <div className={revealClass}>
          <p className="mb-3 text-xl font-bold text-[#8EB8C5]">Mascot</p>
          <h2 className="mb-5 text-[42px] font-black tracking-[-0.04em] text-[#222] md:text-[48px]">
            든든한 빌더, 디딤이
          </h2>
          <p className="mb-12 text-lg leading-relaxed text-[#555] md:text-xl">
            청록색 과잠을 입고 제약&middot;바이오산업의 징검다리가 되기 위해
            <br />
            오늘도 열심히 머무는 KUSPBA의 마스코트랍니다.
          </p>
          <div className="mx-auto mb-8 flex max-w-[580px] items-center justify-center rounded-[34px] bg-white p-16 shadow-[0_30px_60px_rgba(0,0,0,0.08)] transition hover:-translate-y-1">
            <div className="relative h-[220px] w-[220px]">
              <Image
                src="/didimi-home.png"
                alt="디딤이 마스코트"
                fill
                sizes="220px"
                className="object-contain"
              />
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <span className="rounded-full bg-[#F8F9FA] px-5 py-2.5 text-sm font-bold text-[#222]">
              🐢 06년생 (Born in 2006)
            </span>
            <span className="rounded-full bg-[#F8F9FA] px-5 py-2.5 text-sm font-bold text-[#222]">
              🎓 한국대학교 재학중
            </span>
          </div>

          <div className="mx-auto mt-12 max-w-[760px] rounded-[28px] border border-black/5 bg-[#F8F9FA] px-8 py-10 shadow-[0_12px_24px_rgba(0,0,0,0.04)]">
            <h3 className="mb-3 text-[30px] font-black tracking-[-0.03em] text-[#222] md:text-[34px]">
              KUSPBA 협회원으로 들어오세요!
            </h3>
            <p className="mb-6 text-base font-medium leading-relaxed text-[#555] md:text-lg">
              당신이 멈추지 않도록, 우리가 자리를 지키고 있습니다.
            </p>
            <a
              href="https://form.naver.com/response/IyBsxyQhmyRLIPvVLidJWw"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-[#373737] px-8 py-3.5 text-[15px] font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#222]"
            >
              협회원 가입하기
            </a>
          </div>
        </div>
      </section>

      <section id="inquiry" className="mx-auto max-w-[1200px] px-6 pb-24 md:pb-40">
        <div
          className={`${revealClass} mx-auto max-w-[760px] rounded-[28px] border border-white/70 px-8 py-10 text-center shadow-[0_20px_40px_rgba(193,228,215,0.3)]`}
          style={{
            background:
              "linear-gradient(135deg, rgba(193,228,215,1) 0%, rgba(193,224,228,1) 100%)",
          }}
        >
          <h2 className="mb-3 text-[30px] font-black tracking-[-0.03em] text-[#222] md:text-[34px]">
            학과 단위로 KUSPBA와 함께하세요!
          </h2>
          <p className="mb-6 text-lg font-semibold text-black/60 md:text-xl">
            타 대학 제약·바이오 학생들과의 탄탄한 네트워크를 만들어보세요.
          </p>
          <a
            href="https://pf.kakao.com/_XHhSn"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full bg-[#373737] px-8 py-3.5 text-[15px] font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#222]"
          >
            💬 카카오톡으로 제휴 문의하기
          </a>
        </div>

        <div id="partner-departments" className="mt-10 md:mt-12">
          <div className="mb-6 text-center md:mb-8">
            <p className="mb-2 text-lg font-bold text-[#8ABFB2]">Partner Departments</p>
            <h2 className="text-[28px] font-black tracking-[-0.03em] text-[#222] md:text-[32px]">
              협력 학과 배너
            </h2>
          </div>

          <div className="overflow-hidden rounded-[24px] border border-[#C1E4D7]/70 bg-gradient-to-r from-white via-[#F7FFFC] to-white px-2 py-5 shadow-[0_14px_30px_rgba(138,191,178,0.18)]">
            <div className="partner-marquee-track flex w-max items-center">
              {[...partnerLogos, ...partnerLogos].map((src, idx) => (
                <div
                  key={`${src}-${idx}`}
                  className="mx-2 flex h-[78px] w-[98px] shrink-0 items-center justify-center rounded-[18px] bg-white p-2 shadow-sm ring-1 ring-black/5 md:mx-3 md:h-[92px] md:w-[118px] md:p-3"
                >
                  <Image
                    src={src}
                    alt={`협력 대학 로고 ${(idx % partnerLogos.length) + 1}`}
                    width={92}
                    height={92}
                    sizes="92px"
                    unoptimized
                    className="h-full w-full object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <style jsx global>{`
        .home-reveal {
          opacity: 1;
          transform: translateY(0);
          transition: opacity 0.8s cubic-bezier(0.165, 0.84, 0.44, 1),
            transform 0.8s cubic-bezier(0.165, 0.84, 0.44, 1);
        }
        .home-reveal.active {
          opacity: 1;
          transform: translateY(0);
        }
        @media (max-width: 767px) {
          .hero-wrap {
            min-height: auto;
          }
        }
        .partner-marquee-track {
          animation: partner-marquee-left 40s linear infinite;
        }
        @keyframes partner-marquee-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .hero-slide-copy {
          animation: hero-slide-in-next 0.55s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .hero-slide-copy[data-dir="prev"] {
          animation-name: hero-slide-in-prev;
        }
        .hero-slide-visual {
          animation: hero-visual-in-next 0.6s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .hero-slide-visual[data-dir="prev"] {
          animation-name: hero-visual-in-prev;
        }
        @keyframes hero-slide-in-next {
          from {
            opacity: 0;
            transform: translateX(28px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes hero-slide-in-prev {
          from {
            opacity: 0;
            transform: translateX(-28px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes hero-visual-in-next {
          from {
            opacity: 0;
            transform: translateX(36px) scale(0.985);
          }
          to {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }
        @keyframes hero-visual-in-prev {
          from {
            opacity: 0;
            transform: translateX(-36px) scale(0.985);
          }
          to {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }
      `}</style>
      </div>
    </div>
  );
}
