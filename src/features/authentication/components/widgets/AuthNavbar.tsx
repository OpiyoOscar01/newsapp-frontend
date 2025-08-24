import { NavLink } from "react-router-dom";
import { ROUTES } from "../../../../config/navigation";
import { BsHouseDoor, BsBoxArrowInRight, BsPersonPlus } from "react-icons/bs";
import logo from "../../../assets/logo.png"; // Adjust the path to your logo image

function AuthNavbar() {
  return (
    <nav className="flex items-center justify-between p-4 shadow-sm bg-white">
      {/* Logo and Brand */}
      <div className="flex items-center gap-3">
        <img src={logo} alt="Logo" className="w-8 h-8 object-contain rounded-full" />
        <h2 className="text-xl font-semibold text-gray-800">Newly</h2>
      </div>

      {/* Navigation Links */}
      <div className="flex items-center gap-6">
        <NavLink
          to={ROUTES.home}
          className={({ isActive }) =>
            `flex items-center gap-1 text-sm font-medium ${
              isActive ? "text-blue-600 underline" : "text-gray-700 hover:text-blue-600"
            }`
          }
        >
          <BsHouseDoor className="text-lg" />
          Home
        </NavLink>
        <NavLink
          to={ROUTES.login}
          className={({ isActive }) =>
            `flex items-center gap-1 text-sm font-medium ${
              isActive ? "text-blue-600 underline" : "text-gray-700 hover:text-blue-600"
            }`
          }
        >
          <BsBoxArrowInRight className="text-lg" />
          Login
        </NavLink>
        <NavLink
          to={ROUTES.register}
          className={({ isActive }) =>
            `flex items-center gap-1 text-sm font-medium ${
              isActive ? "text-blue-600 underline" : "text-gray-700 hover:text-blue-600"
            }`
          }
        >
          <BsPersonPlus className="text-lg" />
          Register
        </NavLink>
      </div>
    </nav>
  );
}

export default AuthNavbar;
