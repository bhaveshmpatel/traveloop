import DashboardNavbar from "@/components/DashboardNavbar";

export default function ExploreLayout({
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
