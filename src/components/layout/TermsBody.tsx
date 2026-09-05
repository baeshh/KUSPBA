export function TermsBody({ text }: { text: string }) {
  const blocks = text
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  return (
    <div className="space-y-5 text-[15px] leading-relaxed text-[#555]">
      {blocks.map((block, index) => {
        const lines = block.split("\n").map((line) => line.trim()).filter(Boolean);
        const isHeading =
          lines.length === 1 &&
          (/^제\s*\d+\s*조/.test(lines[0]) ||
            /^(처리 구분|보관 기록|개인정보처리자|처리 목적|처리 항목|보유·이용기간|처리 근거|안내사항|문의처|항목|내용)/.test(
              lines[0],
            ));

        if (isHeading) {
          return (
            <h2
              key={index}
              className="break-keep pt-2 text-[17px] font-bold tracking-[-0.02em] text-[#1D1D1F]"
            >
              {lines[0]}
            </h2>
          );
        }

        return (
          <div key={index} className="space-y-1.5">
            {lines.map((line, lineIndex) => (
              <p key={lineIndex} className="break-keep whitespace-pre-wrap">
                {line}
              </p>
            ))}
          </div>
        );
      })}
    </div>
  );
}
