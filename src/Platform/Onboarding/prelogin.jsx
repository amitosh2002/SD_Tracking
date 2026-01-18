
import React, { useState, useEffect } from 'react';
import { 
  Clock, Zap, Shield, TrendingUp, Users, Star, 
  ChevronRight, Check, ArrowRight, Menu, X,
  GitBranch, Code, Database, Workflow, Calendar, Target,
  BarChart3, FileText, CheckSquare, MessageSquare
} from 'lucide-react';

export default function HoraShowcase() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [stats, setStats] = useState({
    teams: 0,
    projects: 0,
    sprints: 0,
    tasks: 0
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const animateStats = () => {
      const duration = 2000;
      const steps = 60;
      const increment = duration / steps;
      
      const targets = {
        teams: 1200,
        projects: 8500,
        sprints: 15000,
        tasks: 250000
      };

      let current = {
        teams: 0,
        projects: 0,
        sprints: 0,
        tasks: 0
      };

      const timer = setInterval(() => {
        current.teams = Math.min(current.teams + targets.teams / steps, targets.teams);
        current.projects = Math.min(current.projects + targets.projects / steps, targets.projects);
        current.sprints = Math.min(current.sprints + targets.sprints / steps, targets.sprints);
        current.tasks = Math.min(current.tasks + targets.tasks / steps, targets.tasks);

        setStats({
          teams: Math.floor(current.teams),
          projects: Math.floor(current.projects),
          sprints: Math.floor(current.sprints),
          tasks: Math.floor(current.tasks)
        });

        if (current.teams >= targets.teams) {
          clearInterval(timer);
        }
      }, increment);
    };

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        animateStats();
        observer.disconnect();
      }
    });

    const statsElement = document.querySelector('.hora-stats');
    if (statsElement) observer.observe(statsElement);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: Workflow,
      title: "Agile Sprint Management",
      description: "Plan, track, and manage sprints with customizable boards and workflows tailored to your team."
    },
    {
      icon: GitBranch,
      title: "GitHub Integration",
      description: "Seamlessly connect with GitHub for automated branch creation, PR tracking, and deployment workflows."
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Gain insights into team performance, velocity trends, and project health with powerful dashboards."
    },
    {
      icon: MessageSquare,
      title: "Real-Time Collaboration",
      description: "Keep your team synchronized with instant updates, comments, and notifications across all projects."
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      business: "Tech Startup Founder",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      rating: 5,
      text: "Hora transformed how our engineering team works. Sprint planning that used to take hours now takes minutes!"
    },
    {
      name: "Michael Rodriguez",
      business: "Senior Engineering Manager",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
      rating: 5,
      text: "The GitHub integration is a game-changer. Our deployment workflow is now fully automated and traceable."
    },
    {
      name: "Emily Watson",
      business: "Product Manager",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
      rating: 5,
      text: "Finally, a project management tool that developers actually love to use. The velocity tracking is incredible!"
    }
  ];

  const services = [
    {
      icon: Calendar,
      title: "Sprint Planning",
      description: "Streamline sprint ceremonies",
      color: "#667eea"
    },
    {
      icon: CheckSquare,
      title: "Task Management",
      description: "Track work items efficiently",
      color: "#764ba2"
    },
    {
      icon: Code,
      title: "Code Integration",
      description: "Connect your repositories",
      color: "#f093fb"
    },
    {
      icon: Target,
      title: "Goal Tracking",
      description: "Measure team objectives",
      color: "#4facfe"
    }
  ];

  return (
    <div className="hora-showcase">
      {/* Navigation */}
      <nav className={`hora-nav ${scrolled ? 'hora-nav--scrolled' : ''}`}>
        <div className="hora-nav__container">
          <div className="hora-nav__logo">
            <Clock className="hora-nav__logo-icon" />
            <span className="hora-nav__logo-text">Hora</span>
          </div>
          
          <div className={`hora-nav__menu ${mobileMenuOpen ? 'hora-nav__menu--open' : ''}`}>
            <a href="#features" className="hora-nav__link">Features</a>
            <a href="#services" className="hora-nav__link">Services</a>
            <a href="#testimonials" className="hora-nav__link">Testimonials</a>
            <a href="#contact" className="hora-nav__link">Contact</a>
            <button className="hora-btn hora-btn--primary hora-btn--sm">
              Get Started
            </button>
          </div>

          <button 
            className="hora-nav__toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hora-hero">
        <div className="hora-hero__container">
          <div className="hora-hero__content">
            <div className="hora-hero__badge">
              <Zap size={16} />
              <span>Trusted by 1,200+ Development Teams</span>
            </div>
            <h1 className="hora-hero__title">
              Agile Project Management <span className="hora-gradient-text">Reimagined</span>
            </h1>
            <p className="hora-hero__subtitle">
              The modern platform for agile teams. Plan sprints, manage tasks, track velocity, 
              and integrate seamlessly with GitHub—all in one powerful workspace.
            </p>
            <div className="hora-hero__actions">
              <button className="hora-btn hora-btn--primary hora-btn--lg" onClick={ ()=>window.open("https://sd-tracking.onrender.com/")}>
                 Join the Journey: Try Hora Beta
                <ArrowRight className="hora-btn__icon-right" />
              </button>
              <button className="hora-btn hora-btn--outline hora-btn--lg">
                Watch Demo
              </button>
            </div>
          </div>
          <div className="hora-hero__image">
            <div className="hora-hero__card hora-hero__card--1">
              <Calendar size={24} />
              <div>
                <div className="hora-hero__card-label">Active Sprints</div>
                <div className="hora-hero__card-value">127</div>
              </div>
            </div>
            <div className="hora-hero__card hora-hero__card--2">
              <TrendingUp size={24} />
              <div>
                <div className="hora-hero__card-label">Velocity</div>
                <div className="hora-hero__card-value">32 pts</div>
              </div>
            </div>
            <div className="hora-hero__card hora-hero__card--3">
              <CheckSquare size={24} />
              <div>
                <div className="hora-hero__card-label">Tasks Completed</div>
                <div className="hora-hero__card-value">1,543</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="hora-stats">
        <div className="hora-stats__container">
          <div className="hora-stats__item">
            <div className="hora-stats__number">{stats.teams.toLocaleString()}+</div>
            <div className="hora-stats__label">Active Teams</div>
          </div>
          <div className="hora-stats__item">
            <div className="hora-stats__number">{stats.projects.toLocaleString()}+</div>
            <div className="hora-stats__label">Projects Managed</div>
          </div>
          <div className="hora-stats__item">
            <div className="hora-stats__number">{stats.sprints.toLocaleString()}+</div>
            <div className="hora-stats__label">Sprints Completed</div>
          </div>
          <div className="hora-stats__item">
            <div className="hora-stats__number">{stats.tasks.toLocaleString()}+</div>
            <div className="hora-stats__label">Tasks Tracked</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="hora-features">
        <div className="hora-features__container">
          <div className="hora-section-header">
            <h2 className="hora-section-title">Built for Modern Development Teams</h2>
            <p className="hora-section-subtitle">
              Everything you need to run efficient agile projects and deliver faster
            </p>
          </div>

          <div className="hora-features__grid">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={index}
                  className={`hora-feature-card ${activeFeature === index ? 'hora-feature-card--active' : ''}`}
                >
                  <div className="hora-feature-card__icon">
                    <Icon />
                  </div>
                  <h3 className="hora-feature-card__title">{feature.title}</h3>
                  <p className="hora-feature-card__description">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="hora-services">
        <div className="hora-services__container">
          <div className="hora-section-header">
            <h2 className="hora-section-title">Core Capabilities</h2>
            <p className="hora-section-subtitle">
              Comprehensive tools for every phase of your development cycle
            </p>
          </div>

          <div className="hora-services__grid">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <div key={index} className="hora-service-card">
                  <div 
                    className="hora-service-card__icon"
                    style={{ background: `linear-gradient(135deg, ${service.color} 0%, ${service.color}dd 100%)` }}
                  >
                    <Icon />
                  </div>
                  <h3 className="hora-service-card__title">{service.title}</h3>
                  <p className="hora-service-card__description">{service.description}</p>
                  <button className="hora-service-card__link">
                    Learn More <ChevronRight size={16} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="hora-testimonials">
        <div className="hora-testimonials__container">
          <div className="hora-section-header">
            <h2 className="hora-section-title">Loved by Development Teams</h2>
            <p className="hora-section-subtitle">
              See how teams are shipping faster with Hora
            </p>
          </div>

          <div className="hora-testimonials__grid">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="hora-testimonial-card">
                <div className="hora-testimonial-card__stars">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={20} fill="#fbbf24" color="#fbbf24" />
                  ))}
                </div>
                <p className="hora-testimonial-card__text">"{testimonial.text}"</p>
                <div className="hora-testimonial-card__author">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="hora-testimonial-card__avatar"
                  />
                  <div>
                    <div className="hora-testimonial-card__name">{testimonial.name}</div>
                    <div className="hora-testimonial-card__business">{testimonial.business}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="hora-cta">
        <div className="hora-cta__container">
          <h2 className="hora-cta__title">Ready to Ship Faster?</h2>
          <p className="hora-hero__subtitle">
              “Experience the evolution of engineering execution.”
            </p>
          <button className="hora-btn hora-btn--primary hora-btn--lg" onClick={ ()=>window.open("https://sd-tracking.onrender.com/")}>
            Explore Hora
            <ArrowRight className="hora-btn__icon-right" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="hora-footer">
        <div className="hora-footer__container">
          <div className="hora-footer__content">
            <div className="hora-footer__section">
              <div className="hora-footer__logo">
                <Clock size={32} />
                <span>Hora</span>
              </div>
              <p className="hora-footer__description">
                Modern agile project management for development teams who ship fast.
              </p>
            </div>
            <div className="hora-footer__section">
              <h4 className="hora-footer__heading">Product</h4>
              <a href="#" className="hora-footer__link">Features</a>
              <a href="#" className="hora-footer__link">Pricing</a>
              <a href="#" className="hora-footer__link">Integrations</a>
              <a href="#" className="hora-footer__link">Documentation</a>
            </div>
            <div className="hora-footer__section">
              <h4 className="hora-footer__heading">Company</h4>
              <a href="#" className="hora-footer__link">About</a>
              <a href="#" className="hora-footer__link">Blog</a>
              <a href="#" className="hora-footer__link">Careers</a>
              <a href="#" className="hora-footer__link">Contact</a>
            </div>
            <div className="hora-footer__section">
              <h4 className="hora-footer__heading">Resources</h4>
              <a href="#" className="hora-footer__link">Help Center</a>
              <a href="#" className="hora-footer__link">API Reference</a>
              <a href="#" className="hora-footer__link">Community</a>
              <a href="#" className="hora-footer__link">Status</a>
            </div>
          </div>
          <div className="hora-footer__bottom">
            <p>&copy; {new Date(Date.now()).getFullYear()} Hora. Built for developers, by developers.</p>
          </div>
        </div>
      </footer>


      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .hora-showcase {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
          color: #1f2937;
          overflow-x: hidden;
        }

        /* Navigation */
        .hora-nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
        }

        .hora-nav--scrolled {
          background: white;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .hora-nav__container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 1rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .hora-nav__logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1.5rem;
          font-weight: 800;
          color: #667eea;
        }

        .hora-nav__logo-icon {
          width: 32px;
          height: 32px;
        }

        .hora-nav__menu {
          display: flex;
          align-items: center;
          gap: 2rem;
        }

        .hora-nav__link {
          color: #4b5563;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s;
        }

        .hora-nav__link:hover {
          color: #667eea;
        }

        .hora-nav__toggle {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          color: #4b5563;
        }

        /* Hero Section */
        .hora-hero {
          padding: 8rem 2rem 6rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          position: relative;
          overflow: hidden;
        }

        .hora-hero::before {
          content: '';
          position: absolute;
          width: 500px;
          height: 500px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          top: -250px;
          right: -250px;
        }

        .hora-hero__container {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
          position: relative;
          z-index: 1;
        }

        .hora-hero__badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(255, 255, 255, 0.2);
          padding: 0.5rem 1rem;
          border-radius: 2rem;
          color: white;
          font-size: 0.875rem;
          margin-bottom: 2rem;
          backdrop-filter: blur(10px);
        }

        .hora-hero__title {
          font-size: 3.5rem;
          font-weight: 800;
          color: white;
          line-height: 1.2;
          margin-bottom: 1.5rem;
        }

        .hora-gradient-text {
          background: linear-gradient(135deg, #fff 0%, #f0f0f0 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hora-hero__subtitle {
          font-size: 1.25rem;
          color: rgba(255, 255, 255, 0.9);
          margin-bottom: 2rem;
          line-height: 1.7;
        }

        .hora-hero__actions {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .hora-hero__image {
          position: relative;
          height: 500px;
        }

        .hora-hero__card {
          position: absolute;
          background: white;
          padding: 1.5rem;
          border-radius: 1rem;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
          display: flex;
          align-items: center;
          gap: 1rem;
          animation: float 3s ease-in-out infinite;
        }

        .hora-hero__card--1 {
          top: 50px;
          left: 50px;
          animation-delay: 0s;
        }

        .hora-hero__card--2 {
          top: 200px;
          right: 50px;
          animation-delay: 1s;
        }

        .hora-hero__card--3 {
          bottom: 50px;
          left: 100px;
          animation-delay: 2s;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        .hora-hero__card-label {
          font-size: 0.875rem;
          color: #6b7280;
        }

        .hora-hero__card-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: #667eea;
        }

        /* Stats Section */
        .hora-stats {
          padding: 4rem 2rem;
          background: white;
        }

        .hora-stats__container {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2rem;
        }

        .hora-stats__item {
          text-align: center;
        }

        .hora-stats__number {
          font-size: 3rem;
          font-weight: 800;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 0.5rem;
        }

        .hora-stats__label {
          font-size: 1rem;
          color: #6b7280;
        }

        /* Section Header */
        .hora-section-header {
          text-align: center;
          margin-bottom: 4rem;
        }

        .hora-section-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 1rem;
        }

        .hora-section-subtitle {
          font-size: 1.125rem;
          color: #6b7280;
        }

        /* Features Section */
        .hora-features {
          padding: 6rem 2rem;
          background: #f9fafb;
        }

        .hora-features__container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .hora-features__grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
        }

        .hora-feature-card {
          background: white;
          padding: 2rem;
          border-radius: 1rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
        }

        .hora-feature-card--active {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(102, 126, 234, 0.2);
        }

        .hora-feature-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }

        .hora-feature-card__icon {
          width: 4rem;
          height: 4rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          margin-bottom: 1.5rem;
        }

        .hora-feature-card__title {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 0.75rem;
          color: #1f2937;
        }

        .hora-feature-card__description {
          color: #6b7280;
          line-height: 1.6;
        }

        /* Services Section */
        .hora-services {
          padding: 6rem 2rem;
          background: white;
        }

        .hora-services__container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .hora-services__grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
        }

        .hora-service-card {
          text-align: center;
          padding: 2rem;
          border-radius: 1rem;
          background: #f9fafb;
          transition: all 0.3s ease;
        }

        .hora-service-card:hover {
          transform: translateY(-10px);
          background: white;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }

        .hora-service-card__icon {
          width: 5rem;
          height: 5rem;
          border-radius: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          margin: 0 auto 1.5rem;
        }

        .hora-service-card__title {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 0.75rem;
          color: #1f2937;
        }

        .hora-service-card__description {
          color: #6b7280;
          margin-bottom: 1rem;
        }

        .hora-service-card__link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          color: #667eea;
          background: none;
          border: none;
          cursor: pointer;
          font-weight: 600;
        }

        /* Testimonials Section */
        .hora-testimonials {
          padding: 6rem 2rem;
          background: #f9fafb;
        }

        .hora-testimonials__container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .hora-testimonials__grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }

        .hora-testimonial-card {
          background: white;
          padding: 2rem;
          border-radius: 1rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
        }

        .hora-testimonial-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }

        .hora-testimonial-card__stars {
          display: flex;
          gap: 0.25rem;
          margin-bottom: 1rem;
        }

        .hora-testimonial-card__text {
          color: #4b5563;
          font-size: 1rem;
          line-height: 1.6;
          margin-bottom: 1.5rem;
        }

        .hora-testimonial-card__author {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .hora-testimonial-card__avatar {
          width: 3rem;
          height: 3rem;
          border-radius: 50%;
        }

        .hora-testimonial-card__name {
          font-weight: 600;
          color: #1f2937;
        }

        .hora-testimonial-card__business {
          font-size: 0.875rem;
          color: #6b7280;
        }

        /* CTA Section */
        .hora-cta {
          padding: 6rem 2rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          text-align: center;
        }

        .hora-cta__container {
          max-width: 800px;
          margin: 0 auto;
        }

        .hora-cta__title {
          font-size: 2.5rem;
          font-weight: 700;
          color: white;
          margin-bottom: 1rem;
        }

        .hora-cta__subtitle {
          font-size: 1.25rem;
          color: rgba(255, 255, 255, 0.9);
          margin-bottom: 2rem;
        }

        /* Footer */
        .hora-footer {
          background: #1f2937;
          color: white;
          padding: 4rem 2rem 2rem;
        }

        .hora-footer__container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .hora-footer__content {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 3rem;
          margin-bottom: 3rem;
        }

        .hora-footer__logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1.5rem;
          font-weight: 800;
          margin-bottom: 1rem;
        }

        .hora-footer__description {
          color: #9ca3af;
          line-height: 1.6;
        }

        .hora-footer__heading {
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 1rem;
        }

        .hora-footer__link {
          display: block;
          color: #9ca3af;
          text-decoration: none;
          margin-bottom: 0.5rem;
          transition: color 0.2s;
        }

        .hora-footer__link:hover {
          color: white;
        }

        .hora-footer__bottom {
          padding-top: 2rem;
          border-top: 1px solid #374151;
          text-align: center;
          color: #9ca3af;
        }

        /* Buttons */
        .hora-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.875rem 1.75rem;
          border-radius: 0.75rem;
          font-size: 1rem;
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
        }

        .hora-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
        }

        .hora-btn--primary {
          background: white;
          color: #667eea;
        }

        .hora-btn--primary:hover {
          background: #f9fafb;
        }

        .hora-btn--outline {
          background: transparent;
          color: white;
          border: 2px solid white;
        }

        .hora-btn--outline:hover {
          background: white;
          color: #667eea;
        }

        .hora-btn--sm {
          padding: 0.625rem 1.25rem;
          font-size: 0.875rem;
        }

        .hora-btn--lg {
          padding: 1rem 2rem;
          font-size: 1.125rem;
        }

        .hora-btn__icon-right {
          margin-left: 0.5rem;
          width: 1.25rem;
          height: 1.25rem;
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .hora-hero__container {
            grid-template-columns: 1fr;
            gap: 3rem;
          }

          .hora-hero__image {
            height: 400px;
          }

          .hora-stats__container {
            grid-template-columns: repeat(2, 1fr);
          }

          .hora-footer__content {
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
          }
        }

        @media (max-width: 768px) {
          .hora-nav__menu {
            position: fixed;
            top: 70px;
            left: 0;
            right: 0;
            background: white;
            flex-direction: column;
            padding: 2rem;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            transform: translateY(-120%);
            transition: transform 0.3s ease;
          }

          .hora-nav__menu--open {
            transform: translateY(0);
          }

          .hora-nav__toggle {
            display: block;
          }

          .hora-hero {
            padding: 6rem 1.5rem 4rem;
          }

          .hora-hero__title {
            font-size: 2.5rem;
          }

          .hora-hero__subtitle {
            font-size: 1rem;
          }

          .hora-hero__actions {
            flex-direction: column;
          }

          .hora-hero__actions .hora-btn {
            width: 100%;
          }

          .hora-hero__image {
            display: none;
          }

          .hora-section-title {
            font-size: 2rem;
          }

          .hora-stats__container {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .hora-features__grid,
          .hora-services__grid,
          .hora-testimonials__grid {
            grid-template-columns: 1fr;
          }

          .hora-cta__title {
            font-size: 2rem;
          }

          .hora-footer__content {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 480px) {
          .hora-nav__container {
            padding: 1rem;
          }

          .hora-hero__title {
            font-size: 2rem;
          }

          .hora-stats__number {
            font-size: 2rem;
          }

          .hora-section-title {
            font-size: 1.75rem;
          }

          .hora-cta__title {
            font-size: 1.75rem;
          }

          .hora-btn--lg {
            padding: 0.875rem 1.5rem;
            font-size: 1rem;
          }
        }

        /* Smooth Scrolling */
        html {
          scroll-behavior: smooth;
        }

        /* Loading Animation */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .hora-hero__content,
        .hora-feature-card,
        .hora-service-card,
        .hora-testimonial-card {
          animation: fadeInUp 0.6s ease-out;
        }

        .hora-feature-card:nth-child(1) { animation-delay: 0.1s; }
        .hora-feature-card:nth-child(2) { animation-delay: 0.2s; }
        .hora-feature-card:nth-child(3) { animation-delay: 0.3s; }
        .hora-feature-card:nth-child(4) { animation-delay: 0.4s; }

        .hora-service-card:nth-child(1) { animation-delay: 0.1s; }
        .hora-service-card:nth-child(2) { animation-delay: 0.2s; }
        .hora-service-card:nth-child(3) { animation-delay: 0.3s; }
        .hora-service-card:nth-child(4) { animation-delay: 0.4s; }

        .hora-testimonial-card:nth-child(1) { animation-delay: 0.1s; }
        .hora-testimonial-card:nth-child(2) { animation-delay: 0.2s; }
        .hora-testimonial-card:nth-child(3) { animation-delay: 0.3s; }

        /* Gradient Text Animation */
        @keyframes gradientShift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .hora-gradient-text {
          background-size: 200% 200%;
          animation: gradientShift 3s ease infinite;
        }

        /* Pulse Animation for Stats */
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }

        .hora-stats__number {
          animation: pulse 2s ease-in-out infinite;
        }

        /* Hover Effects */
        .hora-feature-card__icon {
          transition: transform 0.3s ease;
        }

        .hora-feature-card:hover .hora-feature-card__icon {
          transform: scale(1.1) rotate(5deg);
        }

        .hora-service-card__icon {
          transition: transform 0.3s ease;
        }

        .hora-service-card:hover .hora-service-card__icon {
          transform: scale(1.1);
        }

        /* Shimmer Effect */
        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }

        .hora-hero__badge {
          position: relative;
          overflow: hidden;
        }

        .hora-hero__badge::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.3),
            transparent
          );
          animation: shimmer 3s infinite;
        }

        /* Scroll Reveal Animation */
        .hora-section-header {
          opacity: 0;
          animation: fadeInUp 0.6s ease-out forwards;
        }

        /* Card Glow Effect */
        .hora-feature-card--active::before {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          border-radius: 1rem;
          z-index: -1;
          opacity: 0.5;
          filter: blur(10px);
        }

        .hora-feature-card {
          position: relative;
        }

        /* Interactive Elements */
        .hora-service-card__link:hover {
          gap: 0.75rem;
        }

        .hora-testimonial-card__avatar {
          transition: transform 0.3s ease;
        }

        .hora-testimonial-card:hover .hora-testimonial-card__avatar {
          transform: scale(1.1);
        }

        /* Loading State */
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        /* Gradient Border Animation */
        @keyframes borderGradient {
          0%, 100% {
            border-color: #667eea;
          }
          50% {
            border-color: #764ba2;
          }
        }

        /* Focus States for Accessibility */
        .hora-btn:focus,
        .hora-nav__link:focus,
        .hora-footer__link:focus {
          outline: 3px solid #667eea;
          outline-offset: 2px;
        }

        /* Dark Mode Support (Optional) */
        @media (prefers-color-scheme: dark) {
          .hora-showcase {
            background: #111827;
          }
        }

        /* Additional Polish */
        .hora-hero__card svg {
          color: #667eea;
        }

        /* Link Underline Animation */
        .hora-nav__link {
          position: relative;
        }

        .hora-nav__link::after {
          content: '';
          position: absolute;
          bottom: -5px;
          left: 0;
          width: 0;
          height: 2px;
          background: #667eea;
          transition: width 0.3s ease;
        }

        .hora-nav__link:hover::after {
          width: 100%;
        }

        /* Service Card Link Arrow Animation */
        .hora-service-card__link {
          transition: gap 0.3s ease;
        }

        /* Testimonial Stars Animation */
        .hora-testimonial-card__stars svg {
          transition: transform 0.2s ease;
        }

        .hora-testimonial-card:hover .hora-testimonial-card__stars svg {
          transform: scale(1.1);
        }

        /* Button Ripple Effect */
        .hora-btn {
          position: relative;
          overflow: hidden;
        }

        .hora-btn::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          transform: translate(-50%, -50%);
          transition: width 0.6s, height 0.6s;
        }

        .hora-btn:active::after {
          width: 300px;
          height: 300px;
        }

        /* CTA Section Particles Effect */
        .hora-cta {
          position: relative;
          overflow: hidden;
        }

        .hora-cta::before,
        .hora-cta::after {
          content: '';
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          animation: float 6s ease-in-out infinite;
        }

        .hora-cta::before {
          width: 300px;
          height: 300px;
          top: -150px;
          left: -150px;
          animation-delay: 0s;
        }

        .hora-cta::after {
          width: 400px;
          height: 400px;
          bottom: -200px;
          right: -200px;
          animation-delay: 3s;
        }

        .hora-cta__container {
          position: relative;
          z-index: 1;
        }

        /* Scroll Progress Indicator */
        .hora-scroll-progress {
          position: fixed;
          top: 0;
          left: 0;
          height: 3px;
          background: linear-gradient(90deg, #667eea, #764ba2);
          z-index: 9999;
          transition: width 0.2s ease;
        }

        /* Shadow Depth Levels */
        .hora-shadow-sm {
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
        }

        .hora-shadow-md {
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .hora-shadow-lg {
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }

        .hora-shadow-xl {
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        }

        /* Text Selection Color */
        ::selection {
          background: #667eea;
          color: white;
        }

        ::-moz-selection {
          background: #667eea;
          color: white;
        }

        /* Scrollbar Styling */
        ::-webkit-scrollbar {
          width: 10px;
        }

        ::-webkit-scrollbar-track {
          background: #f1f1f1;
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #667eea, #764ba2);
          border-radius: 5px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #5568d3;
        }

        /* Image Loading State */
        .hora-testimonial-card__avatar {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }

        /* Enhanced Focus Visible */
        .hora-btn:focus-visible {
          outline: 3px solid #667eea;
          outline-offset: 3px;
        }

        /* Print Styles */
        @media print {
          .hora-nav,
          .hora-hero__image,
          .hora-cta,
          .hora-footer {
            display: none;
          }

          .hora-hero {
            padding: 2rem;
            background: white;
            color: black;
          }

          .hora-hero__title,
          .hora-section-title {
            color: black;
          }
        }

        /* Reduced Motion Support */
        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }

        /* High Contrast Mode Support */
        @media (prefers-contrast: high) {
          .hora-btn--primary {
            border: 2px solid currentColor;
          }

          .hora-feature-card,
          .hora-service-card,
          .hora-testimonial-card {
            border: 2px solid currentColor;
          }
        }

        /* Loading Skeleton */
        @keyframes skeletonLoading {
          0% {
            background-position: -200px 0;
          }
          100% {
            background-position: calc(200px + 100%) 0;
          }
        }

        .hora-skeleton {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200px 100%;
          animation: skeletonLoading 1.5s ease-in-out infinite;
        }

        /* Utility Classes */
        .hora-text-gradient {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hora-blur-backdrop {
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }

        /* Accessibility - Skip to Content */
        .hora-skip-link {
          position: absolute;
          top: -40px;
          left: 0;
          background: #667eea;
          color: white;
          padding: 0.5rem 1rem;
          text-decoration: none;
          z-index: 10000;
        }

        .hora-skip-link:focus {
          top: 0;
        }

        /* Performance Optimization */
        .hora-hero__card,
        .hora-feature-card,
        .hora-service-card,
        .hora-testimonial-card {
          will-change: transform;
        }

        /* Final Polish */
        * {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        body {
          text-rendering: optimizeLegibility;
        }

        img {
          max-width: 100%;
          height: auto;
          display: block;
        }

        button {
          font-family: inherit;
        }
      `}</style>
    </div>
  );
}