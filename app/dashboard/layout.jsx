import "@/styles/globals.css";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";

export const metadata = { title: "Hotel Owner Dashboard" };

export default function RootLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1 p-6">
        <Topbar />

        <div className="mt-6">
          <h1 className="text-2xl font-semibold mb-4">Owner Dashboard</h1>
        </div>
        <div lang="en">
          <body>{children}</body>
        </div>
      </main>
    </div>
  );
}
