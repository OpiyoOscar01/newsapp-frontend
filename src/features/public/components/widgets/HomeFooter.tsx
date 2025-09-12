import { BsTwitter, BsFacebook, BsInstagram } from "react-icons/bs";

function HomeFooter() {
  return (
    <footer className="bg-gray-50 text-gray-700 text-sm mt-10 shadow-inner">
      <div className="container mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Logo & Copyright */}
        <div className="flex flex-col md:flex-row items-center gap-3">
          <h2 className="text-xl font-semibold text-blue-600">DefinePress</h2>
          <p className="text-gray-600 text-center md:text-left">
            © {new Date().getFullYear()} All rights reserved.
          </p>
        </div>

        {/* Policy Links */}
        <div className="flex flex-wrap justify-center gap-6">
          <a
            href="/privacy-policy"
            className="hover:text-blue-600 transition-colors"
          >
            Privacy Policy
          </a>
          <a
            href="/terms-of-service"
            className="hover:text-blue-600 transition-colors"
          >
            Terms of Service
          </a>
          <a
            href="/contact"
            className="hover:text-blue-600 transition-colors"
          >
            Contact Us
          </a>
        </div>

        {/* Social Media Links */}
        <div className="flex flex-col items-center md:items-end gap-2">
          <p className="font-medium text-gray-700">Follow us on:</p>
          <div className="flex gap-4">
            <a
              href="https://twitter.com/custospace"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-700 transition-colors"
              aria-label="DefinePress Twitter"
            >
              <BsTwitter size={22} />
            </a>
            <a
              href="https://facebook.com/custospace"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 transition-colors"
              aria-label="DefinePress Facebook"
            >
              <BsFacebook size={22} />
            </a>
            <a
              href="https://instagram.com/custospace"
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-500 hover:text-pink-700 transition-colors"
              aria-label="DefinePress Instagram"
            >
              <BsInstagram size={22} />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Divider */}
      <div className="mt-6 border-t border-gray-200"></div>
    </footer>
  );
}

export default HomeFooter;
