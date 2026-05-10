import DashboardNavbar from "@/components/DashboardNavbar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <DashboardNavbar />
      <main className="pt-20">{children}</main>
    </>
  );
}
