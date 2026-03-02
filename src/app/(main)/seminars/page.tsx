import { ProgramCard } from "@/components/seminars/ProgramCard";
import { MOCK_SEMINARS } from "@/lib/seminars";

export default function SeminarsPage() {
  return (
    <section className="px-6 py-[120px]">
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-16 text-center">
          <h1 className="mb-3 text-4xl font-bold">세미나 & 교육 프로그램</h1>
          <p className="text-lg text-[#86868B]">
            KUSPBA와 함께 제약/바이오 현업의 생생한 지식을 경험하세요.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {MOCK_SEMINARS.map((seminar) => (
            <ProgramCard
              key={seminar.id}
              id={seminar.id}
              title={seminar.title}
              applicationPeriod={seminar.applicationPeriod}
              status={seminar.status}
              imageUrl={seminar.imageUrl}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
