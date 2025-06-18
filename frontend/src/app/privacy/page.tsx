import MainLayout from "@/components/layout/main-layout";

export default function PrivacyPage() {
  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

        <div className="prose dark:prose-invert max-w-none">
          <p className="mb-4">Last updated: June 18, 2025</p>

          <h2 className="text-xl font-semibold mt-6 mb-4">
            1. Information We Collect
          </h2>
          <p>
            We collect information to provide better services to our users. This
            information includes:
          </p>
          <ul className="list-disc pl-6 my-4">
            <li>
              Information you provide to us (such as your name, email address)
            </li>
            <li>
              Information we get from your use of our services (such as device
              information, log information)
            </li>
            <li>Information from third parties</li>
          </ul>

          <h2 className="text-xl font-semibold mt-6 mb-4">
            2. How We Use Information
          </h2>
          <p>We use the information we collect from all our services to:</p>
          <ul className="list-disc pl-6 my-4">
            <li>Provide, maintain, and improve our services</li>
            <li>Develop new services and features</li>
            <li>Protect Boimarker and our users</li>
            <li>
              Measure performance and understand how our services are used
            </li>
          </ul>

          <h2 className="text-xl font-semibold mt-6 mb-4">
            3. Information We Share
          </h2>
          <p>
            We do not share personal information with companies, organizations
            or individuals outside of Boimarker except in the following cases:
          </p>
          <ul className="list-disc pl-6 my-4">
            <li>With your consent</li>
            <li>For legal reasons</li>
            <li>With domain administrators</li>
          </ul>

          <h2 className="text-xl font-semibold mt-6 mb-4">
            4. Information Security
          </h2>
          <p>
            We work hard to protect Boimarker and our users from unauthorized
            access to or unauthorized alteration, disclosure or destruction of
            information we hold.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-4">5. Changes</h2>
          <p>
            Our Privacy Policy may change from time to time. We will not reduce
            your rights under this Privacy Policy without your explicit consent.
            We will post any privacy policy changes on this page and, if the
            changes are significant, we will provide a more prominent notice.
          </p>
        </div>
      </div>
    </MainLayout>
  );
}
