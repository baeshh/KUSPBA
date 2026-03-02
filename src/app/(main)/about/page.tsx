import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "협회 소개 | KUSPBA",
  description: "전국 유일의 대학생제약바이오산업협회 KUSPBA. 연결, 개척, 토대의 가치로 세상을 잇습니다.",
};

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-[860px] px-6 pb-20 pt-[120px]">
      <Link
        href="/"
        className="mb-10 inline-flex items-center gap-2 px-0 py-2 text-[15px] font-medium text-[#86868B] transition-colors hover:-translate-x-1 hover:text-[#427A72]"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
        메인으로 돌아가기
      </Link>

      <section className="mb-20">
        <h1 className="mb-6 text-[48px] font-bold leading-tight tracking-[-0.03em] max-md:text-[36px]">
          세상과 산업을 잇는
          <br />
          <span className="bg-gradient-to-br from-[#427A72] to-[#4A6C82] bg-clip-text text-transparent">
            우리의 첫걸음
          </span>
        </h1>
        <p className="text-xl leading-relaxed text-[#86868B]">
          전국 유일의 대학생제약바이오산업협회 KUSPBA는 제약 바이오 산업과
          사회를 연결하고, 더 나은 미래를 위한 첫걸음을 설계하기 위해
          모였습니다.
        </p>
      </section>

      <section className="mb-24">
        <span className="mb-4 block text-sm font-bold uppercase tracking-wider text-[#427A72]">
          Our Message
        </span>
        <h2 className="mb-6 text-3xl font-bold">
          &quot;우리는 머뭅니다. 당신이 멈추지 않도록.&quot;
        </h2>
        <p className="mb-6 text-lg leading-relaxed text-[#86868B]">
          우리는 거대한 흐름 앞에서도 정의롭고 떳떳하게 사회를 직시합니다.
          제약·바이오 산업의 공공성과 가능성을 지성과 열정으로 개척해
          나갑니다.
        </p>
        <p className="mb-0 text-lg leading-relaxed text-[#86868B]">
          우리의 철학 &apos;호연지기(浩然之氣)&apos;는 단순한 산업의 미래만을
          위한 것이 아닙니다. &quot;어떤 존재로 살아갈 것인가&quot;에 대한
          질문이자, 대학생인 우리가 그 해답을 만들어가는 여정입니다.
        </p>
      </section>

      <section className="mb-24">
        <span className="mb-4 block text-sm font-bold uppercase tracking-wider text-[#427A72]">
          Core Values
        </span>
        <h2 className="mb-10 text-3xl font-bold">
          KUSPBA가 추구하는 세 가지 가치
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-[24px] border border-black/[0.08] bg-white p-8">
            <h3 className="mb-3 text-xl font-bold text-[#1D1D1F]">
              연결 (Connect)
            </h3>
            <p className="m-0 text-[15px] leading-relaxed text-[#86868B]">
              산업과 학문, 세대와 세대, 사람과 사람을 잇습니다. 타 대학 관련
              학과 학생들과 교류하며 생동감 있는 네트워크를 구축합니다.
            </p>
          </div>
          <div className="rounded-[24px] border border-black/[0.08] bg-white p-8">
            <h3 className="mb-3 text-xl font-bold text-[#1D1D1F]">
              개척 (Pioneer)
            </h3>
            <p className="m-0 text-[15px] leading-relaxed text-[#86868B]">
              주체적인 도전정신으로 산업의 경계를 넓힙니다. 대학생만이 가질 수
              있는 상상력으로 산업과 사회를 새롭게 해석합니다.
            </p>
          </div>
          <div className="rounded-[24px] border border-black/[0.08] bg-white p-8">
            <h3 className="mb-3 text-xl font-bold text-[#1D1D1F]">
              토대 (Foundation)
            </h3>
            <p className="m-0 text-[15px] leading-relaxed text-[#86868B]">
              산업의 미래를 떠받치고 변화의 불씨가 됩니다. 누군가 내일을
              건너는 튼튼한 발판이 되도록 스스로를 단단히 다집니다.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-24">
        <div className="rounded-[32px] border border-black/[0.08] bg-white px-8 py-14 text-center shadow-[0_20px_40px_rgba(0,0,0,0.02)] md:px-14">
          <span className="mb-4 flex justify-center text-sm font-bold uppercase tracking-wider text-[#427A72]">
            Our Philosophy
          </span>
          <h3 className="mb-5 text-[28px] font-bold">
            우리는 &apos;빌더(Builder)&apos; 입니다
          </h3>
          <p className="mb-6 text-[#86868B]">
            우리는 단숨에 도달하기보다는 비약 없는 <strong>연결</strong>을
            선택합니다.
            <br />
            청년과 전문가 사이, 아직 좁혀지지 않은 간극에 작지만 결정적인
            &apos;디딤돌&apos;을 놓습니다.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4 rounded-2xl bg-[#FBFBFD] p-5 md:gap-6">
            <Image
              src="/didimi.png"
              alt="디딤이 - KUSPBA 마스코트"
              width={120}
              height={120}
              className="h-24 w-24 shrink-0 object-contain md:h-28 md:w-28"
            />
            <div className="text-left">
              <p className="mb-1 text-base font-semibold text-[#1D1D1F]">
                뚜벅뚜벅 길을 내는 듬직한 거북이, 디딤이
              </p>
              <p className="m-0 text-sm text-[#86868B]">
                함께 성장하는 빌더들의 진심과 호연지기를 상징합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="border-t border-black/[0.08] pt-16 text-center">
        <h2 className="mb-6 text-2xl font-bold">
          이제 KUSPBA와 함께 여정을 시작해 보세요.
        </h2>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-full bg-[#1D1D1F] px-8 py-4 text-base font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-black hover:shadow-lg"
        >
          메인 화면으로 돌아가기
        </Link>
      </div>
    </main>
  );
}
