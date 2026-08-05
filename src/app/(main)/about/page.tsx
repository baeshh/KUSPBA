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
          인재와 산업을 잇는
          <br />
          <span className="bg-gradient-to-br from-[#427A72] to-[#4A6C82] bg-clip-text text-transparent">
            우리의 첫걸음
          </span>
        </h1>
        <p className="text-xl leading-relaxed text-[#86868B]">
          전국 유일의 대학생제약바이오산업협회 KUSPBA는 제약&middot;바이오 인재와
          산업을 연결하고, 더 나은 미래를 위한 첫걸음을 설계하기 위해
          모였습니다.
        </p>
      </section>

      <section className="mb-24">
        <span className="mb-4 block text-sm font-bold uppercase tracking-wider text-[#427A72]">
          Our Message
        </span>
        <h2 className="mb-6 text-3xl font-bold">
          &quot;우리는 머뭅니다, 당신이 멈추지 않도록&quot;
        </h2>
        <p className="mb-6 text-lg leading-relaxed text-[#86868B]">
          우리는 거대한 흐름 앞에서도 정의롭고 떳떳하게 사회를 직시합니다.
          제약·바이오 산업의 공공성과 가능성을 지성과 열정으로 개척해
          나갑니다.
        </p>
        <p className="mb-0 text-lg leading-relaxed text-[#86868B]">
          우리의 철학{" "}
          <strong className="font-bold text-[#373737]">
            &apos;호연지기(浩然之氣)&apos;
          </strong>
          는 단순한 산업의 미래만을 위한 것이 아닙니다.{" "}
          <strong className="font-bold text-[#373737]">
            &quot;어떤 존재로 살아갈 것인가&quot;
          </strong>
          에 대한 질문이자, 대학생인 우리가 그 해답을 만들어가는 여정입니다.
        </p>
      </section>

      <section className="mb-24">
        <span className="mb-4 block text-sm font-bold uppercase tracking-wider text-[#427A72]">
          Chairperson Message
        </span>
        <div className="grid items-start gap-6 rounded-[28px] border border-black/[0.08] bg-white p-8 md:grid-cols-[200px_1fr] md:gap-8 md:p-10 lg:grid-cols-[220px_1fr]">
          <div className="mx-auto w-full max-w-[200px] md:mx-0 md:max-w-none">
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[18px] border border-black/10 bg-[#F8F9FA]">
              <Image
                src="/chairperson.png"
                alt="KUSPBA 협회장 박찬희"
                fill
                sizes="220px"
                className="object-cover object-top"
                priority
              />
            </div>
            <div className="mt-4 text-left">
              <p className="text-[18px] font-bold tracking-[-0.02em] text-[#1D1D1F]">
                박찬희
              </p>
              <p className="mt-1 text-[13px] leading-snug text-[#888]">
                한국대학생제약바이오산업협회 협회장
              </p>
            </div>
          </div>

          <div className="min-w-0">
            <h3 className="mb-4 text-2xl font-bold tracking-[-0.02em] text-[#1D1D1F]">
              협회장 소개 및 인사말
            </h3>
            <div className="space-y-4 text-[16px] leading-relaxed break-keep text-[#555]">
              <p>
                안녕하세요,
                <br />
                한국대학생제약바이오산업협회(KUSPBA) 협회장 박찬희입니다.
              </p>
              <p>
                <strong className="font-bold text-[#1D1D1F]">
                  &ldquo;걷는 자에게 절망은 없습니다.&rdquo;
                </strong>
                <br />
                앞으로 나아가겠다는 선택을 한 순간, 우리는 이미 멈춰 있지 않습니다.
              </p>
              <p>
                KUSPBA는 그 길 위에서, 대학생이 산업으로 나아갈 수 있도록 돕는
                디딤돌 같은 존재가 되고자 합니다.
              </p>
              <p>
                제약&middot;바이오산업은 높은 전문성과 복잡한 구조를 가진 분야이지만,
                대학생이 이를 실제로 이해하고 진입할 수 있는 경로는 여전히 제한적입니다.
                협회는 이 간극을 연결하고, 단순한 경험을 넘어 지속 가능한 기회와 성장의
                구조를 만들어가고 있습니다.
              </p>
              <p>
                또한 협회원 한 사람 한 사람이 협회 안에서 경험을 공유하고, 하나의
                정체성과 연결을 만들어갈 수 있도록 노력하고 있습니다.
              </p>
              <p>
                앞으로도 KUSPBA는 변하지 않는 방향성과 함께, 여러분이 흔들림 없이
                나아갈 수 있도록 그 자리를 지키겠습니다.
              </p>
              <p>감사합니다.</p>
            </div>
          </div>
        </div>
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
              연결 (Connection)
            </h3>
            <p className="m-0 text-[15px] leading-relaxed text-[#86868B]">
              개인과 개인을 잇고, 학문과 산업을 연결하여, 세상으로 나아가는
              발판을 만듭니다.
            </p>
          </div>
          <div className="rounded-[24px] border border-black/[0.08] bg-white p-8">
            <h3 className="mb-3 text-xl font-bold text-[#1D1D1F]">
              개척 (Pioneer)
            </h3>
            <p className="m-0 text-[15px] leading-relaxed text-[#86868B]">
              주체적인 도전 정신으로 내부의 역량을 산업 전체의 에너지로
              확장합니다.
            </p>
          </div>
          <div className="rounded-[24px] border border-black/[0.08] bg-white p-8">
            <h3 className="mb-3 text-xl font-bold text-[#1D1D1F]">
              토대 (Foundation)
            </h3>
            <p className="m-0 text-[15px] leading-relaxed text-[#86868B]">
              학생과 산업 사이, 구성원이 어느 방향으로든 나아갈 수 있는 신뢰의
              기반을 만듭니다.
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
            대학생들과 산업 사이, 아직 메워지지 않은 그 간극에 &lsquo;우리는&rsquo;
            디딤돌을 놓습니다.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4 rounded-2xl bg-[#FBFBFD] p-5 md:gap-6">
            <div className="relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-transparent md:h-28 md:w-28">
              <Image
                src="/didimi.png"
                alt="디딤이 - KUSPBA 마스코트"
                width={120}
                height={120}
                className="h-full w-full object-contain"
              />
            </div>
            <div className="text-left">
              <p className="mb-1 text-base font-semibold text-[#1D1D1F]">
                뚜벅뚜벅 길을 내는 듬직한 거북이 디딤이
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
