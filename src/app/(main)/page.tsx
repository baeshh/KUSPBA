"use client";

import { useEffect } from "react";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const revealClass = "home-reveal";
const partnerSchools = [
  "고려대학교 약학대학",
  "서울대학교 약학대학",
  "연세대학교 생명공학과",
  "성균관대학교 약학대학",
  "중앙대학교 약학대학",
  "경희대학교 약학대학",
  "이화여자대학교 약학대학",
  "동국대학교 바이오시스템대학",
];
const heroSlides = [
  {
    titleLine1: "우리는 머뭅니다.",
    titleLine2: "당신이 멈추지 않도록.",
    descriptionLine1: "학생과 현업을 잇는 가장 단단하고 세련된 디딤돌.",
    descriptionLine2: "지금 KUSPBA와 함께 제약바이오의 미래를 그리세요.",
  },
  {
    titleLine1: "연결은 기회가 됩니다.",
    titleLine2: "기회는 커리어가\u00A0됩니다.",
    descriptionLine1: "한 번의 프로그램 참여가 진로의 방향을 바꿀 수 있습니다.",
    descriptionLine2: "KUSPBA는 그 전환점이 되는 경험을 만듭니다.",
  },
  {
    titleLine1: "혼자 고민하지 말고,",
    titleLine2: "함께 성장하세요.",
    descriptionLine1: "현직자, 선배, 동료와 함께 더 빠르게 앞으로 나아갑니다.",
    descriptionLine2: "KUSPBA에서 실무와 네트워크를 동시에 경험해보세요.",
  },
];

