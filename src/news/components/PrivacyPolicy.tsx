import React from "react";

const PrivacyPolicy: React.FC = () => {
  return (
    <section className="min-h-screen bg-gray-50 text-gray-800 py-8 px-6 md:px-20">
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
          Privacy <span className="text-blue-600">Policy</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-10">
          At DefinePress, your privacy matters to us. This Privacy Policy
          outlines how we collect, use, and protect your personal information
          when you interact with our platform.
        </p>
      </div>

      <div className="max-w-5xl mx-auto space-y-10 text-gray-700 leading-relaxed">
        <section>
          <h2 className="text-2xl font-semibold mb-3 text-blue-700">
            1. Information We Collect
          </h2>
          <p>
            We collect information you provide directly, such as when you create
            an account, subscribe to our newsletter, or contact us. We also
            gather limited automatic data like your browser type, device, and
            usage analytics to improve our services.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3 text-blue-700">
            2. How We Use Your Information
          </h2>
          <p>
            We use your data to deliver personalized news, enhance user
            experience, improve our platform, and communicate updates or
            offers—always in line with your preferences.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3 text-blue-700">
            3. Data Sharing and Protection
          </h2>
          <p>
            We do not sell or rent personal data. Information may be shared only
            with trusted service providers under strict confidentiality
            agreements. We employ secure technologies and encryption to protect
            your information from unauthorized access or misuse.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3 text-blue-700">
            4. Cookies and Tracking
          </h2>
          <p>
            DefinePress uses cookies to remember preferences, improve
            performance, and analyze trends. You can disable cookies in your
            browser settings, but this may affect site functionality.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3 text-blue-700">
            5. Your Rights
          </h2>
          <p>
            You have the right to access, update, or delete your personal data.
            You may also withdraw consent for communications at any time by
            contacting our support team.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3 text-blue-700">
            6. Updates to This Policy
          </h2>
          <p>
            We may revise this Privacy Policy periodically to reflect changes in
            law or service improvements. Updates will be posted on this page
            with a new “last updated” date.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3 text-blue-700">
            7. Contact Us
          </h2>
          <p>
            For any questions regarding this Privacy Policy or data management,
            please contact us at{" "}
            <span className="font-medium text-blue-600">
              privacy@definepress.com
            </span>
            .
          </p>
        </section>
      </div>

      <div className="text-center mt-16 text-gray-600">
        <p>Last updated: November {new Date().getFullYear()}</p>
      </div>
    </section>
  );
};

export default PrivacyPolicy;
