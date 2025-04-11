import NavbarContents from "./NavbarContents";

const Navbar = () => {
  return (
    <header>
      <div className="fixed left-0 right-0 top-0 z-50 bg-white border-b border-gray-200">
        <NavbarContents />
      </div>
    </header>
  );
};

export default Navbar;