export default function HomePage() {
  const [activeHeroSlide, setActiveHeroSlide] = useState(0);

  const handlePrevHeroSlide = () => {
    setActiveHeroSlide((prev) =>
      prev === 0 ? heroSlides.length - 1 : prev - 1,
    );
  };

  const handleNextHeroSlide = () => {
    setActiveHeroSlide((prev) =>
      prev === heroSlides.length - 1 ? 0 : prev + 1,
    );
  };

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
    <div className="relative overflow-x-hidden bg-white text-[#373737]">
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

      <section className="hero-wrap relative mx-auto flex min-h-[860px] max-w-[1200px] flex-col items-center gap-10 px-6 pb-[250px] pt-[170px] lg:flex-row">
        <button
          type="button"
          onClick={handlePrevHeroSlide}
          aria-label="이전 멘트 보기"
          className="absolute -left-8 top-1/2 hidden -translate-y-1/2 text-[#8A8A8A] transition hover:text-[#222] lg:block"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-9 w-9"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <button
          type="button"
          onClick={handleNextHeroSlide}
          aria-label="다음 멘트 보기"
          className="absolute -right-8 top-1/2 hidden -translate-y-1/2 text-[#8A8A8A] transition hover:text-[#222] lg:block"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-9 w-9"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
        <div className="min-w-0 flex-[1.15] lg:pr-14">
          <span className="mb-6 inline-block rounded-full bg-[#C1E4D7] px-4 py-1.5 text-[13px] font-extrabold text-[#222]">
            전국 유일 대학생제약바이오산업협회
          </span>
          <div className="mb-3 flex items-center justify-between lg:hidden">
            <button
              type="button"
              onClick={handlePrevHeroSlide}
              aria-label="이전 멘트 보기"
              className="text-[#8A8A8A] transition hover:text-[#222]"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-8 w-8"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              type="button"
              onClick={handleNextHeroSlide}
              aria-label="다음 멘트 보기"
              className="text-[#8A8A8A] transition hover:text-[#222]"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-8 w-8"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
          <h1 className="mb-6 break-keep text-[52px] font-black leading-[1.12] tracking-[-0.04em] text-[#222] md:text-[64px]">
            {currentHeroSlide.titleLine1}
            <br />
            <span className="whitespace-nowrap">{currentHeroSlide.titleLine2}</span>
          </h1>
          <p className="mb-10 text-lg font-medium leading-relaxed text-[#555] md:text-xl">
            {currentHeroSlide.descriptionLine1}
            <br />
            {currentHeroSlide.descriptionLine2}
          </p>
          <div className="flex flex-wrap gap-3">
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
          </div>
        </div>
        <div className="relative flex h-[420px] flex-[0.85] items-center justify-center">
          <div
            id="cube3d"
            className="flex h-[300px] w-[300px] items-center justify-center rounded-[42px] border border-white/90 bg-gradient-to-br from-white/80 to-white/30 shadow-[0_30px_60px_rgba(0,0,0,0.08)] backdrop-blur-xl transition-transform duration-100 md:h-[340px] md:w-[340px]"
            style={{ transform: "rotateX(15deg) rotateY(-15deg)" }}
          >
            <div className="relative h-[224px] w-[224px] md:h-[248px] md:w-[248px]">
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
        </div>

        <div className="absolute bottom-8 left-0 right-0 px-6">
          <div className="mb-5 text-center">
            <p className="mb-2 text-lg font-bold text-[#8ABFB2]">Partner Schools</p>
            <h3 className="text-[28px] font-black tracking-[-0.03em] text-[#222] md:text-[32px]">
              협력 학교 배너
            </h3>
          </div>

          <div className="overflow-hidden rounded-[24px] border border-black/5 bg-white px-2 py-5 shadow-[0_12px_24px_rgba(0,0,0,0.04)]">
            <div className="school-marquee-track">
              {[...partnerSchools, ...partnerSchools].map((school, idx) => (
                <div
                  key={`${school}-${idx}`}
                  className="mx-2 flex min-w-[240px] items-center gap-3 rounded-[14px] border border-black/5 bg-[#F8F9FA] px-5 py-3"
                >
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-xs font-black text-[#373737] shadow-sm">
                    학
                  </span>
                  <span className="text-sm font-bold text-[#373737]">{school}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

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
          <h2 className="mb-8 whitespace-nowrap text-[32px] font-black tracking-[-0.03em] text-[#222] md:text-[40px]">
            &ldquo;제약&middot;바이오 인재와 산업을 잇는 가장 단단한 토대가 되는 것&rdquo;
          </h2>

          <p className="mb-3 mt-14 text-xl font-bold text-[#8ABFB2]">Our Mission</p>
          <p className="text-lg leading-relaxed text-[#555] md:text-[22px]">
            &ldquo;우리는 제약&middot;바이오 인재들이 지식의 고립을 넘어 서로를 연결하고,
            <br />
            함께 성장하도록 실질적인 기회를 만듭니다&rdquo;
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-6 pb-28 md:pb-40">
        <div className="mb-12 text-center">
          <p className="mb-3 text-xl font-bold text-[#8ABFB2]">Core Value(핵심가치)</p>
          <h2 className="text-[36px] font-black tracking-[-0.03em] text-[#222] md:text-[44px]">
            연결, 개척, 토대로 만드는 성장의 방향
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3 md:gap-8">
          {[
            {
              title: "연결 (Connect)",
              desc: "개인과 개인을 잇고, 학문과 산업을 연결하여, 세상으로 나아가는 발판을 만듭니다.",
            },
            {
              title: "개척 (Pioneer)",
              desc: "주체적인 도전정신으로 우리의 역량을 산업 전체의 에너지로 확장합니다.",
            },
            {
              title: "토대 (Foundation)",
              desc: "학생과 산업 사이, 구성원이 어느 방향으로든 나아갈 수 있는 신뢰의 기반을 만듭니다.",
            },
          ].map((value, idx) => (
            <div
              key={value.title}
              className="rounded-[30px] border border-white bg-white/80 p-9 shadow-[0_20px_40px_rgba(0,0,0,0.03)] backdrop-blur-2xl transition hover:-translate-y-2 hover:border-[#C1E4D7] hover:shadow-[0_25px_50px_rgba(0,0,0,0.06)]"
              style={{ marginTop: idx * 32 }}
            >
              <h3 className="mb-3 text-[26px] font-extrabold tracking-[-0.03em] text-[#222]">
                {value.title}
              </h3>
              <p className="text-[16px] leading-relaxed text-[#555]">{value.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#F8F9FA] px-6 py-24 md:py-36">
        <div className="mx-auto max-w-[1200px]">
          <div className={`${revealClass} mb-14 text-center`}>
            <p className="mb-2 text-xl font-bold text-[#8EB8C5]">Programs</p>
            <h2 className="mb-4 text-[38px] font-black tracking-[-0.03em] text-[#222] md:text-[44px]">
              학생과 산업을 연결하는 디딤돌
            </h2>
            <p className="text-lg text-[#555] md:text-xl">
              모든 프로그램은 KUSPBA의 핵심가치에서 시작됩니다
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3 md:gap-8">
            {[
              {
                tag: "모집 중",
                title: "연결 : 직무세미나, 봉사활동",
                desc: "직무 세미나 통해 교실 밖 산업 현장과 연결하고,\n사회 공헌활동을 통해 나와 세상을 연결합니다.",
                href: "/seminars",
              },
              {
                tag: "모집 중",
                title: "개척 : 현장실습, 해커톤, 연합학술제",
                desc: "현장실습과 해커톤으로 대학생의 시선에서 산업을 해석하고,\n연합학술제를 통해 학계의 새로운 가능성을 직접 넓혀갑니다.",
                href: "/seminars",
              },
              {
                tag: "준비 중",
                title: "토대 : 디딤돌 프로젝트",
                desc: "디딤돌 프로젝트를 통해\n산업의 언어를 배우고,\n지식의 기반을 쌓아가,\n나만의 디딤돌을 만들어갑니다.",
              },
            ].map((program, idx) => (
              <article
                key={program.title}
                className={`${revealClass} flex min-h-[360px] flex-col rounded-[30px] border border-white bg-white p-8 shadow-[0_10px_30px_rgba(0,0,0,0.04)] transition hover:-translate-y-2 hover:border-[#C1E0E4] hover:shadow-[0_20px_45px_rgba(0,0,0,0.08)] ${idx === 2 ? "bg-white/60" : ""}`}
              >
                <span
                  className={`ml-auto rounded-full px-3.5 py-1 text-xs font-bold ${idx < 2 ? "bg-[#373737] text-white" : "bg-black/5 text-[#555]"}`}
                >
                  {program.tag}
                </span>
                <h3 className="mb-4 mt-6 whitespace-pre-line text-[26px] font-extrabold leading-tight tracking-[-0.03em] text-[#222]">
                  {program.title}
                </h3>
                <p className="mb-8 flex-grow whitespace-pre-line text-[16px] leading-relaxed text-[#555]">
                  {program.desc}
                </p>
                {program.href ? (
                  <Link href={program.href} className="text-sm font-extrabold text-[#373737]">
                    자세히 보기 →
                  </Link>
                ) : (
                  <p className="text-sm font-extrabold text-[#777]">오픈 예정 →</p>
                )}
              </article>
            ))}
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
            청록색 과잠을 입고 제약&middot;바이오 산업의 징검다리가 되기 위해
            <br />
            오늘도 열심히 머무는 KUSPBA의 마스코트랍니다.
          </p>
          <div className="mx-auto mb-8 flex max-w-[580px] items-center justify-center rounded-[34px] bg-white p-16 shadow-[0_30px_60px_rgba(0,0,0,0.08)] transition hover:-translate-y-1">
            <div className="relative h-[220px] w-[220px]">
              <Image
                src="/didimi-mascot.png"
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
            <h3 className="mb-6 text-[30px] font-black tracking-[-0.03em] text-[#222] md:text-[34px]">
              KUSPBA 협회원으로 들어오세요!
            </h3>
            <Link
              href="/seminars"
              className="inline-flex items-center justify-center rounded-full bg-[#373737] px-8 py-3.5 text-[15px] font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#222]"
            >
              협회원 가입하기
            </Link>
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
            학과 단위로 KUSPBA와 함께하세요
          </h2>
          <p className="mb-6 text-lg font-semibold text-black/60 md:text-xl">
            타 대학 제약/바이오 학생들과의 탄탄한 네트워크를 만들어보세요.
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
        .school-marquee-track {
          display: flex;
          width: max-content;
          animation: school-marquee-left 24s linear infinite;
        }
        @keyframes school-marquee-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}
