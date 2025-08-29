import { Navbar } from "./Navbar";
import { Content } from "./Content";
import { Footer } from "./Footer";
import { SidebarProvider } from "../ui";
import { LayoutSidebar } from "./LayoutSidebar";

export const Layout = () => {
  return (
    <SidebarProvider defaultOpen={false}>
      <LayoutSidebar />
      <div className="flex min-h-screen w-full flex-col items-center justify-center">
        <div className="w-full p-2 md:p-4">
          <Navbar />
        </div>
        <Content />
        <div className="w-full p-2 md:p-4">
          <Footer />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
