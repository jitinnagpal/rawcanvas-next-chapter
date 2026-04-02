import { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="container-max section-padding pt-32">
        <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-muted-foreground mb-12"><strong>Effective Date:</strong> April 1, 2026</p>

        <div className="prose prose-lg max-w-none space-y-8 text-foreground/90">
          <p>
            This Privacy Policy describes how Raw Canvas, operating under the brand Mokha Designs ("we", "our", or "us"), collects, uses, and protects your information when you visit our website or engage with our services.
          </p>

          <section>
            <h3 className="font-heading text-2xl font-semibold mb-4">1. Information We Collect</h3>
            <p>We may collect the following personal information when you interact with our website:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Full Name</li>
              <li>Phone Number</li>
              <li>Email Address</li>
              <li>Property Location</li>
              <li>Project Type and related preferences</li>
            </ul>
            <p className="mt-4">We may also collect limited technical information such as:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>IP address</li>
              <li>Browser type and device information</li>
              <li>Website usage data through cookies and tracking technologies</li>
            </ul>
          </section>

          <section>
            <h3 className="font-heading text-2xl font-semibold mb-4">2. How We Collect Information</h3>
            <p>We collect information when you:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Fill out forms on our website</li>
              <li>Request a quote or consultation</li>
              <li>Contact us via WhatsApp, phone, or email</li>
              <li>Interact with our website through cookies or tracking technologies</li>
            </ul>
          </section>

          <section>
            <h3 className="font-heading text-2xl font-semibold mb-4">3. Use of Information</h3>
            <p>We use your information to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Contact you regarding your inquiry or project</li>
              <li>Provide design consultation and service details</li>
              <li>Share estimates, proposals, and updates</li>
              <li>Improve our website and services</li>
              <li>Send follow-ups, service updates, or relevant marketing communications</li>
            </ul>
          </section>

          <section>
            <h3 className="font-heading text-2xl font-semibold mb-4">4. Cookies and Tracking Technologies</h3>
            <p>We may use cookies and similar technologies to enhance your experience and analyze website usage.</p>
            <p>We currently use third-party tools such as Meta (Facebook) Pixel for advertising and performance tracking. We may also use analytics tools such as Google Analytics in the future to better understand user behavior and improve our services.</p>
            <p>You can control or disable cookies through your browser settings.</p>
          </section>

          <section>
            <h3 className="font-heading text-2xl font-semibold mb-4">5. Sharing of Information</h3>
            <p>We do not sell your personal data.</p>
            <p>We do not share your personal information with contractors, vendors, or third parties for project execution.</p>
            <p>We may share limited data with trusted third-party service providers (such as analytics or marketing platforms) solely for operating, analyzing, and improving our website and services.</p>
          </section>

          <section>
            <h3 className="font-heading text-2xl font-semibold mb-4">6. Data Storage and Security</h3>
            <p>Your information may be stored in secure systems such as Google Sheets or other internal tools used for managing inquiries and client communication.</p>
            <p>We take reasonable measures to protect your data from unauthorized access, misuse, or disclosure. However, no method of transmission over the internet is completely secure.</p>
          </section>

          <section>
            <h3 className="font-heading text-2xl font-semibold mb-4">7. Data Retention</h3>
            <p>We may retain your personal information for an extended or indefinite period as required for business purposes, including maintaining records of inquiries, improving services, and providing ongoing or future communication.</p>
            <p>You may request deletion of your data at any time by contacting us.</p>
          </section>

          <section>
            <h3 className="font-heading text-2xl font-semibold mb-4">8. Your Rights</h3>
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Request access to the personal data we hold about you</li>
              <li>Request correction of inaccurate or incomplete data</li>
              <li>Request deletion of your personal data</li>
              <li>Opt out of receiving marketing or promotional communications at any time</li>
            </ul>
            <p className="mt-4">
              To exercise any of these rights, you may contact us at{' '}
              <a href="mailto:mokhadesigns@outlook.com" className="text-primary hover:underline">mokhadesigns@outlook.com</a>.
            </p>
            <p>We will respond to such requests within a reasonable timeframe.</p>
          </section>

          <section>
            <h3 className="font-heading text-2xl font-semibold mb-4">9. Third-Party Links</h3>
            <p>Our website may contain links to third-party platforms (such as WhatsApp, Instagram, or Facebook). We are not responsible for the privacy practices of these platforms.</p>
          </section>

          <section>
            <h3 className="font-heading text-2xl font-semibold mb-4">10. Updates to This Policy</h3>
            <p>We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated effective date.</p>
          </section>

          <section>
            <h3 className="font-heading text-2xl font-semibold mb-4">11. Contact Us</h3>
            <p><strong>Mokha Designs (Raw Canvas)</strong><br />
            Hyderabad, India<br />
            Email: <a href="mailto:mokhadesigns@outlook.com" className="text-primary hover:underline">mokhadesigns@outlook.com</a><br />
            Phone: <a href="tel:+919908392200" className="text-primary hover:underline">+91 99083 92200</a></p>
          </section>

          <hr className="border-border" />
          <p>By using our website, you consent to the terms of this Privacy Policy.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
