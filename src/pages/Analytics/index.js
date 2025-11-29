/**
 * Analytics Pages Index
 * Phase 7: Advanced Analytics & Performance Optimization
 * 
 * Central export point for all analytics dashboard pages
 */

export { default as PerformanceDashboard } from './PerformanceDashboard';
export { default as CallAnalytics } from './CallAnalytics';
export { default as SatisfactionMetrics } from './SatisfactionMetrics';
export { default as RevenueAnalysis } from './RevenueAnalysis';
export { default as PredictionsDashboard } from './PredictionsDashboard';

// Analytics dashboard configuration
export const ANALYTICS_PAGES = [
  {
    path: '/analytics/performance',
    name: 'Performance Dashboard',
    icon: 'dashboard',
    component: 'PerformanceDashboard',
    description: 'Agent and sector performance metrics'
  },
  {
    path: '/analytics/calls',
    name: 'Call Analytics',
    icon: 'phone',
    component: 'CallAnalytics',
    description: 'Call quality and completion metrics'
  },
  {
    path: '/analytics/satisfaction',
    name: 'Satisfaction Metrics',
    icon: 'smile',
    component: 'SatisfactionMetrics',
    description: 'Customer satisfaction and NPS analysis'
  },
  {
    path: '/analytics/revenue',
    name: 'Revenue Analysis',
    icon: 'dollar',
    component: 'RevenueAnalysis',
    description: 'Financial metrics and ROI analysis'
  },
  {
    path: '/analytics/predictions',
    name: 'Predictions & Insights',
    icon: 'line-chart',
    component: 'PredictionsDashboard',
    description: 'Forecasts and anomaly detection'
  }
];

// API endpoints used across analytics pages
export const ANALYTICS_ENDPOINTS = {
  // Performance
  PERFORMANCE_METRICS: '/api/analytics/performance/metrics',
  PERFORMANCE_RANKINGS: '/api/analytics/performance/rankings',
  PERFORMANCE_SECTOR_COMPARISON: '/api/analytics/performance/sector-comparison',

  // Quality
  QUALITY_METRICS: '/api/analytics/quality/metrics',
  QUALITY_FCR: '/api/analytics/quality/fcr',
  QUALITY_ISSUES: '/api/analytics/quality/issues',

  // Satisfaction
  SATISFACTION_METRICS: '/api/analytics/satisfaction/metrics',
  SATISFACTION_SENTIMENT: '/api/analytics/satisfaction/sentiment',
  SATISFACTION_FEEDBACK: '/api/analytics/satisfaction/feedback',
  SATISFACTION_CATEGORIES: '/api/analytics/satisfaction/feedback-categories',

  // Revenue
  REVENUE_SUMMARY: '/api/analytics/revenue/summary',
  REVENUE_BY_SECTOR: '/api/analytics/revenue/by-sector',
  REVENUE_BY_AGENT: '/api/analytics/revenue/by-agent',
  COST_SUMMARY: '/api/analytics/cost/summary',
  ROI_SUMMARY: '/api/analytics/roi/summary',
  ROI_BY_SECTOR: '/api/analytics/roi/by-sector',

  // Predictions
  PREDICTIONS_CALL_VOLUME: '/api/analytics/predictions/call-volume',
  PREDICTIONS_STAFFING: '/api/analytics/predictions/staffing',
  PREDICTIONS_ANOMALIES: '/api/analytics/predictions/anomalies',
  PREDICTIONS_RECOMMENDATIONS: '/api/analytics/predictions/recommendations',
  PREDICTIONS_CHURN_RISK: '/api/analytics/predictions/churn-risk',

  // Reports
  REPORTS_GENERATE: '/api/analytics/reports/generate',
  REPORTS_PERFORMANCE: '/api/analytics/reports/performance',
  REPORTS_QUALITY: '/api/analytics/reports/quality',
  REPORTS_SATISFACTION: '/api/analytics/reports/satisfaction',
  REPORTS_FINANCIAL: '/api/analytics/reports/financial',
  REPORTS_EXPORT: '/api/analytics/reports/:id/export',
  REPORTS_SCHEDULE: '/api/analytics/reports/schedule',

  // Metrics
  METRICS_LIVE: '/api/metrics/live'
};

// Chart color scheme for consistency
export const CHART_COLORS = {
  PRIMARY: '#0088FE',
  SUCCESS: '#00C49F',
  WARNING: '#FFBB28',
  DANGER: '#FF8042',
  INFO: '#8884D8',
  LIGHT_BLUE: '#e6f4ff',
  LIGHT_GREEN: '#f6ffed',
  LIGHT_YELLOW: '#fff7e6',
  LIGHT_RED: '#fff1f0'
};

// Metrics configuration
export const METRICS_CONFIG = {
  HANDLE_TIME_WARNING: 300, // seconds
  HANDLE_TIME_CRITICAL: 600, // seconds
  FCR_TARGET: 0.85, // 85%
  ABANDONMENT_WARNING: 0.05, // 5%
  QUALITY_TARGET: 85, // score out of 100
  CSAT_TARGET: 4.5, // score out of 5
  NPS_TARGET: 50, // score out of 100
  ROI_TARGET: 200 // percent
};

// Date range options
export const DATE_RANGES = [
  { label: 'Today', value: '1d', days: 1 },
  { label: 'Last 7 Days', value: '7d', days: 7 },
  { label: 'Last 30 Days', value: '30d', days: 30 },
  { label: 'Last 90 Days', value: '90d', days: 90 },
  { label: 'Year to Date', value: 'ytd', days: 365 }
];

// Sector options
export const SECTORS = [
  { label: 'Sales', value: 'sales' },
  { label: 'Support', value: 'support' },
  { label: 'Billing', value: 'billing' },
  { label: 'Technical', value: 'technical' }
];

export default {
  ANALYTICS_PAGES,
  ANALYTICS_ENDPOINTS,
  CHART_COLORS,
  METRICS_CONFIG,
  DATE_RANGES,
  SECTORS
};
