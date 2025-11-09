import React from "react";

const TermsOfService: React.FC = () => {
  return (
    <section className="min-h-screen bg-gray-50 text-gray-800 py-16 px-6 md:px-20">
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
          Terms of <span className="text-blue-600">Service</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-10">
          Welcome to DefinePress. By accessing or using our platform, you agree
          to comply with the terms outlined below. Please read these Terms of
          Service carefully before continuing.
        </p>
      </div>

      <div className="max-w-5xl mx-auto space-y-10 text-gray-700 leading-relaxed">
        <section>
          <h2 className="text-2xl font-semibold mb-3 text-blue-700">
            1. Acceptance of Terms
          </h2>
          <p>
            By accessing or using DefinePress, you confirm that you are at
            least 18 years old and that you agree to be bound by these Terms of
            Service and our Privacy Policy. If you do not agree, please refrain
            from using the platform.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3 text-blue-700">
            2. Use of Our Services
          </h2>
          <p>
            DefinePress provides news and informational content for personal,
            non-commercial use. You agree not to misuse our platform or engage
            in activities such as scraping, hacking, or distributing content
            without permission.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3 text-blue-700">
            3. User Accounts
          </h2>
          <p>
            Some features may require you to create an account. You are
            responsible for maintaining the confidentiality of your login
            credentials and for all activity under your account. DefinePress is
            not liable for any unauthorized access resulting from your failure
            to secure your account.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3 text-blue-700">
            4. Intellectual Property
          </h2>
          <p>
            All content on DefinePress — including articles, images, logos, and
            branding — is owned by or licensed to DefinePress. You may not
            reproduce, republish, or redistribute any material without prior
            written consent.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3 text-blue-700">
            5. Content Accuracy and Liability
          </h2>
          <p>
            While we strive for accuracy, DefinePress does not guarantee that
            all content is complete or error-free. We are not responsible for
            any damages resulting from reliance on our news content or third-party
            links provided through the platform.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3 text-blue-700">
            6. Termination
          </h2>
          <p>
            DefinePress reserves the right to suspend or terminate access to
            the platform at any time, without notice, if a user violates these
            terms or engages in harmful or unlawful behavior.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3 text-blue-700">
            7. Changes to the Terms
          </h2>
          <p>
            We may modify these Terms of Service periodically. Updates will be
            posted on this page with a revised effective date. Continued use of
            DefinePress after changes indicates your acceptance of the updated
            terms.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3 text-blue-700">
            8. Contact Information
          </h2>
          <p>
            For questions regarding these Terms of Service, please contact us at{" "}
            <span className="font-medium text-blue-600">
              legal@definepress.com
            </span>
            .
          </p>
        </section>
      </div>
    </section>
  );
};

export default TermsOfService;
