import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import KPICard from '../UI/KPICard';
import FilterBar from '../UI/FilterBar';
import PageHeader from '../PageHeader';
import { useAuth } from '../../context/AuthContext';

/**
 * Redesigned Analytics Dashboard
 * - Professional KPI cards with trends
 * - 6 interactive charts
 * - Sector-specific metrics
 * - Export functionality
 * - Real-time updates
 */
const AnalyticsPageNew = () => {
  const { user } = useAuth();
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sector, setSector] = useState('all');
  const [dateRange, setDateRange] = useState('month');
  const [error, setError] = useState(null);

  // Sample data for demo (replace with actual API calls)
  const mockAnalyticsData = {
    kpis: {
      callsToday: { value: 287, trend: 23, unit: '', icon: 'Phone' },
      avgDuration: { value: '4m 32s', trend: -5, unit: '', icon: 'Clock' },
      completionRate: { value: '98.5%', trend: 1.2, unit: '', icon: 'CheckCircle' },
      errorRate: { value: '1.5%', trend: -0.3, unit: '', icon: 'AlertCircle' }
    },
    callVolume: [
      { date: 'Nov 23', calls: 234, target: 250 },
      { date: 'Nov 24', calls: 267, target: 250 },
      { date: 'Nov 25', calls: 234, target: 250 },
      { date: 'Nov 26', calls: 289, target: 250 },
      { date: 'Nov 27', calls: 243, target: 250 },
      { date: 'Nov 28', calls: 276, target: 250 },
      { date: 'Nov 29', calls: 287, target: 250 }
    ],
    agentPerformance: [
      { name: 'Dr. Sarah Kumar', successRate: 99.4, calls: 87 },
      { name: 'Nurse Lisa Patel', successRate: 97.1, calls: 64 },
      { name: 'Rajesh Sharma', successRate: 96.8, calls: 143 },
      { name: 'James Wilson', successRate: 95.2, calls: 34 },
      { name: 'Maria Garcia', successRate: 94.1, calls: 56 }
    ],
    sectorBreakdown: [
      { name: 'E-Commerce', value: 2840, color: '#FFA500' },
      { name: 'Healthcare', value: 1234, color: '#EF4444' },
      { name: 'Support', value: 890, color: '#1E40AF' },
      { name: 'Logistics', value: 756, color: '#4B5563' },
      { name: 'Real Estate', value: 543, color: '#8B4513' },
      { name: 'Others', value: 437, color: '#6B7280' }
    ],
    callOutcomes: [
      { name: 'Successful', value: 2847, color: '#10B981' },
      { name: 'Escalated', value: 143, color: '#F59E0B' },
      { name: 'Failed', value: 27, color: '#EF4444' }
    ],
    sectorMetrics: {
      ecommerce: { conversion: 2.4, orders: 143, aov: '₹2,450', returns: 3.2 },
      healthcare: { appointments: 87, noshow: 3, rating: 4.8, wait: '2.3m' },
      logistics: { delivery: 98.7, avgTime: '24.5h', exceptions: 1.2, satisfaction: 4.6 },
      fintech: { success: 99.2, fraud: 0.8, processing: '2.1s', trust: 4.9 }
    },
    alerts: [
      { type: 'error', message: 'High error rate on Healthcare sector (12%)', icon: 'AlertCircle' },
      { type: 'warning', message: 'Support team has high wait times (avg 4.2min)', icon: 'Clock' },
      { type: 'success', message: 'Fintech sector performing well! (99.2% success)', icon: 'CheckCircle' }
    ]
  };

  useEffect(() => {
    // Fetch analytics data from API
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        // Replace with actual API call
        // const response = await fetch(`${API_BASE_URL}/api/analytics/dashboard`, {...});
        // const data = await response.json();
        // setAnalyticsData(data);
        setAnalyticsData(mockAnalyticsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [sector, dateRange]);

  const handleExport = () => {
    // Export to CSV
    const csv = 'Metric,Value,Trend\n';
    // ... implement CSV generation
    console.log('Exporting analytics...');
  };

  if (!user) return <div className="p-8 text-center">Please log in to view analytics</div>;

  return (
    <div className="bg-gray-50 min-h-screen">
      <PageHeader title="📊 Analytics Dashboard" description="Track your call metrics and performance" />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters */}
        <FilterBar
          onSectorChange={setSector}
          onDateRangeChange={setDateRange}
          onExport={handleExport}
          showSectorFilter={true}
          showDatePicker={true}
          showExportButton={true}
        />

        {/* KPI Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <KPICard
            title="Calls Today"
            value={analyticsData?.kpis.callsToday.value || 0}
            trend={analyticsData?.kpis.callsToday.trend || 0}
            trendLabel="vs yesterday"
            status="success"
            color="blue"
            loading={loading}
          />
          <KPICard
            title="Avg Duration"
            value={analyticsData?.kpis.avgDuration.value || '0s'}
            trend={analyticsData?.kpis.avgDuration.trend || 0}
            trendLabel="improvement"
            status="success"
            color="green"
            loading={loading}
          />
          <KPICard
            title="Completion Rate"
            value={analyticsData?.kpis.completionRate.value || '0%'}
            trend={analyticsData?.kpis.completionRate.trend || 0}
            trendLabel="increase"
            status="success"
            color="purple"
            loading={loading}
          />
          <KPICard
            title="Error Rate"
            value={analyticsData?.kpis.errorRate.value || '0%'}
            trend={analyticsData?.kpis.errorRate.trend || 0}
            trendLabel="decrease"
            status={analyticsData?.kpis.errorRate.value > 2 ? 'danger' : 'warning'}
            color="red"
            loading={loading}
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Call Volume Trend */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">📈 Call Volume Trend (30 days)</h3>
            {analyticsData?.callVolume && (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={analyticsData.callVolume}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="calls" stroke="#3B82F6" strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="target" stroke="#10B981" strokeDasharray="5 5" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Agent Performance */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">👥 Top Agent Performance</h3>
            {analyticsData?.agentPerformance && (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={analyticsData.agentPerformance} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis width={120} dataKey="name" type="category" tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="successRate" fill="#10B981" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Sector Breakdown */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">🏢 Calls by Sector</h3>
            {analyticsData?.sectorBreakdown && (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={analyticsData.sectorBreakdown}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {analyticsData.sectorBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Call Outcomes */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">📊 Call Outcomes</h3>
            {analyticsData?.callOutcomes && (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={analyticsData.callOutcomes}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {analyticsData.callOutcomes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Sector-Specific Metrics */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 mb-8">
          <h3 className="text-lg font-semibold mb-6 text-gray-800">🎯 Sector-Specific Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* E-Commerce */}
            <div className="border border-orange-200 rounded-lg p-4 bg-orange-50">
              <h4 className="font-semibold text-orange-900 mb-3">🛒 E-Commerce</h4>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Conversion:</span> {analyticsData?.sectorMetrics.ecommerce.conversion}%</p>
                <p><span className="font-medium">Orders:</span> {analyticsData?.sectorMetrics.ecommerce.orders}</p>
                <p><span className="font-medium">AOV:</span> {analyticsData?.sectorMetrics.ecommerce.aov}</p>
                <p><span className="font-medium">Returns:</span> {analyticsData?.sectorMetrics.ecommerce.returns}%</p>
              </div>
            </div>

            {/* Healthcare */}
            <div className="border border-red-200 rounded-lg p-4 bg-red-50">
              <h4 className="font-semibold text-red-900 mb-3">🏥 Healthcare</h4>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Appointments:</span> {analyticsData?.sectorMetrics.healthcare.appointments}</p>
                <p><span className="font-medium">No-show:</span> {analyticsData?.sectorMetrics.healthcare.noshow}%</p>
                <p><span className="font-medium">Rating:</span> {analyticsData?.sectorMetrics.healthcare.rating}★</p>
                <p><span className="font-medium">Avg Wait:</span> {analyticsData?.sectorMetrics.healthcare.wait}</p>
              </div>
            </div>

            {/* Logistics */}
            <div className="border border-gray-400 rounded-lg p-4 bg-gray-50">
              <h4 className="font-semibold text-gray-900 mb-3">🚚 Logistics</h4>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Delivery:</span> {analyticsData?.sectorMetrics.logistics.delivery}%</p>
                <p><span className="font-medium">Avg Time:</span> {analyticsData?.sectorMetrics.logistics.avgTime}</p>
                <p><span className="font-medium">Exceptions:</span> {analyticsData?.sectorMetrics.logistics.exceptions}%</p>
                <p><span className="font-medium">Satisfaction:</span> {analyticsData?.sectorMetrics.logistics.satisfaction}★</p>
              </div>
            </div>

            {/* Fintech */}
            <div className="border border-purple-200 rounded-lg p-4 bg-purple-50">
              <h4 className="font-semibold text-purple-900 mb-3">💰 Fintech</h4>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Success:</span> {analyticsData?.sectorMetrics.fintech.success}%</p>
                <p><span className="font-medium">Fraud:</span> {analyticsData?.sectorMetrics.fintech.fraud}%</p>
                <p><span className="font-medium">Processing:</span> {analyticsData?.sectorMetrics.fintech.processing}</p>
                <p><span className="font-medium">Trust Score:</span> {analyticsData?.sectorMetrics.fintech.trust}★</p>
              </div>
            </div>
          </div>
        </div>

        {/* Alerts & Anomalies */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold mb-6 text-gray-800">🔔 Alerts & Anomalies</h3>
          <div className="space-y-3">
            {analyticsData?.alerts.map((alert, idx) => (
              <div
                key={idx}
                className={`
                  flex items-start p-4 rounded-lg border-l-4
                  ${alert.type === 'error' ? 'bg-red-50 border-l-red-500 text-red-800' : ''}
                  ${alert.type === 'warning' ? 'bg-yellow-50 border-l-yellow-500 text-yellow-800' : ''}
                  ${alert.type === 'success' ? 'bg-green-50 border-l-green-500 text-green-800' : ''}
                `}
              >
                <div className="mr-3 mt-1">
                  {alert.type === 'error' && <AlertCircle size={20} />}
                  {alert.type === 'warning' && <Clock size={20} />}
                  {alert.type === 'success' && <CheckCircle size={20} />}
                </div>
                <div>
                  <p className="font-medium">{alert.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPageNew;
