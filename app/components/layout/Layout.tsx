import { Navbar } from "./Navbar";
import { Content } from "./Content";
import { Footer } from "./Footer";

export const Layout = () => {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center">
      <Navbar />
      <Content />
      <Footer />
    </div>
  );
};

export default Layout;
