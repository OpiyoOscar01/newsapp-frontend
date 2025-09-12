import {
  BsTwitter,
  BsFacebook,
  BsInstagram,
  BsLinkedin,
  BsYoutube,
  BsNewspaper,
  BsGlobe,
  BsEnvelope,
  BsPhone,
  BsArrowRight,
  BsShield,
  BsAward
} from "react-icons/bs";

function HomeFooter() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    news: [
      { title: "Breaking News", href: "/breaking" },
      { title: "Politics", href: "/politics" },
      { title: "Business", href: "/business" },
      { title: "Technology", href: "/technology" },
      { title: "Sports", href: "/sports" },
      { title: "World", href: "/world" }
    ],
    company: [
      { title: "About Us", href: "/about" },
      { title: "Our Team", href: "/team" },
      { title: "Careers", href: "/careers" },
      { title: "Press Kit", href: "/press" },
      { title: "Advertise", href: "/advertise" },
      { title: "Contact", href: "/contact" }
    ],
    support: [
      { title: "Help Center", href: "/help" },
      { title: "Privacy Policy", href: "/privacy" },
      { title: "Terms of Service", href: "/terms" },
      { title: "Cookie Policy", href: "/cookies" },
      { title: "GDPR", href: "/gdpr" },
      { title: "Accessibility", href: "/accessibility" }
    ]
  };

  const socialLinks = [
    { 
      icon: BsTwitter, 
      href: "https://twitter.com/definepress", 
      label: "Twitter", 
      color: "hover:text-blue-400"
    },
    { 
      icon: BsFacebook, 
      href: "https://facebook.com/definepress", 
      label: "Facebook", 
      color: "hover:text-blue-600"
    },
    { 
      icon: BsInstagram, 
      href: "https://instagram.com/definepress", 
      label: "Instagram", 
      color: "hover:text-blue-500"
    },
    { 
      icon: BsLinkedin, 
      href: "https://linkedin.com/company/definepress", 
      label: "LinkedIn", 
      color: "hover:text-blue-700"
    },
    { 
      icon: BsYoutube, 
      href: "https://youtube.com/definepress", 
      label: "YouTube", 
      color: "hover:text-blue-600"
    }
  ];

  return (
    <footer className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-transparent"></div>
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Main Footer Content */}
      <div className="relative z-10">
        {/* Top Section */}
        <div className="border-b border-blue-800/30 py-8 sm:py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {/* Brand Section */}
              <div className="sm:col-span-2 lg:col-span-1 text-center sm:text-left">
                <div className="mb-6">
                  <div className="flex items-center justify-center sm:justify-start mb-4">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-2 sm:p-3 rounded-xl mr-3">
                      <BsNewspaper className="text-xl sm:text-2xl text-white" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black text-white">
                      <span className="text-blue-400">DefinePress</span>
                    </h3>
                  </div>
                  <p className="text-blue-200 leading-relaxed mb-4 sm:mb-6 text-sm sm:text-base">
                    Your trusted source for breaking news, in-depth analysis, and stories that matter. 
                    Delivering accurate journalism since {currentYear - 5}.
                  </p>
                  
                  {/* Awards */}
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-4 mb-4 sm:mb-6">
                    <div className="flex items-center gap-2 bg-blue-800/30 px-2 sm:px-3 py-1 sm:py-2 rounded-lg">
                      <BsAward className="text-blue-400 text-sm sm:text-base" />
                      <span className="text-xs text-blue-200">Award Winner</span>
                    </div>
                    <div className="flex items-center gap-2 bg-blue-800/30 px-2 sm:px-3 py-1 sm:py-2 rounded-lg">
                      <BsShield className="text-blue-400 text-sm sm:text-base" />
                      <span className="text-xs text-blue-200">Verified News</span>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex items-center justify-center sm:justify-start gap-3 text-blue-200">
                      <BsEnvelope className="text-blue-400 flex-shrink-0" />
                      <span className="text-xs sm:text-sm break-all">news@definepress.com</span>
                    </div>
                    <div className="flex items-center justify-center sm:justify-start gap-3 text-blue-200">
                      <BsPhone className="text-blue-400 flex-shrink-0" />
                      <span className="text-xs sm:text-sm">+1 (555) 123-NEWS</span>
                    </div>
                    <div className="flex items-center justify-center sm:justify-start gap-3 text-blue-200">
                      <BsGlobe className="text-blue-400 flex-shrink-0" />
                      <span className="text-xs sm:text-sm">24/7 Global Coverage</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* News Categories */}
              <div className="text-center sm:text-left">
                <h4 className="text-base sm:text-lg font-bold text-white mb-4 sm:mb-6 flex items-center justify-center sm:justify-start">
                  <span className="w-1 h-4 sm:h-6 bg-blue-500 rounded-full mr-3"></span>
                  News Categories
                </h4>
                <ul className="space-y-2 sm:space-y-3">
                  {footerLinks.news.map((link, index) => (
                    <li key={index}>
                      <a 
                        href={link.href}
                        className="text-blue-200 hover:text-white transition-all duration-300 flex items-center justify-center sm:justify-start group text-xs sm:text-sm"
                      >
                        <BsArrowRight className="mr-2 text-xs opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all duration-300" />
                        {link.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Company */}
              <div className="text-center sm:text-left">
                <h4 className="text-base sm:text-lg font-bold text-white mb-4 sm:mb-6 flex items-center justify-center sm:justify-start">
                  <span className="w-1 h-4 sm:h-6 bg-blue-500 rounded-full mr-3"></span>
                  Company
                </h4>
                <ul className="space-y-2 sm:space-y-3">
                  {footerLinks.company.map((link, index) => (
                    <li key={index}>
                      <a 
                        href={link.href}
                        className="text-blue-200 hover:text-white transition-all duration-300 flex items-center justify-center sm:justify-start group text-xs sm:text-sm"
                      >
                        <BsArrowRight className="mr-2 text-xs opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all duration-300" />
                        {link.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Support & Legal */}
              <div className="text-center sm:text-left">
                <h4 className="text-base sm:text-lg font-bold text-white mb-4 sm:mb-6 flex items-center justify-center sm:justify-start">
                  <span className="w-1 h-4 sm:h-6 bg-blue-500 rounded-full mr-3"></span>
                  Support & Legal
                </h4>
                <ul className="space-y-2 sm:space-y-3">
                  {footerLinks.support.map((link, index) => (
                    <li key={index}>
                      <a 
                        href={link.href}
                        className="text-blue-200 hover:text-white transition-all duration-300 flex items-center justify-center sm:justify-start group text-xs sm:text-sm"
                      >
                        <BsArrowRight className="mr-2 text-xs opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all duration-300" />
                        {link.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="border-b border-blue-800/30 py-6 sm:py-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4 sm:gap-6">
              <div className="text-center lg:text-left">
                <h4 className="text-lg sm:text-xl font-bold text-white mb-2">Stay Updated</h4>
                <p className="text-blue-200 text-sm sm:text-base">Get breaking news delivered to your inbox</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto max-w-md lg:max-w-none">
                <input 
                  type="email" 
                  placeholder="Enter your email address" 
                  className="px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-blue-800/30 border border-blue-700 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:min-w-[250px] lg:min-w-[300px] text-sm sm:text-base"
                />
                <button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg text-sm sm:text-base whitespace-nowrap">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="py-6 sm:py-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4 sm:gap-6">
              {/* Copyright */}
              <div className="flex flex-col lg:flex-row items-center gap-2 sm:gap-4 text-blue-200 text-center lg:text-left">
                <p className="text-xs sm:text-sm">
                  © {currentYear} <span className="font-semibold text-white">DefinePress</span>. All rights reserved.
                </p>
                <div className="hidden lg:block w-1 h-1 bg-blue-500 rounded-full"></div>
                <p className="text-xs">
                  Trusted by millions worldwide for accurate news reporting
                </p>
              </div>

              {/* Social Media */}
              <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                <span className="text-blue-200 text-xs sm:text-sm font-medium">Follow us:</span>
                <div className="flex gap-2 sm:gap-4">
                  {socialLinks.map((social, index) => {
                    const Icon = social.icon;
                    return (
                      <a
                        key={index}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`text-blue-300 ${social.color} transition-all duration-300 transform hover:scale-110`}
                        aria-label={`DefinePress ${social.label}`}
                      >
                        <div className="bg-blue-800/30 p-2 sm:p-3 rounded-lg hover:bg-blue-700/40 transition-colors duration-300">
                          <Icon size={16} className="sm:w-5 sm:h-5" />
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="bg-gradient-to-r from-blue-800/20 to-indigo-800/20 py-3 sm:py-4">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 lg:gap-8 text-blue-300 text-xs">
              <span className="flex items-center gap-1 sm:gap-2">
                <BsShield className="text-xs sm:text-sm" />
                <span className="hidden xs:inline">SSL Secured</span>
                <span className="xs:hidden">SSL</span>
              </span>
              <span className="flex items-center gap-1 sm:gap-2">
                <BsAward className="text-xs sm:text-sm" />
                <span className="hidden sm:inline">Press Freedom Award 2023</span>
                <span className="sm:hidden">Award 2023</span>
              </span>
              <span className="flex items-center gap-1 sm:gap-2">
                <BsGlobe className="text-xs sm:text-sm" />
                <span className="hidden sm:inline">200+ Countries Covered</span>
                <span className="sm:hidden">200+ Countries</span>
              </span>
              <span className="hidden sm:inline">ISO 27001 Certified</span>
              <span className="hidden lg:inline">GDPR Compliant</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default HomeFooter;
