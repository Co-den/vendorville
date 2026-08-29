import "./integration.css";
import {
  CreditCard,
  MessageCircle,
  MapPin,
  Star,
  Package,
  Users,
} from "lucide-react";

export default function IntegrationsSection() {
  const integrations = [
    {
      name: "Paystack",
      description: "Accept online payments before pickup or on delivery",
      color: "blue",
       logo: "/logos/ps.png",
    },
    {
      name: "Brevo",
      description: "Ensure fast, reliable delivery of transactional emails at scale.",
      color: "green",
      logo: "/logos/br.png",
    },
    {
      name: "Dispatch Tracking",
      description: "GPS-powered rider tracking and route optimization",
      color: "purple",
      icon: MapPin,
    },
    {
      name: "Loyalty Programs",
      description: "Reward customers with points and gift cards",
      color: "yellow",
      icon: Star,
    },
    {
      name: "Inventory Management",
      description: "Real-time stock tracking and automated alerts",
      color: "pink",
      icon: Package,
    },
    {
      name: "Staff Management",
      description: "Schedule shifts, track performance, manage roles",
      color: "orange",
      icon: Users,
    },
  ];

  return (
    <section className="integrations-section">
      <div className="integrations-container">

        {/* Header */}
        <div className="integrations-header">
          <h2 className="integrations-title">
            Built to Work With{" "}
            <span className="integrations-highlight">
              Your Business
            </span>
          </h2>

          <p className="integrations-subtitle">
            VendorVille integrates with the tools your business already
            relies on, so you can focus on serving customers, not
            managing logistics.
          </p>
        </div>

        {/* Integrations */}
        <div className="integrations-grid">
          {integrations.map((integration, index) => {
            const Icon = integration.icon;

            return (
              <div
                key={index}
                className="integration-card"
              >
                <div
  className={`integration-icon integration-icon-${integration.color}`}
>
  {integration.logo ? (
    <img
      src={integration.logo}
      alt={`${integration.name} logo`}
      className="integration-logo"
    />
  ) : (
    Icon && <Icon size={24} strokeWidth={2.2} />
  )}
</div>

                <div className="integration-content">
                  <h3 className="integration-name">
                    {integration.name}
                  </h3>

                  <p className="integration-desc">
                    {integration.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="integrations-footer">
          <p>
            Don't see the integration you need?{" "}
            <a
              href="#contact"
              className="integrations-link"
            >
              Contact us for custom integrations
            </a>
          </p>
        </div>

      </div>
    </section>
  );
}