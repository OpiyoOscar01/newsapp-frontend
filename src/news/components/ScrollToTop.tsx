import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // optional: use "auto" if you prefer instant jump
    });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
