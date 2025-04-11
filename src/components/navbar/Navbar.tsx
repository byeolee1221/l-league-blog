import { cookies } from "next/headers";
import MobileNavbar from "./MobileNavbar";
import NavbarContents from "./NavbarContents";

const Navbar = async () => {
  const cookieStore = await cookies();
  const isLoggedIn = !!cookieStore.get("access_token");

  return (
    <header>
      <div className="fixed top-0 right-0 left-0 z-50 border-b border-gray-200 bg-white">
        <NavbarContents isLoggedIn={isLoggedIn} />
      </div>
      <MobileNavbar />
    </header>
  );
};

export default Navbar;
