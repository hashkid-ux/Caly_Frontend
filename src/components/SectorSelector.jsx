// Frontend/src/components/SectorSelector.jsx
// ✅ PHASE 2: Sector selection component for onboarding

import React, { useState } from 'react';
import { Building2, Stethoscope, Home, Truck, DollarSign, Headphones, Zap, Shield, GraduationCap, Plane, Package, Users } from 'lucide-react';

const SECTORS = [
  {
    id: 'ecommerce',
    name: 'E-commerce & D2C',
    description: 'Online stores, marketplaces, direct-to-consumer brands',
    icon: Package,
    color: 'from-blue-500 to-blue-600',
    features: ['Order tracking', 'Returns & refunds', 'Product info', 'Delivery updates']
  },
  {
    id: 'healthcare',
    name: 'Healthcare',
    description: 'Clinics, hospitals, pharmacies, telehealth providers',
    icon: Stethoscope,
    color: 'from-green-500 to-green-600',
    features: ['Appointment booking', 'Prescription refills', 'Patient triage', 'Follow-ups'],
    comingSoon: false
  },
  {
    id: 'realestate',
    name: 'Real Estate',
    description: 'Property agents, brokers, real estate companies',
    icon: Home,
    color: 'from-amber-500 to-amber-600',
    features: ['Property inquiries', 'Viewing scheduling', 'Lead capture', 'Offer tracking'],
    comingSoon: false
  },
  {
    id: 'logistics',
    name: 'Logistics & Delivery',
    description: 'Courier services, last-mile delivery, supply chain',
    icon: Truck,
    color: 'from-purple-500 to-purple-600',
    features: ['Parcel tracking', 'Pickup scheduling', 'Delivery failures', 'Address clarification'],
    comingSoon: false
  },
  {
    id: 'fintech',
    name: 'Fintech & Banking',
    description: 'Banks, fintech startups, payment providers',
    icon: DollarSign,
    color: 'from-indigo-500 to-indigo-600',
    features: ['Balance inquiries', 'Transaction verification', 'Fraud reporting', 'Loan FAQs'],
    comingSoon: true
  },
  {
    id: 'support',
    name: 'Customer Support',
    description: 'SaaS, software, support centers, BPOs',
    icon: Headphones,
    color: 'from-cyan-500 to-cyan-600',
    features: ['L1 support', 'Ticket creation', 'FAQ lookup', 'Issue escalation'],
    comingSoon: true
  },
  {
    id: 'telecom',
    name: 'Telecom & Utilities',
    description: 'Telecom providers, ISPs, utilities, water services',
    icon: Zap,
    color: 'from-orange-500 to-orange-600',
    features: ['Outage notifications', 'Billing queries', 'Service activation', 'Appointments'],
    comingSoon: true
  },
  {
    id: 'government',
    name: 'Government & Public',
    description: 'Government agencies, municipalities, public services',
    icon: Shield,
    color: 'from-red-500 to-red-600',
    features: ['Citizen routing', 'Complaint intake', 'Status updates', 'Permit tracking'],
    comingSoon: true
  },
  {
    id: 'education',
    name: 'Education & EdTech',
    description: 'Schools, colleges, coaching centers, online learning',
    icon: GraduationCap,
    color: 'from-pink-500 to-pink-600',
    features: ['Admissions FAQ', 'Batch schedules', 'Enrollment', 'Reminders'],
    comingSoon: true
  },
  {
    id: 'travel',
    name: 'Travel & Hospitality',
    description: 'Hotels, travel agencies, tour operators, restaurants',
    icon: Plane,
    color: 'from-teal-500 to-teal-600',
    features: ['Booking confirmations', 'Itinerary Q&A', 'Check-in info', 'Disruption alerts'],
    comingSoon: true
  },
  {
    id: 'saas',
    name: 'SaaS & Software',
    description: 'B2B software, platforms, business applications',
    icon: Users,
    color: 'from-slate-500 to-slate-600',
    features: ['Onboarding support', 'Billing queries', 'Demo scheduling', 'Feature FAQs'],
    comingSoon: true
  }
];

/**
 * Sector Selection Component
 * Allows users to select their business sector during onboarding
 */
const SectorSelector = ({ 
  selectedSector = null, 
  onSelect = () => {},
  showComingSoon = true,
  maxColumns = 3 
}) => {
  const [hoveredSector, setHoveredSector] = useState(null);

  const availableSectors = showComingSoon 
    ? SECTORS 
    : SECTORS.filter(s => !s.comingSoon);

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          What's your business type?
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Select your industry to get a personalized setup experience tailored to your needs.
        </p>
      </div>

      {/* Sectors Grid */}
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${maxColumns} gap-4`}>
        {availableSectors.map((sector) => {
          const IconComponent = sector.icon;
          const isSelected = selectedSector === sector.id;
          const isDisabled = sector.comingSoon;

          return (
            <button
              key={sector.id}
              onClick={() => !isDisabled && onSelect(sector.id)}
              disabled={isDisabled}
              onMouseEnter={() => setHoveredSector(sector.id)}
              onMouseLeave={() => setHoveredSector(null)}
              className={`
                relative p-6 rounded-lg border-2 transition-all duration-200
                ${isSelected 
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                  : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
                }
                ${isDisabled 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'cursor-pointer hover:shadow-lg'
                }
                text-left
              `}
            >
              {/* Coming Soon Badge */}
              {isDisabled && (
                <div className="absolute top-2 right-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 text-xs font-semibold px-2 py-1 rounded">
                  Coming Soon
                </div>
              )}

              {/* Icon with gradient background */}
              <div className={`
                w-12 h-12 rounded-lg bg-gradient-to-br ${sector.color} 
                flex items-center justify-center mb-4 text-white
              `}>
                <IconComponent size={24} />
              </div>

              {/* Content */}
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                {sector.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {sector.description}
              </p>

              {/* Features (shown on hover or when selected) */}
              {(isSelected || hoveredSector === sector.id) && !isDisabled && (
                <div className="space-y-1 animate-fadeIn">
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                    Key Features:
                  </p>
                  {sector.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                      <span className="mr-2">✓</span>
                      {feature}
                    </div>
                  ))}
                </div>
              )}

              {/* Selection Indicator */}
              {isSelected && !isDisabled && (
                <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                  <span className="text-white text-sm">✓</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Info Box */}
      <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <p className="text-sm text-blue-900 dark:text-blue-100">
          💡 <strong>Tip:</strong> Your sector determines the agents, features, and configurations available. 
          You can change this later in Settings.
        </p>
      </div>
    </div>
  );
};

export default SectorSelector;
