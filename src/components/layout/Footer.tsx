export function Footer() {
  return (
    <footer className="border-t border-black/5 bg-[#F4F4F5] px-6 py-16 text-[#373737]">
      <div className="mx-auto max-w-[1200px]">
        <div className="rounded-[16px] border border-black/10 bg-[#ECECEC] px-8 py-7 md:px-10">
          <div className="grid gap-8 md:grid-cols-[1.15fr_1.85fr]">
            <div>
              <h3 className="text-[34px] font-black leading-[1.16] tracking-[-0.03em] text-[#1D1D1F] max-md:text-[28px]">
                KUSPBA의
                <br />
                최신 소식을 구독하세요
              </h3>
              <p className="mt-4 text-[14px] text-[#666]">
                협회 활동, 프로그램, 모집 소식을 빠르게 전달해드립니다.
              </p>
            </div>

            <div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-[#555]">이름</label>
                  <input
                    type="text"
                    placeholder="이름"
                    className="h-10 w-full rounded-md border border-black/10 bg-white px-3 text-sm outline-none placeholder:text-[#AAA] focus:border-[#8ABFB2]"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-[#555]">이메일</label>
                  <input
                    type="email"
                    placeholder="이메일 주소"
                    className="h-10 w-full rounded-md border border-black/10 bg-white px-3 text-sm outline-none placeholder:text-[#AAA] focus:border-[#8ABFB2]"
                  />
                </div>
              </div>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs text-[#777]">뉴스레터 구독 시 개인정보 수집 및 이용에 동의합니다.</p>
                <button
                  type="button"
                  className="inline-flex h-10 items-center justify-center rounded-md bg-[#E0001A] px-8 text-sm font-bold text-white transition hover:brightness-95"
                >
                  구독하기
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-0 border-y border-black/10 md:grid-cols-4">
          <div className="border-b border-black/10 px-5 py-5 md:border-b-0 md:border-r">
            <p className="text-xs text-[#777]">문의</p>
            <a
              href="mailto:kuspba@gmail.com"
              className="mt-1 block text-[20px] font-black tracking-[-0.02em] text-[#1D1D1F] hover:underline"
            >
              kuspba@gmail.com
            </a>
            <p className="mt-1 text-xs text-[#777]">이메일로 문의해 주세요.</p>
          </div>
          <div className="border-b border-black/10 px-5 py-5 md:border-b-0 md:border-r">
            <p className="text-xs text-[#777]">계좌</p>
            <p className="mt-1 text-[20px] font-black tracking-[-0.02em] text-[#1D1D1F]">
              국민 474501-01-178256
            </p>
            <p className="mt-1 text-xs text-[#777]">예금주 : 한국대학생제약바이오산업협회</p>
          </div>
          <div className="border-b border-black/10 px-5 py-5 md:border-b-0 md:border-r">
            <p className="text-xs text-[#777]">개인가입 신청</p>
            <a
              href="https://form.naver.com/edit/IyBsxyQhmyRLIPvVLidJWw"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center justify-center rounded-md bg-[#1D1D1F] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-black"
            >
              개인가입 신청하기
            </a>
          </div>
          <div className="px-5 py-5">
            <p className="text-xs text-[#777]">소셜미디어</p>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm font-semibold text-[#444]">
              <a
                href="https://m.blog.naver.com/kuspba?tab=1"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md bg-white px-3 py-1.5 shadow-sm transition hover:text-black"
              >
                블로그
              </a>
              <a
                href="https://www.instagram.com/kuspba_kr/"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md bg-white px-3 py-1.5 shadow-sm transition hover:text-black"
              >
                인스타
              </a>
              <a
                href="https://cafe.naver.com/kuspba"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md bg-white px-3 py-1.5 shadow-sm transition hover:text-black"
              >
                카페
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 text-[#555]">
          <div>
            <div className="mb-3 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold">
              <a href="#" className="hover:text-[#1D1D1F]">
                이용약관
              </a>
              <a href="#" className="hover:text-[#1D1D1F]">
                개인정보처리방침
              </a>
              <a href="#" className="hover:text-[#1D1D1F]">
                공지사항
              </a>
            </div>
            <p className="text-[13px] leading-relaxed text-[#666]">
              사단법인 한국대학생제약바이오산업협회
              <br />
              KUSPBA 공식 채널을 통해 프로그램과 모집 소식을 확인하세요.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
