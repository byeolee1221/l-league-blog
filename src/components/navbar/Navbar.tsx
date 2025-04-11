import MobileNavbar from "./MobileNavbar";
import NavbarContents from "./NavbarContents";

const Navbar = () => {
  return (
    <header>
      <div className="fixed top-0 right-0 left-0 z-50 border-b border-gray-200 bg-white">
        <NavbarContents />
      </div>
      <MobileNavbar />
    </header>
  );
};

export default Navbar;
