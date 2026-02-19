import { useNavigate } from "react-router-dom";
import "./Home.css";
import { 
  FaRocket, 
  FaShieldAlt, 
  FaChartLine, 
  FaUsers, 
  FaCreditCard, 
  FaCheck, 
  FaArrowRight,
  FaPlay,
  FaStar,
  FaQuoteLeft,
  FaGlobe
} from "react-icons/fa";

function Home() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <FaRocket />,
      title: "Lightning Fast",
      description: "Built with modern technology for blazing fast performance and seamless user experience."
    },
    {
      icon: <FaShieldAlt />,
      title: "Secure & Reliable",
      description: "Enterprise-grade security with data encryption, SSO, and advanced compliance features."
    },
    {
      icon: <FaChartLine />,
      title: "Advanced Analytics",
      description: "Track usage, monitor performance, and make data-driven decisions with powerful dashboards."
    },
    {
      icon: <FaUsers />,
      title: "Team Collaboration",
      description: "Invite team members, manage roles, and collaborate in real-time with built-in tools."
    },
    {
      icon: <FaCreditCard />,
      title: "Flexible Billing",
      description: "Choose from flexible subscription plans with monthly or yearly billing options."
    },
    {
      icon: <FaGlobe />,
      title: "Multi-Tenant Architecture",
      description: "Scalable architecture that supports multiple organizations with isolated data."
    }
  ];

  const plans = [
    {
      name: "Free",
      price: 0,
      description: "Perfect for getting started",
      features: [
        "3 Team Members",
        "3 Notes",
        "100MB Storage",
        "Basic Support",
        "Community Access"
      ],
      popular: false
    },
    {
      name: "Starter",
      price: 9,
      description: "For small teams growing together",
      features: [
        "10 Team Members",
        "100 Notes",
        "1GB Storage",
        "Email Support",
        "API Access",
        "Basic Analytics"
      ],
      popular: false
    },
    {
      name: "Pro",
      price: 29,
      description: "For growing businesses",
      features: [
        "50 Team Members",
        "Unlimited Notes",
        "10GB Storage",
        "Priority Support",
        "Advanced Analytics",
        "Custom Branding",
        "API Access"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      price: 99,
      description: "For large organizations",
      features: [
        "Unlimited Members",
        "Unlimited Everything",
        "24/7 Dedicated Support",
        "SSO & Advanced Security",
        "Custom Integrations",
        "White Label",
        "SLA Guarantee"
      ],
      popular: false
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "CEO at TechStart",
      content: "This platform has transformed how our team collaborates. The analytics are incredibly insightful!",
      avatar: "S"
    },
    {
      name: "Michael Chen",
      role: "CTO at DataFlow",
      content: "The multi-tenant architecture is rock solid. We've scaled from 10 to 500 users seamlessly.",
      avatar: "M"
    },
    {
      name: "Emily Davis",
      role: "Product Manager at InnovateCo",
      content: "Best SaaS platform I've used. The features, pricing, and support are all top-notch.",
      avatar: "E"
    }
  ];

  const stats = [
    { value: "10K+", label: "Active Users" },
    { value: "99.9%", label: "Uptime" },
    { value: "50M+", label: "API Requests" },
    { value: "24/7", label: "Support" }
  ];

  return (
    <div className="home-page">
      {/* Navigation */}
      <nav className="home-navbar">
        <div className="home-nav-container">
          <div className="home-nav-logo">
            <span className="home-logo-icon">🚀</span>
            <span className="home-logo-text">SaaSify</span>
          </div>
          <div className="home-nav-links">
            <a href="#features" className="home-nav-link">Features</a>
            <a href="#pricing" className="home-nav-link">Pricing</a>
            <a href="#testimonials" className="home-nav-link">Testimonials</a>
            <a href="#contact" className="home-nav-link">Contact</a>
          </div>
          <div className="home-nav-buttons">
            <button className="home-login-btn" onClick={() => navigate("/login")}>Login</button>
            <button className="home-signup-btn" onClick={() => navigate("/signup")}>Get Started</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="home-hero">
        <div className="home-hero-bg">
          <div className="home-glow home-glow-1"></div>
          <div className="home-glow home-glow-2"></div>
          <div className="home-glow home-glow-3"></div>
        </div>
        <div className="home-hero-content">
          <div className="home-badge">
            <FaStar className="home-badge-icon" />
            <span>Rated 4.9/5 by 10,000+ users</span>
          </div>
          <h1 className="home-hero-title">
            The All-in-One Platform for
            <span className="home-gradient-text"> Growing Teams</span>
          </h1>
          <p className="home-hero-subtitle">
            Streamline your workflow, boost productivity, and scale your business with our comprehensive SaaS solution. 
            Start free, upgrade anytime.
          </p>
          <div className="home-hero-buttons">
            <button className="home-cta-btn" onClick={() => navigate("/signup")}>
              Start Free Trial
              <FaArrowRight className="home-cta-icon" />
            </button>
            <button className="home-secondary-btn">
              <FaPlay className="home-play-icon" />
              Watch Demo
            </button>
          </div>
          <div className="home-hero-stats">
            {stats.map((stat, index) => (
              <div key={index} className="home-stat-item">
                <span className="home-stat-value">{stat.value}</span>
                <span className="home-stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="home-features">
        <div className="home-section-container">
          <div className="home-section-header">
            <h2 className="home-section-title">Everything You Need to Succeed</h2>
            <p className="home-section-subtitle">
              Powerful features designed to help your team work smarter, not harder
            </p>
          </div>
          <div className="home-features-grid">
            {features.map((feature, index) => (
              <div key={index} className="home-feature-card">
                <div className="home-feature-icon">{feature.icon}</div>
                <h3 className="home-feature-title">{feature.title}</h3>
                <p className="home-feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="home-pricing">
        <div className="home-section-container">
          <div className="home-section-header">
            <h2 className="home-section-title">Simple, Transparent Pricing</h2>
            <p className="home-section-subtitle">
              Choose the plan that fits your needs. No hidden fees.
            </p>
          </div>
          <div className="home-pricing-grid">
            {plans.map((plan, index) => (
              <div key={index} className={`home-pricing-card ${plan.popular ? 'home-popular' : ''}`}>
                {plan.popular && <div className="home-popular-badge">Most Popular</div>}
                <h3 className="home-plan-name">{plan.name}</h3>
                <p className="home-plan-description">{plan.description}</p>
                <div className="home-price-container">
                  <span className="home-currency">$</span>
                  <span className="home-price">{plan.price}</span>
                  <span className="home-period">/month</span>
                </div>
                <ul className="home-features-list">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="home-feature-item">
                      <FaCheck className="home-check-icon" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <button className={`home-plan-btn ${plan.popular ? 'home-btn-primary' : ''}`}>
                  {plan.price === 0 ? 'Get Started' : 'Start Free Trial'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="home-testimonials">
        <div className="home-section-container">
          <div className="home-section-header">
            <h2 className="home-section-title">Loved by Teams Everywhere</h2>
            <p className="home-section-subtitle">
              See what our customers have to say about us
            </p>
          </div>
          <div className="home-testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="home-testimonial-card">
                <FaQuoteLeft className="home-quote-icon" />
                <p className="home-testimonial-content">{testimonial.content}</p>
                <div className="home-testimonial-author">
                  <div className="home-author-avatar">{testimonial.avatar}</div>
                  <div>
                    <p className="home-author-name">{testimonial.name}</p>
                    <p className="home-author-role">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="home-cta-section">
        <div className="home-cta-container">
          <h2 className="home-cta-title">Ready to Get Started?</h2>
          <p className="home-cta-subtitle">
            Join thousands of teams already using SaaSify to transform their workflow
          </p>
          <div className="home-cta-buttons">
            <button className="home-cta-btn-large" onClick={() => navigate("/signup")}>
              Start Your Free Trial
              <FaArrowRight className="home-cta-icon" />
            </button>
            <button className="home-secondary-btn-large" onClick={() => navigate("/login")}>
              Login to Dashboard
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <div className="home-footer-container">
          <div className="home-footer-top">
            <div className="home-footer-brand">
              <div className="home-footer-logo">
                <span className="home-logo-icon">🚀</span>
                <span className="home-logo-text">SaaSify</span>
              </div>
              <p className="home-footer-description">
                The all-in-one platform for growing teams. Streamline your workflow, 
                boost productivity, and scale your business.
              </p>
            </div>
            <div className="home-footer-links">
              <div className="home-footer-column">
                <h4 className="home-footer-column-title">Product</h4>
                <a href="#features" className="home-footer-link">Features</a>
                <a href="#pricing" className="home-footer-link">Pricing</a>
                <a href="#" className="home-footer-link">Integrations</a>
                <a href="#" className="home-footer-link">API</a>
              </div>
              <div className="home-footer-column">
                <h4 className="home-footer-column-title">Company</h4>
                <a href="#" className="home-footer-link">About</a>
                <a href="#" className="home-footer-link">Blog</a>
                <a href="#" className="home-footer-link">Careers</a>
                <a href="#" className="home-footer-link">Press</a>
              </div>
              <div className="home-footer-column">
                <h4 className="home-footer-column-title">Support</h4>
                <a href="#" className="home-footer-link">Help Center</a>
                <a href="#" className="home-footer-link">Documentation</a>
                <a href="#" className="home-footer-link">Contact</a>
                <a href="#" className="home-footer-link">Status</a>
              </div>
              <div className="home-footer-column">
                <h4 className="home-footer-column-title">Legal</h4>
                <a href="#" className="home-footer-link">Privacy</a>
                <a href="#" className="home-footer-link">Terms</a>
                <a href="#" className="home-footer-link">Security</a>
                <a href="#" className="home-footer-link">Cookies</a>
              </div>
            </div>
          </div>
          <div className="home-footer-bottom">
            <p className="home-copyright">© 2024 SaaSify. All rights reserved.</p>
            <div className="home-social-links">
              <a href="#" className="home-social-link">Twitter</a>
              <a href="#" className="home-social-link">GitHub</a>
              <a href="#" className="home-social-link">LinkedIn</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
