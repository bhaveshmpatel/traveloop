import DashboardNavbar from "@/components/DashboardNavbar";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <DashboardNavbar />
      <main className="pt-16 min-h-screen bg-background">{children}</main>
    </>
  );
}
