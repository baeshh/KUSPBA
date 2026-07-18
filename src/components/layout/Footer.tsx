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
      <path d="M12 2C6.48 2 2 5.92 2 10.8c0 3.12 1.92 5.84 4.8 7.36L6 22l4.08-2.16c.64.12 1.28.16 1.92.16 5.52 0 10-3.92 10-8.8S17.52 2 12 2m-2.4 12.4H7.2V8.8h1.2l1.68 3.92h.08L11.84 8.8H13v5.6h-1.44v-3.68h-.08l-1.6 3.68H9.6m7.68 0h-3.36V8.8h3.36v1.12h-1.92v1.04h1.76v1.08h-1.76v1.24h1.92z" />
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
    <footer className="border-t border-black/5 bg-[#F4F4F5] px-6 py-16 text-[#373737]">
      <div className="mx-auto max-w-[1200px]">
        <div className="grid gap-0 border-y border-black/10 md:grid-cols-3">
          <div className="border-b border-black/10 px-5 py-5 md:border-b-0 md:border-r">
            <p className="text-xs text-[#777]">문의</p>
            <a
              href="mailto:kuspba@gmail.com"
              className="mt-1 block text-[20px] font-black tracking-[-0.02em] text-[#1D1D1F] hover:underline"
            >
              kuspba@gmail.com
            </a>
          </div>
          <div className="border-b border-black/10 px-5 py-5 md:border-b-0 md:border-r">
            <p className="text-xs text-[#777]">계좌</p>
            <p className="mt-1 text-[20px] font-black tracking-[-0.02em] text-[#1D1D1F]">
              국민 474501-01-178256
            </p>
            <p className="mt-1 text-xs text-[#777]">예금주 : 한국대학생제약바이오산업협회</p>
          </div>
          <div className="px-5 py-5">
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
