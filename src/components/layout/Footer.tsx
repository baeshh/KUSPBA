function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8A3.6 3.6 0 0 0 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6A3.6 3.6 0 0 0 16.4 4H7.6m9.65 1.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5M12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10m0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
    </svg>
  );
}

function NaverBlogIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M16.273 12.845 7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727z" />
    </svg>
  );
}

function NaverCafeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      {/* 네이버 카페 앱스토어 공식 앱 아이콘 형태, 푸터 모노톤에 맞춤 */}
      <rect x="3" y="3" width="18" height="18" rx="4.5" />
      <path
        d="M7.4 8.2c0-.4.32-.7.72-.7h7.76c.4 0 .72.3.72.7v6.05c0 .4-.32.7-.72.7H12.2L9.7 16.9a.55.55 0 0 1-.9-.43v-1.5H8.12c-.4 0-.72-.3-.72-.7z"
        fill="white"
      />
      <path
        d="M9.15 10.05h1.55l.85 2.35h.06l.88-2.35h1.5v3.55h-1.05v-2.35h-.05l-.9 2.32h-.78l-.9-2.32h-.06v2.35H9.15z"
        fill="currentColor"
      />
    </svg>
  );
}

const socialLinks = [
  {
    href: "https://m.blog.naver.com/kuspba?tab=1",
    label: "네이버 블로그",
    icon: NaverBlogIcon,
  },
  {
    href: "https://www.instagram.com/kuspba_kr/",
    label: "인스타그램",
    icon: InstagramIcon,
  },
  {
    href: "https://cafe.naver.com/kuspba",
    label: "네이버 카페",
    icon: NaverCafeIcon,
  },
];

export function Footer() {
  return (
    <footer className="border-t border-black/5 bg-[#F4F4F5] px-4 py-10 pb-[max(2.5rem,env(safe-area-inset-bottom))] text-[#373737] sm:px-6 md:py-16">
      <div className="mx-auto max-w-[1200px]">
        <div className="grid gap-0 border-y border-black/10 md:grid-cols-3">
          <div className="border-b border-black/10 px-1 py-4 sm:px-5 sm:py-5 md:border-b-0 md:border-r">
            <p className="text-xs text-[#777]">문의</p>
            <a
              href="mailto:kuspba@gmail.com"
              className="mt-1 block break-all text-[18px] font-black tracking-[-0.02em] text-[#1D1D1F] hover:underline md:text-[20px]"
            >
              kuspba@gmail.com
            </a>
          </div>
          <div className="border-b border-black/10 px-1 py-4 sm:px-5 sm:py-5 md:border-b-0 md:border-r">
            <p className="text-xs text-[#777]">계좌</p>
            <p className="mt-1 break-keep text-[18px] font-black tracking-[-0.02em] text-[#1D1D1F] md:text-[20px]">
              국민 474501-01-178256
            </p>
            <p className="mt-1 text-xs text-[#777]">예금주 : 한국대학생제약바이오산업협회</p>
          </div>
          <div className="px-1 py-4 sm:px-5 sm:py-5">
            <p className="text-xs text-[#777]">소셜미디어</p>
            <div className="mt-3 flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.href}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#1D1D1F] shadow-sm transition hover:-translate-y-0.5 hover:bg-[#E8F0EE] hover:text-[#427A72]"
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 text-[#555]">
          <p className="text-[13px] leading-relaxed text-[#666]">
            한국대학생제약바이오산업협회
            <br />
            KUSPBA 공식 채널을 통해 프로그램과 모집 소식을 확인하세요.
          </p>
        </div>
      </div>
    </footer>
  );
}
