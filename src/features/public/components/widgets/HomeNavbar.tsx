import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { 
  BsHouseDoor, 
  BsNewspaper, 
  BsTag, 
  BsPerson, 
  BsList, 
  BsX 
} from "react-icons/bs";
import logo from "../../../../assets/logo.png";

/**
 * Route configuration object defining all application routes
 */
const ROUTES = {
  home: "/",
  politics: "/politics",
  sports: "/sports",
  technology: "/technology",
  business: "/business",
  accounts: "/auth/login",
} as const;

/**
 * Type definition for route keys
 */
// type RouteKey = keyof typeof ROUTES;

/**
 * Interface for navigation item structure
 */
interface NavItem {
  name: string;
  path: string;
  icon: React.ReactElement;
  isCallToAction?: boolean;
}

/**
 * Interface for HomeNavbar component props
 */
interface HomeNavbarProps {
  className?: string;
  onMobileMenuToggle?: (isOpen: boolean) => void;
}

/**
 * Professional navigation bar component for DefinePress application
 * 
 * Features:
 * - Responsive design with mobile menu support
 * - Active route highlighting
 * - Accessibility compliant
 * - TypeScript type safety
 * - Modern styling with Tailwind CSS
 * 
 * @param props - Component props
 * @returns JSX.Element
 */
const HomeNavbar: React.FC<HomeNavbarProps> = ({ 
  className = "", 
  onMobileMenuToggle 
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  /**
   * Navigation items configuration
   */
  const navItems: NavItem[] = [
    { 
      name: "Home", 
      path: ROUTES.home, 
      icon: <BsHouseDoor aria-hidden="true" /> 
    },
    { 
      name: "Politics", 
      path: ROUTES.politics, 
      icon: <BsNewspaper aria-hidden="true" /> 
    },
    { 
      name: "Sports", 
      path: ROUTES.sports, 
      icon: <BsNewspaper aria-hidden="true" /> 
    },
    { 
      name: "Business", 
      path: ROUTES.business, 
      icon: <BsTag aria-hidden="true" /> 
    },
    { 
      name: "Technology", 
      path: ROUTES.technology, 
      icon: <BsTag aria-hidden="true" /> 
    },
  ];

  /**
   * Account navigation item (Call-to-Action)
   */
  const accountNavItem: NavItem = {
    name: "Accounts",
    path: ROUTES.accounts,
    icon: <BsPerson aria-hidden="true" />,
    isCallToAction: true,
  };

  /**
   * Handles mobile menu toggle
   */
  const handleMobileMenuToggle = (): void => {
    const newState = !isMobileMenuOpen;
    setIsMobileMenuOpen(newState);
    onMobileMenuToggle?.(newState);
  };

  /**
   * Handles mobile menu item click
   */
  const handleMobileNavClick = (): void => {
    setIsMobileMenuOpen(false);
    onMobileMenuToggle?.(false);
  };

  /**
   * Generates CSS classes for navigation links
   */
  const getNavLinkClasses = (isActive: boolean, isCallToAction?: boolean): string => {
    const baseClasses = "flex items-center gap-2 font-medium text-sm px-3 py-2 rounded transition-all duration-200";
    
    if (isCallToAction) {
      return `${baseClasses} text-white bg-blue-600 hover:bg-blue-700 shadow-md transform hover:scale-105`;
    }
    
    return `${baseClasses} ${
      isActive
        ? "text-blue-600 bg-blue-50 border-b-2 border-blue-600"
        : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
    }`;
  };

  return (
    <nav 
      className={`w-full bg-white shadow-lg sticky top-0 z-50 border-b border-gray-200 ${className}`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          
          {/* Logo and Brand Section */}
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="DefinePress Logo"
              className="w-10 h-10 object-contain rounded-full shadow-sm"
              loading="lazy"
            />
            <h1 className="text-2xl font-bold text-blue-600 tracking-wide">
              DefinePress
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => getNavLinkClasses(isActive)}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.name}</span>
              </NavLink>
            ))}

            {/* Accounts CTA Button */}
            <NavLink
              to={accountNavItem.path}
              className={({ isActive }) => getNavLinkClasses(isActive, true)}
            >
              <span className="text-lg">{accountNavItem.icon}</span>
              <span>{accountNavItem.name}</span>
            </NavLink>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="lg:hidden p-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200"
            onClick={handleMobileMenuToggle}
            aria-expanded={isMobileMenuOpen ? "true" : "false"}
            aria-controls="mobile-menu"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? (
              <BsX className="w-6 h-6" />
            ) : (
              <BsList className="w-6 h-6" />
            )}
          </button>

        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div 
            id="mobile-menu"
            className="lg:hidden pb-4 border-t border-gray-200 mt-2"
          >
            <div className="flex flex-col gap-2 pt-4">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={handleMobileNavClick}
                  className={({ isActive }) => getNavLinkClasses(isActive)}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.name}</span>
                </NavLink>
              ))}
              
              {/* Mobile Accounts Button */}
              <NavLink
                to={accountNavItem.path}
                onClick={handleMobileNavClick}
                className={({ isActive }) => getNavLinkClasses(isActive, true)}
              >
                <span className="text-lg">{accountNavItem.icon}</span>
                <span>{accountNavItem.name}</span>
              </NavLink>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default HomeNavbar;

// Export types for external use
export type { HomeNavbarProps, NavItem };
export { ROUTES };
