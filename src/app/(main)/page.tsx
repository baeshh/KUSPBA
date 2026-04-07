"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

const revealClass = "home-reveal";

export default function HomePage() {
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

      <section className="hero-wrap mx-auto flex min-h-[860px] max-w-[1200px] flex-col items-center gap-10 px-6 pb-20 pt-[170px] lg:flex-row">
        <div className={`${revealClass} flex-1`}>
          <span className="mb-6 inline-block rounded-full bg-[#C1E4D7] px-4 py-1.5 text-[13px] font-extrabold text-[#222]">
            전국 유일 대학생제약바이오산업협회
          </span>
          <h1 className="mb-6 text-[52px] font-black leading-[1.12] tracking-[-0.04em] text-[#222] md:text-[64px]">
            우리는 멈춥니다.
            <br />
            당신이 멈추지 않도록.
          </h1>
          <p className="mb-10 text-lg font-medium leading-relaxed text-[#555] md:text-xl">
            학생과 현업을 잇는 가장 단단하고 세련된 디딤돌.
            <br />
            지금 KUSPBA와 함께 제약바이오의 미래를 그리세요.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/seminars"
              className="inline-flex items-center justify-center rounded-full bg-[#373737] px-8 py-3.5 text-[15px] font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#222]"
            >
              세미나 신청하기
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center justify-center rounded-full border border-black/10 bg-white px-8 py-3.5 text-[15px] font-bold text-[#373737] transition hover:-translate-y-0.5 hover:border-[#C1E4D7]"
            >
              협회 둘러보기
            </Link>
          </div>
        </div>
        <div className={`${revealClass} relative flex h-[420px] flex-1 items-center justify-center`}>
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
          <p className="mb-3 text-xl font-bold text-[#8ABFB2]">Our Philosophy</p>
          <h2 className="mb-8 text-[40px] font-black tracking-[-0.03em] text-[#222] md:text-[48px]">
            &quot;우리는 비약보다 연결을 선택합니다&quot;
          </h2>
          <p className="text-lg leading-relaxed text-[#555] md:text-[22px]">
            협회는 언제나 디딤돌을 놓는 방식으로 움직입니다.
            <br />
            누군가의 삶과 산업 사이에, 청년과 전문가 사이에 아직 좁혀지지 않은 간극에
            <br />
            단단한 디딤돌 하나를 놓기 위해 존재합니다.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-6 pb-28 md:pb-40">
        <div className="grid gap-6 md:grid-cols-3 md:gap-8">
          {[
            {
              icon: "🤝",
              title: "연결 (Connect)",
              desc: "산업과 학문, 세대와 세대, 사람과 사람을 잇습니다. 타 학교 학생들과의 탄탄한 네트워크를 형성합니다.",
            },
            {
              icon: "🚀",
              title: "개척 (Pioneer)",
              desc: "주체적인 도전정신으로 산업의 경계를 넓힙니다. 제약·바이오 산업의 공공성과 가능성을 탐구합니다.",
            },
            {
              icon: "🏗️",
              title: "토대 (Foundation)",
              desc: "산업의 미래를 떠받치고 변화의 불씨가 됩니다. 청년과 전문가 사이의 간극에 단단한 디딤돌을 놓습니다.",
            },
          ].map((value, idx) => (
            <div
              key={value.title}
              className={`${revealClass} rounded-[30px] border border-white bg-white/80 p-9 shadow-[0_20px_40px_rgba(0,0,0,0.03)] backdrop-blur-2xl transition hover:-translate-y-2 hover:border-[#C1E4D7] hover:shadow-[0_25px_50px_rgba(0,0,0,0.06)]`}
              style={{ marginTop: idx * 32 }}
            >
              <p className="mb-4 text-4xl">{value.icon}</p>
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
              학생과 현업을 연결하는 디딤돌
            </h2>
            <p className="text-lg text-[#555] md:text-xl">
              KUSPBA가 제공하는 실질적이고 깊이 있는 3단계 성장 구조
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3 md:gap-8">
            {[
              {
                tag: "모집 중",
                title: "1단계 : 진로탐색 기반\n현직자 연결",
                desc: "직무 세미나와 다대일 멘토링을 통해 제약바이오 산업의 진입장벽을 낮춥니다.",
                href: "/seminars",
              },
              {
                tag: "모집 중",
                title: "2단계 : 깊이 있는\n진로 설계 도움",
                desc: "일대일 멘토링과 관계형 학습을 통해 타 대학 학생들과 교류하며 나만의 길을 설계합니다.",
                href: "/seminars",
              },
              {
                tag: "준비 중",
                title: "3단계 : 실전을 통한\n스펙과 커리어 연결",
                desc: "기업 연계 프로젝트, 인턴십, 공모전을 통해 단순한 학습을 넘어 실전 스펙을 형성합니다.",
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
                <div className="mb-6 mt-6 h-14 w-14 rounded-2xl bg-gradient-to-br from-white to-[#f1f3f5] shadow-inner" />
                <h3 className="mb-4 whitespace-pre-line text-[26px] font-extrabold leading-tight tracking-[-0.03em] text-[#222]">
                  {program.title}
                </h3>
                <p className="mb-8 flex-grow text-[16px] leading-relaxed text-[#555]">
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

      <section className="mx-auto max-w-[1000px] px-6 py-24 text-center md:py-36">
        <div className={revealClass}>
          <p className="mb-3 text-xl font-bold text-[#8EB8C5]">Mascot</p>
          <h2 className="mb-5 text-[42px] font-black tracking-[-0.04em] text-[#222] md:text-[48px]">
            든든한 빌더, 디딤이
          </h2>
          <p className="mb-12 text-lg leading-relaxed text-[#555] md:text-xl">
            청록색 과잠을 입고 제약/바이오 산업의 징검다리가 되기 위해
            <br />
            오늘도 열심히 달리는 KUSPBA의 마스코트랍니다.
          </p>
          <div className="mx-auto mb-8 flex max-w-[580px] items-center justify-center rounded-[34px] bg-white p-16 shadow-[0_30px_60px_rgba(0,0,0,0.08)] transition hover:-translate-y-1">
            <p className="text-[88px] leading-none">🐢</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <span className="rounded-full bg-[#F8F9FA] px-5 py-2.5 text-sm font-bold text-[#222]">
              🐢 06년생 (Born in 2006)
            </span>
            <span className="rounded-full bg-[#F8F9FA] px-5 py-2.5 text-sm font-bold text-[#222]">
              🎓 한국대학교 재학중
            </span>
          </div>
        </div>
      </section>

      <section id="inquiry" className="mx-auto max-w-[1200px] px-6 pb-24 md:pb-40">
        <div
          className={`${revealClass} rounded-[34px] border border-white/70 px-8 py-16 text-center shadow-[0_20px_40px_rgba(193,228,215,0.3)] md:px-10`}
          style={{
            background:
              "linear-gradient(135deg, rgba(193,228,215,1) 0%, rgba(193,224,228,1) 100%)",
          }}
        >
          <h2 className="mb-3 text-[34px] font-black tracking-[-0.03em] text-[#222] md:text-[40px]">
            학과 단위로 KUSPBA와 함께하세요
          </h2>
          <p className="mb-9 text-lg font-semibold text-black/60 md:text-xl">
            타 대학 제약/바이오 학생들과의 탄탄한 네트워크를 만들어보세요.
          </p>
          <a
            href="https://pf.kakao.com/_XHhSn"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full bg-[#373737] px-8 py-4 text-base font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#222]"
          >
            💬 카카오톡으로 제휴 문의하기
          </a>
        </div>
      </section>

      <style jsx global>{`
        .home-reveal {
          opacity: 0;
          transform: translateY(44px);
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
      `}</style>
    </div>
  );
}
