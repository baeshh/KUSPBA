import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getCurrentUser } from "@/lib/auth";
import { displayName } from "@/lib/profile";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <>
      <Header currentUser={user ? { id: user.id, name: displayName(user.name) } : null} />
      <main>{children}</main>
      <Footer />
    </>
  );
}
