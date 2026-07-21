import NavbarMobile from "@/components/NavbarMobile";
import Link from "next/link";
import "../legal.css";

export const metadata = {
  title: "Terms of Service | VendorVille",
};

export default function TermsOfServicePage() {
  return (
    <>
      <NavbarMobile />
      <div className="legal-page">
        <div className="legal-hero">
          <div className="wrap">
            <span className="legal-eyebrow">✦ Legal</span>
            <h1>Terms of Service</h1>
            <p>Last updated: July 20, 2026</p>
          </div>
        </div>

        <div className="wrap legal-content">
          <p className="legal-intro">
            These Terms of Service ("Terms") govern your use of VendorVille, a
            platform operated by VendorVille Technologies Limited
            ("VendorVille," "we," "us," or "our"). By creating an account or
            using our platform, you agree to these Terms.
          </p>

          <h2>1. Who Can Use VendorVille</h2>
          <p>
            You must be at least 18 years old to create a vendor account.
            Customers ordering from a storefront may do so as a guest without an
            account, or by creating a lightweight customer account.
          </p>

          <h2>2. Vendor Accounts and Responsibilities</h2>
          <p>As a vendor, you are responsible for:</p>
          <ul>
            <li>Providing accurate business information during registration</li>
            <li>
              The accuracy of your product listings, prices, and stock levels
            </li>
            <li>
              Fulfilling orders placed through your storefront or entered via
              the dashboard
            </li>
            <li>
              Complying with all applicable Nigerian laws relating to the sale
              of your products, including consumer protection and tax
              obligations
            </li>
            <li>
              Maintaining the confidentiality of your account password and
              transaction PIN
            </li>
          </ul>
          <p>
            VendorVille reserves the right to suspend or terminate accounts that
            violate these Terms, provide false information, or engage in
            fraudulent activity.
          </p>

          <h2>3. Subscriptions and Billing</h2>
          <p>
            VendorVille offers Starter, Professional, and Enterprise
            subscription plans, each with different limits on the number of
            businesses and features available. Subscription fees are billed
            monthly and processed via Paystack. Plans do not renew automatically
            unless explicitly enabled; you are responsible for renewing your
            subscription to maintain uninterrupted access to paid features.
          </p>
          <p>
            Downgrading to a lower plan may require you to reduce the number of
            active businesses to fit within the new plan's limits before the
            downgrade can take effect.
          </p>

          <h2>4. Payments, Wallet, and Withdrawals</h2>
          <p>
            Payments made through VendorVille — including customer orders and
            wallet deposits — are processed by Paystack, a licensed third-party
            payment processor. VendorVille is not a bank or licensed financial
            institution; wallet balances represent funds held on your behalf for
            withdrawal to your linked bank account.
          </p>
          <p>
            Withdrawal requests are processed via Paystack's Transfer API and
            may take up to one business day to complete. VendorVille is not
            liable for delays caused by Paystack, your bank, or incorrect
            account details you provide.
          </p>

          <h2>5. Storefronts and Customer Orders</h2>
          <p>
            Vendors may set their business storefront to "Public" or "Private."
            Public storefronts are visible in the VendorVille directory and can
            be browsed and ordered from by any customer. Vendors are solely
            responsible for the products, pricing, and descriptions displayed on
            their storefront.
          </p>
          <p>
            VendorVille facilitates the connection between vendors and customers
            but is not a party to the sale itself. Disputes regarding product
            quality, delivery, or refunds are between the vendor and the
            customer, though VendorVille may assist in good faith where
            possible.
          </p>

          <h2>6. Prohibited Uses</h2>
          <p>You may not use VendorVille to:</p>
          <ul>
            <li>List or sell illegal, counterfeit, or prohibited goods</li>
            <li>Engage in fraud, money laundering, or payment abuse</li>
            <li>
              Upload content that infringes on the intellectual property or
              rights of others
            </li>
            <li>
              Attempt to interfere with, disrupt, or gain unauthorized access to
              VendorVille's systems
            </li>
          </ul>

          <h2>7. Intellectual Property</h2>
          <p>
            VendorVille and its logo, design, and platform features are the
            property of VendorVille Technologies Limited. Vendors retain
            ownership of their own business content (logos, product photos,
            descriptions) uploaded to the platform, and grant VendorVille a
            limited license to display this content as part of operating their
            storefront and the public directory.
          </p>

          <h2>8. Limitation of Liability</h2>
          <p>
            VendorVille is provided "as is." To the fullest extent permitted by
            law, VendorVille is not liable for indirect, incidental, or
            consequential damages arising from your use of the platform,
            including lost sales, lost profits, or disputes between vendors and
            customers.
          </p>

          <h2>9. Termination</h2>
          <p>
            You may close your account at any time. VendorVille may suspend or
            terminate accounts that violate these Terms, with or without notice,
            particularly in cases of fraud or illegal activity.
          </p>

          <h2>10. Changes to These Terms</h2>
          <p>
            We may update these Terms from time to time. Continued use of
            VendorVille after changes take effect constitutes acceptance of the
            updated Terms.
          </p>

          <h2>11. Governing Law</h2>
          <p>
            These Terms are governed by the laws of the Federal Republic of
            Nigeria.
          </p>

          <h2>12. Contact Us</h2>
          <p>
            <strong>VendorVille Technologies Limited</strong>
            <br />
            123 Market Avenue, Enugu, Nigeria
            <br />
            Phone: +234 903 935 4723
          </p>

          <div className="legal-footer-links">
            <Link href="/legal/privacy">← Privacy Policy</Link>
          </div>
        </div>
      </div>
    </>
  );
}
