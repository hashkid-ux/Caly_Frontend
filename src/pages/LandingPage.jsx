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
      title: 'AI Voice Agent',
      description: 'Intelligent voice responses that handle customer inquiries 24/7 without human intervention'
    },
    {
      icon: Clock,
      title: '24/7 Availability',
      description: 'Never miss a customer. Your AI agent works around the clock, every single day'
    },
    {
      icon: BarChart3,
      title: '85% Automation Rate',
      description: 'Handle the majority of customer interactions automatically, freeing up your team'
    },
    {
      icon: Zap,
      title: 'Instant Responses',
      description: 'Sub-second response times that keep customers engaged and satisfied'
    },
    {
      icon: Users,
      title: 'Multi-Channel Support',
      description: 'Seamless integration with Shopify, WhatsApp, and your existing systems'
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Bank-grade encryption and compliance with industry standards'
    }
  ];

  const steps = [
    {
      number: '1',
      title: 'Connect Your Store',
      description: 'Link your Shopify store or e-commerce platform in minutes'
    },
    {
      number: '2',
      title: 'Train Your Agent',
      description: 'Customize product knowledge and response style for your brand'
    },
    {
      number: '3',
      title: 'Go Live',
      description: 'Your AI agent starts handling customer interactions immediately'
    }
  ];

  const pricing = [
    {
      name: 'Starter',
      price: '$99',
      period: '/month',
      description: 'Perfect for small businesses',
      features: [
        'Up to 500 conversations/month',
        'Basic AI responses',
        'Email support',
        'Single store integration'
      ],
      cta: 'Get Started',
      variant: 'outline'
    },
    {
      name: 'Professional',
      price: '$299',
      period: '/month',
      description: 'Most popular for growing stores',
      features: [
        'Up to 5,000 conversations/month',
        'Advanced AI with learning',
        'Priority support',
        'Multiple store integration',
        'Analytics dashboard'
      ],
      cta: 'Start Free Trial',
      variant: 'primary',
      popular: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: 'pricing',
      description: 'For large-scale operations',
      features: [
        'Unlimited conversations',
        'Custom AI training',
        'Dedicated support',
        'White-label options',
        'Advanced integrations'
      ],
      cta: 'Contact Sales',
      variant: 'outline'
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
              {['Features', 'How it Works', 'Pricing'].map((item) => (
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
            {['Features', 'How it Works', 'Pricing'].map((item) => (
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
          AI Voice Agent for <span style={{ color: colors.primary }}>E-commerce</span>
        </h1>
        <p style={{
          fontSize: '20px',
          color: colors.textSecondary,
          lineHeight: '1.6',
          maxWidth: '600px',
          margin: '0 auto 32px'
        }}>
          Handle customer inquiries 24/7 with intelligent voice responses. Reduce support costs by 70% while increasing customer satisfaction.
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
            { value: '10K+', label: 'Conversations Handled' },
            { value: '85%', label: 'Automation Rate' },
            { value: '<1s', label: 'Average Response Time' }
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

      {/* Pricing Section */}
      <section id="pricing" style={{
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
              Simple, Transparent Pricing
            </h2>
            <p style={{
              fontSize: '16px',
              color: colors.textSecondary,
              maxWidth: '500px',
              margin: '0 auto'
            }}>
              Choose the plan that fits your business. No hidden fees. Cancel anytime.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px'
          }}>
            {pricing.map((plan, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: colors.bgPrimary,
                  border: plan.popular ? `2px solid ${colors.primary}` : `1px solid ${colors.gray200}`,
                  borderRadius: '8px',
                  padding: '32px',
                  position: 'relative',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  if (!plan.popular) {
                    e.currentTarget.style.borderColor = colors.primary;
                  }
                  e.currentTarget.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={(e) => {
                  if (!plan.popular) {
                    e.currentTarget.style.borderColor = colors.gray200;
                  }
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {plan.popular && (
                  <div style={{
                    position: 'absolute',
                    top: '-12px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: colors.primary,
                    color: colors.light,
                    padding: '4px 12px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: '600',
                    letterSpacing: '0.5px'
                  }}>
                    MOST POPULAR
                  </div>
                )}

                <h3 style={{
                  fontSize: '22px',
                  fontWeight: '600',
                  marginBottom: '8px'
                }}>
                  {plan.name}
                </h3>
                <p style={{
                  fontSize: '14px',
                  color: colors.textSecondary,
                  marginBottom: '24px'
                }}>
                  {plan.description}
                </p>

                <div style={{ marginBottom: '24px' }}>
                  <span style={{
                    fontSize: '36px',
                    fontWeight: '700',
                    color: colors.primary
                  }}>
                    {plan.price}
                  </span>
                  <span style={{
                    fontSize: '14px',
                    color: colors.textSecondary,
                    marginLeft: '8px'
                  }}>
                    {plan.period}
                  </span>
                </div>

                <Button
                  onClick={() => navigate(plan.name === 'Enterprise' ? '/contact' : '/register')}
                  variant={plan.variant}
                  style={{
                    width: '100%',
                    marginBottom: '24px'
                  }}
                >
                  {plan.cta}
                </Button>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {plan.features.map((feature, fidx) => (
                    <div key={fidx} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                      <CheckCircle2 size={18} color={colors.primary} style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span style={{
                        fontSize: '14px',
                        color: colors.textSecondary
                      }}>
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
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
            Ready to Transform Your Customer Support?
          </h2>
          <p style={{
            fontSize: '16px',
            marginBottom: '32px',
            opacity: 0.9,
            lineHeight: '1.6'
          }}>
            Join hundreds of e-commerce businesses reducing support costs while improving customer satisfaction.
          </p>
          <Button
            onClick={() => navigate('/register')}
            style={{
              backgroundColor: colors.light,
              color: colors.primary,
              padding: '12px 32px'
            }}
          >
            Start Your Free Trial
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
