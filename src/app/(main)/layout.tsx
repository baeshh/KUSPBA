import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getCurrentUser } from "@/lib/auth";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <>
      <Header currentUser={user ? { id: user.id, name: user.name } : null} />
      <main>{children}</main>
      <Footer />
    </>
  );
}
