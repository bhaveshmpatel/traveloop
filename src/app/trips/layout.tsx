import DashboardNavbar from "@/components/DashboardNavbar";

export default function TripsLayout({
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
