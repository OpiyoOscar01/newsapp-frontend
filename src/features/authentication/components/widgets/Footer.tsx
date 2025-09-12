import {
  BsTwitter,
  BsFacebook,
  BsInstagram,
} from "react-icons/bs";

function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-700 text-sm py-6 mt-10">
      {/* Copyright */}
      <div className="text-center mb-2">
        <p>© {new Date().getFullYear()} Definepress. All rights reserved.</p>
      </div>

      {/* Policy Links */}
      <div className="flex items-center justify-center gap-6 mt-4">
        <a href="/privacy-policy" className="hover:underline">
          Privacy Policy
        </a>
        <a href="/terms-of-service" className="hover:underline">
          Terms of Service
        </a>
        <a href="/contact" className="hover:underline">
          Contact Us
        </a>
      </div>

      {/* Social Media */}
      <div className="flex flex-col items-center mt-4">
        <p className="mb-1">Follow us on:</p>
        <div className="flex gap-4">
          <a
            href="https://twitter.com/custospace"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-700"
            aria-label="Definepress Twitter"
          >
            <BsTwitter size={20} />
          </a>
          <a
            href="https://facebook.com/custospace"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800"
            aria-label="Definepress Facebook"
          >
            <BsFacebook size={20} />
          </a>
         <a
        href="https://instagram.com/custospace"
        target="_blank"
        rel="noopener noreferrer"
        className="text-pink-500 hover:text-pink-700"
        aria-label="Definepress Instagram"
      >
        <BsInstagram size={20} />
      </a>

        </div>
      </div>
    </footer>
  );
}

export default Footer;
