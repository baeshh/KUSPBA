interface SeminarDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function SeminarDetailPage({ params }: SeminarDetailPageProps) {
  const { id } = await params;

  return (
    <section className="px-6 py-[120px]">
      <div className="mx-auto max-w-[800px]">
        {/* TODO: 세미나 상세 내용, 신청 폼 구현 */}
        <p className="text-[#86868B]">세미나 ID: {id}</p>
      </div>
    </section>
  );
}
