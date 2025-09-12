import { useState } from "react";
import { NavLink } from "react-router-dom";
import { ROUTES } from "../../../../config/navigation";
import { BsHouseDoor, BsBoxArrowInRight, BsPersonPlus, BsList, BsX } from "react-icons/bs";
import logo from "../../../../assets/logo.png";

function AuthNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2 px-3 py-2 text-sm font-medium transition-all duration-200 rounded-md ${
      isActive 
        ? "text-blue-600 bg-blue-50 shadow-sm" 
        : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
    }`;

  const mobileNavLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-3 text-base font-medium transition-all duration-200 border-l-4 ${
      isActive 
        ? "text-blue-600 bg-blue-50 border-blue-600" 
        : "text-gray-700 hover:text-blue-600 hover:bg-gray-50 border-transparent hover:border-gray-200"
    }`;

  return (
    <>
      <nav className="sticky top-0 z-50 flex items-center justify-between px-4 py-3 lg:px-6 lg:py-4 shadow-md bg-white/95 backdrop-blur-sm border-b border-gray-100">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="relative">
            <img 
              src={logo} 
              alt="DefinePress Logo" 
              className="w-8 h-8 sm:w-10 sm:h-10 object-contain rounded-full shadow-sm ring-2 ring-gray-100" 
            />
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-600 tracking-tight">
              DefinePress
            </h1>
            {/* <span className="hidden sm:block text-xs text-gray-500 font-medium">
              Definepress
            </span> */}
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-2 lg:gap-4">
          <NavLink
            to={ROUTES.home}
            className={navLinkClasses}
          >
            <BsHouseDoor className="text-lg" />
            <span>Home</span>
          </NavLink>
          <NavLink
            to={ROUTES.login}
            className={navLinkClasses}
          >
            <BsBoxArrowInRight className="text-lg" />
            <span>Login</span>
          </NavLink>
          <NavLink
            to={ROUTES.register}
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all duration-200 rounded-md border ${
                isActive 
                  ? "text-white bg-blue-600 border-blue-600 shadow-md" 
                  : "text-blue-600 bg-white border-blue-600 hover:bg-blue-600 hover:text-white shadow-sm hover:shadow-md"
              }`
            }
          >
            <BsPersonPlus className="text-lg" />
            <span>Get Started</span>
          </NavLink>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="Toggle navigation menu"
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? (
            <BsX className="text-2xl" />
          ) : (
            <BsList className="text-2xl" />
          )}
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-25 md:hidden"
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}

      {/* Mobile Menu */}
      <div className={`
        fixed top-0 right-0 z-50 w-80 max-w-[85vw] h-full bg-white shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden
        ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <img 
              src={logo} 
              alt="DefinePress Logo" 
              className="w-8 h-8 object-contain rounded-full" 
            />
            <h2 className="text-lg font-bold text-gray-800">DefinePress</h2>
          </div>
          <button
            onClick={closeMenu}
            className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors duration-200"
            aria-label="Close menu"
          >
            <BsX className="text-xl" />
          </button>
        </div>

        <nav className="py-4">
          <NavLink
            to={ROUTES.home}
            className={mobileNavLinkClasses}
            onClick={closeMenu}
          >
            <BsHouseDoor className="text-xl" />
            <span>Home</span>
          </NavLink>
          <NavLink
            to={ROUTES.login}
            className={mobileNavLinkClasses}
            onClick={closeMenu}
          >
            <BsBoxArrowInRight className="text-xl" />
            <span>Login</span>
          </NavLink>
          <div className="px-4 py-3">
            <NavLink
              to={ROUTES.register}
              className="flex items-center justify-center gap-2 w-full px-4 py-3 text-base font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg"
              onClick={closeMenu}
            >
              <BsPersonPlus className="text-xl" />
              <span>Get Started</span>
            </NavLink>
          </div>
        </nav>

        {/* Mobile Menu Footer */}
        <div className="absolute bottom-4 left-4 right-4 text-center">
          <p className="text-xs text-gray-500">
            © 2024 DefinePress. All rights reserved.
          </p>
        </div>
      </div>
    </>
  );
}

export default AuthNavbar;
