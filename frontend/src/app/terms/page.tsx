import MainLayout from "@/components/layout/main-layout";

export default function TermsPage() {
  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>

        <div className="prose dark:prose-invert max-w-none">
          <p className="mb-4">Last updated: June 18, 2025</p>

          <h2 className="text-xl font-semibold mt-6 mb-4">1. Introduction</h2>
          <p>
            Welcome to Boimarker. These Terms of Service govern your use of our
            website and services. By accessing or using our service, you agree
            to be bound by these Terms.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-4">
            2. Using our Services
          </h2>
          <p>
            You must follow any policies made available to you within the
            Services. Do not misuse our Services. For example, do not interfere
            with our Services or try to access them using a method other than
            the interface and the instructions that we provide.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-4">3. Your Content</h2>
          <p>
            Our Services allow you to upload, submit, store, send or receive
            content. You retain ownership of any intellectual property rights
            that you hold in that content. When you upload, submit, store, send
            or receive content to or through our Services, you give us a
            worldwide license to use, host, store, reproduce, modify, create
            derivative works, communicate, publish, publicly perform, publicly
            display and distribute such content.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-4">
            4. Software in our Services
          </h2>
          <p>
            When a Service requires or includes downloadable software, this
            software may update automatically on your device once a new version
            or feature is available. We give you a personal, worldwide,
            royalty-free, non-assignable and non-exclusive license to use the
            software provided to you as part of the Services.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-4">
            5. Modifying and Terminating our Services
          </h2>
          <p>
            We are constantly changing and improving our Services. We may add or
            remove functionalities or features, and we may suspend or stop a
            Service altogether. You can stop using our Services at any time. We
            may also stop providing Services to you, or add or create new limits
            to our Services at any time.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-4">
            6. Our Warranties and Disclaimers
          </h2>
          <p>
            We provide our Services using a commercially reasonable level of
            skill and care, but there are certain things that we do not promise
            about our Services. Other than as expressly set out in these terms,
            neither Boimarker nor its suppliers or distributors make any
            specific promises about the Services.
          </p>
        </div>
      </div>
    </MainLayout>
  );
}
