import Sidebar from "../components/Sidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar is fixed here for all pages inside (dashboard) */}
      <Sidebar />
      <main className="flex-1 bg-gray-50">
        {children}
      </main>
    </div>
  );
}