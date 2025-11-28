import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import {
  Menu, X, Phone, Clock, BarChart3, Zap, Users, Shield,
  ChevronRight, CheckCircle2, ArrowRight
} from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  const colors = {
    primary: '#2563EB',
    light: '#FFFFFF',
    gray100: '#F3F4F6',
    gray200: '#E5E7EB',
    gray300: '#D1D5DB',
    text: isDark ? '#F3F4F6' : '#111827',
    textSecondary: isDark ? '#D1D5DB' : '#6B7280',
    bgPrimary: isDark ? '#111827' : '#FFFFFF',
    bgSecondary: isDark ? '#1F2937' : '#F9FAFB',
  };

  const features = [
    {
      icon: Phone,
      title: 'Natural Conversations',
      description: 'Advanced AI that understands context and delivers human-like interactions for any service scenario'
    },
    {
      icon: Clock,
      title: '24/7 Reliability',
      description: 'Always available, consistent performance around the clock without downtime or fatigue'
    },
    {
      icon: BarChart3,
      title: 'Intelligent Handling',
      description: 'Smart routing, escalation, and resolution of customer inquiries with precision'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Sub-500ms response times for seamless, natural-feeling conversations'
    },
    {
      icon: Users,
      title: 'Omnichannel Support',
      description: 'Work across phone, messaging, chat, and any communication channel your customers prefer'
    },
    {
      icon: Shield,
      title: 'Enterprise Grade',
      description: 'Bank-level security, compliance, and data protection for your customers'
    }
  ];

  const steps = [
    {
      number: '1',
      title: 'Connect & Configure',
      description: 'Integrate with your existing systems and train Caly with your service knowledge'
    },
    {
      number: '2',
      title: 'Customize & Deploy',
      description: 'Set up voice workflows tailored to your business needs and customer interactions'
    },
    {
      number: '3',
      title: 'Monitor & Improve',
      description: 'Real-time insights and continuous learning to enhance conversation quality'
    }
  ];

  const benefits = [
    {
      title: 'Unmatched Reliability',
      description: 'Never miss a customer. 99.9% uptime guarantee with consistent performance'
    },
    {
      title: 'Superior Quality',
      description: 'Natural conversations that understand context and deliver excellent customer experience'
    },
    {
      title: 'Always Learning',
      description: 'Continuously improves through interactions, becoming smarter and better over time'
    },
    {
      title: 'Full Integration',
      description: 'Works seamlessly with your existing systems and workflows'
    }
  ];

  const Button = ({ onClick, variant = 'primary', children, style = {} }) => {
    const isOutline = variant === 'outline';
    return (
      <button
        onClick={onClick}
        onMouseEnter={(e) => {
          if (isOutline) {
            e.currentTarget.style.backgroundColor = colors.gray100;
          } else {
            e.currentTarget.style.opacity = '0.9';
          }
        }}
        onMouseLeave={(e) => {
          if (isOutline) {
            e.currentTarget.style.backgroundColor = 'transparent';
          } else {
            e.currentTarget.style.opacity = '1';
          }
        }}
        style={{
          padding: '12px 24px',
          backgroundColor: isOutline ? 'transparent' : colors.primary,
          border: isOutline ? `1px solid ${colors.gray200}` : 'none',
          borderRadius: '6px',
          fontSize: '14px',
          fontWeight: '600',
          color: isOutline ? colors.text : colors.light,
          cursor: 'pointer',
          transition: 'all 0.2s',
          ...style
        }}
      >
        {children}
      </button>
    );
  };

  return (
    <div style={{ backgroundColor: colors.bgPrimary, color: colors.text, minHeight: '100vh' }}>
      {/* Navigation */}
      <nav style={{
        backgroundColor: colors.bgPrimary,
        borderBottom: `1px solid ${colors.gray200}`,
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '64px' }}>
            {/* Logo */}
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
              onClick={() => navigate('/')}
            >
              <div style={{
                width: '32px',
                height: '32px',
                backgroundColor: colors.primary,
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Phone size={20} color={colors.light} />
              </div>
              <span style={{ fontSize: '20px', fontWeight: '700', letterSpacing: '-0.5px' }}>Caly</span>
            </div>

            {/* Desktop Menu */}
            <div style={{
              display: 'flex',
              gap: '32px',
              alignItems: 'center',
              '@media (maxWidth: 768px)': { display: 'none' }
            }}>
              {['Features', 'How it Works', 'Benefits'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(' ', '-')}`}
                  style={{
                    textDecoration: 'none',
                    color: colors.textSecondary,
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.color = colors.text}
                  onMouseLeave={(e) => e.target.style.color = colors.textSecondary}
                >
                  {item}
                </a>
              ))}
            </div>

            {/* Desktop CTA Buttons */}
            <div style={{
              display: 'flex',
              gap: '12px',
              alignItems: 'center',
              '@media (maxWidth: 768px)': { display: 'none' }
            }}>
              <Button
                onClick={() => navigate('/login')}
                variant="outline"
              >
                Sign In
              </Button>
              <Button onClick={() => navigate('/register')}>
                Get Started
              </Button>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              style={{
                display: 'block',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '8px',
                '@media (minWidth: 768px)': { display: 'none' }
              }}
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div style={{
            display: 'block',
            backgroundColor: colors.bgSecondary,
            borderTop: `1px solid ${colors.gray200}`,
            padding: '16px 24px'
          }}>
            {['Features', 'How it Works', 'Benefits'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(' ', '-')}`}
                style={{
                  display: 'block',
                  padding: '12px 0',
                  textDecoration: 'none',
                  color: colors.textSecondary,
                  fontSize: '14px',
                  fontWeight: '500',
                  borderBottom: `1px solid ${colors.gray200}`
                }}
                onClick={() => setMenuOpen(false)}
              >
                {item}
              </a>
            ))}
            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
              <Button
                onClick={() => {
                  navigate('/login');
                  setMenuOpen(false);
                }}
                variant="outline"
                style={{ flex: 1 }}
              >
                Sign In
              </Button>
              <Button
                onClick={() => {
                  navigate('/register');
                  setMenuOpen(false);
                }}
                style={{ flex: 1 }}
              >
                Get Started
              </Button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '60px 24px',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: '48px',
          fontWeight: '700',
          lineHeight: '1.2',
          marginBottom: '16px',
          letterSpacing: '-1px'
        }}>
          AI Voice Agent for <span style={{ color: colors.primary }}>Any Service</span>
        </h1>
        <p style={{
          fontSize: '20px',
          color: colors.textSecondary,
          lineHeight: '1.6',
          maxWidth: '600px',
          margin: '0 auto 32px'
        }}>
          Reliable, intelligent voice automation for service and support. Handle customer conversations 24/7 with consistent quality and precision.
        </p>

        <div style={{
          display: 'flex',
          gap: '16px',
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginBottom: '48px'
        }}>
          <Button
            onClick={() => navigate('/register')}
            style={{
              padding: '12px 32px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            Start Free Trial
            <ArrowRight size={18} />
          </Button>
          <Button
            variant="outline"
            onClick={() => {}}
            style={{
              padding: '12px 32px'
            }}
          >
            Schedule Demo
          </Button>
        </div>

        {/* Hero Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '24px',
          marginTop: '48px',
          paddingTop: '32px',
          borderTop: `1px solid ${colors.gray200}`
        }}>
          {[
            { value: '99.9%', label: 'Uptime Guarantee' },
            { value: '<500ms', label: 'Response Time' },
            { value: '24/7', label: 'Availability' }
          ].map((stat, idx) => (
            <div key={idx}>
              <p style={{ fontSize: '28px', fontWeight: '700', color: colors.primary, marginBottom: '4px' }}>
                {stat.value}
              </p>
              <p style={{ fontSize: '14px', color: colors.textSecondary }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" style={{
        backgroundColor: colors.bgSecondary,
        padding: '60px 24px'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{
              fontSize: '36px',
              fontWeight: '700',
              marginBottom: '16px',
              letterSpacing: '-0.5px'
            }}>
              Powerful Features
            </h2>
            <p style={{
              fontSize: '16px',
              color: colors.textSecondary,
              maxWidth: '500px',
              margin: '0 auto'
            }}>
              Everything you need to deliver exceptional customer support at scale
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px'
          }}>
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={idx}
                  style={{
                    backgroundColor: colors.bgPrimary,
                    border: `1px solid ${colors.gray200}`,
                    borderRadius: '8px',
                    padding: '24px',
                    transition: 'all 0.2s',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = colors.primary;
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = `0 4px 12px rgba(37, 99, 235, 0.1)`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = colors.gray200;
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{
                    width: '48px',
                    height: '48px',
                    backgroundColor: `rgba(37, 99, 235, 0.1)`,
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '16px'
                  }}>
                    <Icon size={24} color={colors.primary} />
                  </div>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    marginBottom: '8px'
                  }}>
                    {feature.title}
                  </h3>
                  <p style={{
                    fontSize: '14px',
                    color: colors.textSecondary,
                    lineHeight: '1.6'
                  }}>
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" style={{
        backgroundColor: colors.bgPrimary,
        padding: '60px 24px'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{
              fontSize: '36px',
              fontWeight: '700',
              marginBottom: '16px',
              letterSpacing: '-0.5px'
            }}>
              How It Works
            </h2>
            <p style={{
              fontSize: '16px',
              color: colors.textSecondary,
              maxWidth: '500px',
              margin: '0 auto'
            }}>
              Get your AI agent up and running in three simple steps
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '32px'
          }}>
            {steps.map((step, idx) => (
              <div key={idx} style={{ position: 'relative' }}>
                <div style={{ position: 'relative', zIndex: 10 }}>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    backgroundColor: colors.primary,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 24px',
                    color: colors.light,
                    fontSize: '32px',
                    fontWeight: '700'
                  }}>
                    {step.number}
                  </div>
                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: '600',
                    marginBottom: '8px',
                    textAlign: 'center'
                  }}>
                    {step.title}
                  </h3>
                  <p style={{
                    fontSize: '14px',
                    color: colors.textSecondary,
                    textAlign: 'center',
                    lineHeight: '1.6'
                  }}>
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" style={{
        backgroundColor: colors.bgSecondary,
        padding: '60px 24px'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{
              fontSize: '36px',
              fontWeight: '700',
              marginBottom: '16px',
              letterSpacing: '-0.5px'
            }}>
              Why Choose Caly
            </h2>
            <p style={{
              fontSize: '16px',
              color: colors.textSecondary,
              maxWidth: '500px',
              margin: '0 auto'
            }}>
              Built for reliability, quality, and seamless integration with your service workflows
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px'
          }}>
            {benefits.map((benefit, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: colors.bgPrimary,
                  border: `1px solid ${colors.gray200}`,
                  borderRadius: '8px',
                  padding: '32px',
                  transition: 'all 0.2s',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = colors.primary;
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = `0 4px 12px rgba(37, 99, 235, 0.1)`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = colors.gray200;
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: `rgba(37, 99, 235, 0.1)`,
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px'
                }}>
                  <CheckCircle2 size={24} color={colors.primary} />
                </div>
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  marginBottom: '12px'
                }}>
                  {benefit.title}
                </h3>
                <p style={{
                  fontSize: '14px',
                  color: colors.textSecondary,
                  lineHeight: '1.6'
                }}>
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        backgroundColor: colors.primary,
        padding: '60px 24px',
        color: colors.light
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{
            fontSize: '32px',
            fontWeight: '700',
            marginBottom: '16px',
            letterSpacing: '-0.5px'
          }}>
            Ready to Experience Reliable AI Automation?
          </h2>
          <p style={{
            fontSize: '16px',
            marginBottom: '32px',
            opacity: 0.9,
            lineHeight: '1.6'
          }}>
            Join organizations leveraging intelligent voice automation for superior customer service.
          </p>
          <Button
            onClick={() => navigate('/register')}
            style={{
              backgroundColor: colors.light,
              color: colors.primary,
              padding: '12px 32px'
            }}
          >
            Get Started Today
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        backgroundColor: colors.bgSecondary,
        borderTop: `1px solid ${colors.gray200}`,
        padding: '48px 24px 24px'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '32px',
            marginBottom: '32px'
          }}>
            {/* Company Info */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <div style={{
                  width: '28px',
                  height: '28px',
                  backgroundColor: colors.primary,
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Phone size={16} color={colors.light} />
                </div>
                <span style={{ fontSize: '16px', fontWeight: '700' }}>Caly</span>
              </div>
              <p style={{
                fontSize: '14px',
                color: colors.textSecondary,
                lineHeight: '1.6'
              }}>
                AI-powered customer support for modern e-commerce businesses.
              </p>
            </div>

            {/* Product */}
            <div>
              <h4 style={{
                fontSize: '14px',
                fontWeight: '600',
                marginBottom: '12px'
              }}>
                Product
              </h4>
              <ul style={{
                listStyle: 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                {['Features', 'Pricing', 'Security', 'Roadmap'].map((item) => (
                  <li key={item}>
                    <a href="#" style={{
                      color: colors.textSecondary,
                      textDecoration: 'none',
                      fontSize: '14px',
                      transition: 'color 0.2s',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => e.target.style.color = colors.text}
                    onMouseLeave={(e) => e.target.style.color = colors.textSecondary}
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 style={{
                fontSize: '14px',
                fontWeight: '600',
                marginBottom: '12px'
              }}>
                Company
              </h4>
              <ul style={{
                listStyle: 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                {['About', 'Blog', 'Careers', 'Contact'].map((item) => (
                  <li key={item}>
                    <a href="#" style={{
                      color: colors.textSecondary,
                      textDecoration: 'none',
                      fontSize: '14px',
                      transition: 'color 0.2s',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => e.target.style.color = colors.text}
                    onMouseLeave={(e) => e.target.style.color = colors.textSecondary}
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 style={{
                fontSize: '14px',
                fontWeight: '600',
                marginBottom: '12px'
              }}>
                Legal
              </h4>
              <ul style={{
                listStyle: 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                {['Privacy', 'Terms', 'Cookie Policy', 'Compliance'].map((item) => (
                  <li key={item}>
                    <a href="#" style={{
                      color: colors.textSecondary,
                      textDecoration: 'none',
                      fontSize: '14px',
                      transition: 'color 0.2s',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => e.target.style.color = colors.text}
                    onMouseLeave={(e) => e.target.style.color = colors.textSecondary}
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Footer */}
          <div style={{
            borderTop: `1px solid ${colors.gray200}`,
            paddingTop: '24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <p style={{
              fontSize: '14px',
              color: colors.textSecondary
            }}>
              © 2025 Caly. All rights reserved.
            </p>
            <div style={{
              display: 'flex',
              gap: '24px'
            }}>
              {['Twitter', 'LinkedIn', 'GitHub'].map((social) => (
                <a key={social} href="#" style={{
                  color: colors.textSecondary,
                  textDecoration: 'none',
                  fontSize: '14px',
                  transition: 'color 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.color = colors.text}
                onMouseLeave={(e) => e.target.style.color = colors.textSecondary}
                >
                  {social}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
