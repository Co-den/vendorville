import NavbarMobile from "@/components/NavbarMobile";
import Link from "next/link";
import "../legal.css";

export const metadata = {
  title: "Privacy Policy | VendorVille",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <NavbarMobile />
      <div className="legal-page">
        <div className="legal-hero">
          <div className="wrap">
            <span className="legal-eyebrow">✦ Legal</span>
            <h1>Privacy Policy</h1>
            <p>Last updated: July 20, 2026</p>
          </div>
        </div>

        <div className="wrap legal-content">
          <p className="legal-intro">
            VendorVille Technologies Limited ("VendorVille," "we," "us," or
            "our") operates a platform that helps Nigerian online vendors manage
            inventory, orders, payments, and storefronts. This Privacy Policy
            explains what information we collect, how we use it, and the choices
            you have — whether you're a vendor using our dashboard or a customer
            ordering from a vendor's storefront.
          </p>

          <h2>1. Information We Collect</h2>
          <h3>1.1 Vendor Accounts</h3>
          <p>
            When you sign up as a vendor, we collect your name, email address,
            phone number, business details (name, address, category, logo,
            premises photos), country and timezone, and a hashed password and
            transaction PIN. We never store your password or PIN in plain text.
          </p>

          <h3>1.2 Customer Orders</h3>
          <p>
            When you place an order through a vendor's storefront — with or
            without creating a customer account — we collect your name, phone
            number, delivery address, and optionally your email. This
            information is shared with the vendor you're ordering from so they
            can fulfill your order.
          </p>

          <h3>1.3 Payment Information</h3>
          <p>
            Payments are processed by Paystack, a licensed payment processor.
            VendorVille does not store your card details, bank account numbers,
            or other sensitive payment credentials — these are handled directly
            by Paystack under their own security standards and privacy
            practices.
          </p>

          <h3>1.4 Usage Data</h3>
          <p>
            We automatically collect certain technical information when you use
            VendorVille, including IP address, browser type, device information,
            and pages visited, to help us maintain security and improve the
            platform.
          </p>

          <h2>2. How We Use Your Information</h2>
          <ul>
            <li>To create and manage your vendor or customer account</li>
            <li>To process orders, payments, and withdrawals</li>
            <li>
              To send transactional notifications via email, SMS, or WhatsApp
              (e.g. order confirmations, payment receipts, low-stock alerts)
            </li>
            <li>
              To display your business storefront to customers, if you set your
              business to "Public"
            </li>
            <li>To detect and prevent fraud, abuse, and security incidents</li>
            <li>
              To comply with legal obligations, including those under the
              Nigeria Data Protection Act (NDPA)
            </li>
          </ul>

          <h2>3. Third-Party Service Providers</h2>
          <p>
            We work with the following third parties to operate VendorVille.
            Each processes a limited set of your data solely to provide their
            respective service:
          </p>
          <ul>
            <li>
              <strong>Paystack</strong> — payment processing, bank transfers,
              and wallet transactions
            </li>
            <li>
              <strong>Cloudinary</strong> — secure storage and delivery of
              uploaded images (logos, product photos, premises photos)
            </li>
            <li>
              <strong>Neon</strong> — our database infrastructure provider
            </li>
            <li>
              <strong>Termii</strong> — SMS and WhatsApp delivery for order and
              account notifications
            </li>
            <li>
              <strong>Resend</strong> — transactional email delivery
            </li>
          </ul>
          <p>
            We do not sell your personal information to third parties, and we do
            not share it for advertising purposes.
          </p>

          <h2>4. Data Retention</h2>
          <p>
            We retain your account and transaction data for as long as your
            account is active, and for a reasonable period afterward to comply
            with legal, tax, and accounting obligations. You may request
            deletion of your account at any time, subject to these retention
            requirements.
          </p>

          <h2>5. Your Rights</h2>
          <p>
            Under the Nigeria Data Protection Act (NDPA) and applicable data
            protection law, you have the right to:
          </p>
          <ul>
            <li>Access the personal data we hold about you</li>
            <li>Request correction of inaccurate or incomplete data</li>
            <li>
              Request deletion of your data, subject to legal retention
              requirements
            </li>
            <li>Object to certain processing of your data</li>
            <li>Withdraw consent where processing is based on consent</li>
          </ul>
          <p>
            To exercise any of these rights, contact us at the details below.
          </p>

          <h2>6. Data Security</h2>
          <p>
            We use industry-standard security measures, including encrypted
            connections (HTTPS), hashed passwords, and access controls, to
            protect your information. No system is completely secure, but we
            work to continuously improve our safeguards.
          </p>

          <h2>7. Children's Privacy</h2>
          <p>
            VendorVille is not directed at individuals under the age of 18. We
            do not knowingly collect personal information from minors.
          </p>

          <h2>8. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We'll notify
            you of material changes by posting the updated policy on this page
            with a new "Last updated" date.
          </p>

          <h2>9. Contact Us</h2>
          <p>
            If you have questions about this Privacy Policy or how we handle
            your data, contact us at:
          </p>
          <p>
            <strong>VendorVille Technologies Limited</strong>
            <br />
            123 Market Avenue, Enugu, Nigeria
            <br />
            Phone: +234 903 935 4723
          </p>

          <div className="legal-footer-links">
            <Link href="/legal/terms">Terms of Service →</Link>
          </div>
        </div>
      </div>
    </>
  );
}
