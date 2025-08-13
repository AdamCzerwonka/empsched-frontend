import { Navbar } from "./Navbar";
import { Content } from "./Content";
import { Footer } from "./Footer";

export const Layout = () => {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center">
      <div className="w-full p-2 md:p-4">
        <Navbar />
      </div>
      <Content />
      <div className="w-full p-2 md:p-4">
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
