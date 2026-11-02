import { Outlet } from "react-router-dom";

import TopBar from "@/components/public/TopBar";
import SiteHeader from "@/components/public/SiteHeader";
import Footer from "@/components/public/Footer";

function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-white">

      <TopBar />

      <SiteHeader />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />

    </div>
  );
}

export default PublicLayout;