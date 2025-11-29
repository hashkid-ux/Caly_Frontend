/**
 * Revenue Analysis Page
 * Phase 7: Advanced Analytics & Performance Optimization
 * 
 * Displays financial metrics including revenue, costs, and ROI analysis
 */

import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, Row, Col, Statistic, Table, Select, Button, Tag, Progress, Loading } from '@/components/Common';
import './Analytics.css';

const RevenueAnalysis = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [costType, setCostType] = useState(null);

  // Fetch revenue summary
  const { data: revenueData, isLoading } = useQuery(
    ['revenue', timeRange],
    async () => {
      const params = new URLSearchParams({
        days: timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 1
      });

      const response = await fetch(`/api/analytics/revenue/summary?${params}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      if (!response.ok) throw new Error('Failed to fetch revenue data');
      return response.json();
    },
    { refetchInterval: 60000 }
  );

  // Fetch cost analysis
  const { data: costData } = useQuery(
    ['costs', timeRange, costType],
    async () => {
      const params = new URLSearchParams({
        days: timeRange === '7d' ? 7 : 30,
        ...(costType && { type: costType })
      });

      const response = await fetch(`/api/analytics/cost/summary?${params}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      if (!response.ok) throw new Error('Failed to fetch cost data');
      return response.json();
    }
  );

  // Fetch ROI analysis
  const { data: roiData } = useQuery(
    ['roi', timeRange],
    async () => {
      const response = await fetch(`/api/analytics/roi/summary?days=${timeRange === '7d' ? 7 : 30}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      if (!response.ok) throw new Error('Failed to fetch ROI data');
      return response.json();
    }
  );

  // Fetch revenue by sector
  const { data: sectorRevenueData } = useQuery(
    ['revenue-by-sector', timeRange],
    async () => {
      const response = await fetch(`/api/analytics/revenue/by-sector?days=${timeRange === '7d' ? 7 : 30}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      if (!response.ok) throw new Error('Failed to fetch sector revenue');
      return response.json();
    }
  );

  if (isLoading) return <Loading message="Loading revenue analysis..." />;

  const metrics = revenueData?.data || {};
  const costs = costData?.data || {};
  const roi = roiData?.data || {};
  const sectorRevenue = sectorRevenueData?.data || [];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(value);
  };

  const getROIStatus = (roiPercent) => {
    if (roiPercent >= 200) return { color: '#00C49F', label: 'Excellent' };
    if (roiPercent >= 150) return { color: '#0088FE', label: 'Good' };
    if (roiPercent >= 100) return { color: '#FFBB28', label: 'Fair' };
    return { color: '#FF8042', label: 'Below Target' };
  };

  return (
    <div className="analytics-container">
      <div className="page-header">
        <h1>Revenue Analysis</h1>
        <p>Financial metrics including revenue, costs, and ROI</p>
      </div>

      {/* Controls */}
      <div className="controls-section">
        <Row gutter={16}>
          <Col span={8}>
            <Select
              placeholder="Time Range"
              value={timeRange}
              onChange={setTimeRange}
              options={[
                { label: 'Today', value: '1d' },
                { label: 'Last 7 Days', value: '7d' },
                { label: 'Last 30 Days', value: '30d' }
              ]}
            />
          </Col>
          <Col span={8}>
            <Select
              placeholder="Cost Type"
              value={costType}
              onChange={setCostType}
              options={[
                { label: 'All Costs', value: null },
                { label: 'Labor', value: 'labor' },
                { label: 'Technology', value: 'technology' },
                { label: 'Infrastructure', value: 'infrastructure' },
                { label: 'Training', value: 'training' }
              ]}
              allowClear
            />
          </Col>
          <Col span={8}>
            <Button type="primary" onClick={() => window.print()}>
              Export Financial Report
            </Button>
          </Col>
        </Row>
      </div>

      {/* Key Financial Metrics */}
      <Card title="Key Financial Metrics" className="metrics-card">
        <Row gutter={24}>
          <Col span={6}>
            <Statistic
              title="Total Revenue"
              value={metrics.totalRevenue || 0}
              prefix="$"
              valueStyle={{ color: '#00C49F', fontSize: '1.8rem' }}
              formatter={value => formatCurrency(value)}
            />
            <p className="metric-change" style={{ color: metrics.revenueChange > 0 ? '#00C49F' : '#FF8042' }}>
              {metrics.revenueChange > 0 ? '↑' : '↓'} {Math.abs(metrics.revenueChange).toFixed(1)}% vs last period
            </p>
          </Col>
          <Col span={6}>
            <Statistic
              title="Total Costs"
              value={metrics.totalCosts || 0}
              prefix="$"
              valueStyle={{ color: '#FF8042', fontSize: '1.8rem' }}
              formatter={value => formatCurrency(value)}
            />
            <Progress percent={Math.min((metrics.totalCosts / metrics.totalRevenue * 100), 100)} />
          </Col>
          <Col span={6}>
            <Statistic
              title="Gross Profit"
              value={(metrics.totalRevenue - metrics.totalCosts) || 0}
              prefix="$"
              valueStyle={{ color: '#0088FE', fontSize: '1.8rem' }}
              formatter={value => formatCurrency(value)}
            />
            <p className="metric-label">Profit Margin: {metrics.profitMargin?.toFixed(1) || 0}%</p>
          </Col>
          <Col span={6}>
            <div style={{ borderLeft: '4px solid #FFBB28', paddingLeft: 15 }}>
              <h4>Revenue per Call</h4>
              <Statistic
                value={metrics.revenuePerCall || 0}
                prefix="$"
                valueStyle={{ color: '#FFBB28', fontSize: '1.8rem' }}
                precision={2}
              />
              <p>{metrics.totalCalls || 0} calls processed</p>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Revenue vs Cost Trends */}
      <Row gutter={16} className="chart-row">
        <Col span={12}>
          <Card title="Revenue vs Cost Trends">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={metrics.trends || []}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00C49F" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#00C49F" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF8042" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#FF8042" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="revenue" stroke="#00C49F" fillOpacity={1} fill="url(#colorRevenue)" name="Revenue" />
                <Area type="monotone" dataKey="cost" stroke="#FF8042" fillOpacity={1} fill="url(#colorCost)" name="Cost" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col span={12}>
          <Card title="Profit Margin Trend">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={metrics.profitTrends || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="margin" stroke="#0088FE" name="Profit Margin %" strokeWidth={2} />
                <Line type="monotone" dataKey="target" stroke="#00C49F" strokeDasharray="5 5" name="Target" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* ROI Analysis */}
      <Card title="ROI Analysis" className="roi-card">
        <Row gutter={24}>
          <Col span={8}>
            <div className="roi-box">
              <h4>Current ROI</h4>
              <Statistic
                value={roi.currentROI || 0}
                suffix="%"
                valueStyle={{ color: getROIStatus(roi.currentROI).color, fontSize: '2.5rem' }}
              />
              <Tag color={getROIStatus(roi.currentROI).color === '#00C49F' ? 'green' : 'orange'}>
                {getROIStatus(roi.currentROI).label}
              </Tag>
            </div>
          </Col>
          <Col span={8}>
            <div className="roi-box">
              <h4>Target ROI</h4>
              <Statistic
                value={roi.targetROI || 0}
                suffix="%"
                valueStyle={{ color: '#8884D8', fontSize: '2.5rem' }}
              />
              <p>Expected Return on Investment</p>
            </div>
          </Col>
          <Col span={8}>
            <div className="roi-box">
              <h4>ROI Gap</h4>
              <Statistic
                value={Math.abs((roi.currentROI - roi.targetROI) || 0)}
                suffix="%"
                valueStyle={{ color: (roi.currentROI - roi.targetROI) > 0 ? '#00C49F' : '#FF8042', fontSize: '2.5rem' }}
              />
              <p>{(roi.currentROI - roi.targetROI) > 0 ? 'Above' : 'Below'} Target</p>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Revenue by Sector */}
      <Row gutter={16} className="chart-row">
        <Col span={12}>
          <Card title="Revenue by Sector">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={sectorRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="sector" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#0088FE" name="Revenue" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col span={12}>
          <Card title="Sector Revenue Distribution">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={sectorRevenue}
                  dataKey="revenue"
                  nameKey="sector"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {COLORS.map((color, index) => (
                    <Cell key={`cell-${index}`} fill={color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Cost Breakdown */}
      <Card title="Cost Analysis">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={costs.breakdown || []}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="costType" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="amount" fill="#FF8042" name="Cost Amount" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Cost Distribution Pie Chart */}
      <Card title="Cost Distribution by Type">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={costs.distribution || []}
              dataKey="amount"
              nameKey="type"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {COLORS.map((color, index) => (
                <Cell key={`cell-${index}`} fill={color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </Card>

      {/* Financial Summary Table */}
      <Card title="Financial Summary Details">
        <Table
          columns={[
            { title: 'Metric', dataIndex: 'metric', key: 'metric', width: 200 },
            { title: 'Value', dataIndex: 'value', key: 'value', render: v => formatCurrency(v) },
            { title: '% of Revenue', dataIndex: 'percentage', key: 'percentage', render: v => `${v.toFixed(1)}%` },
            { title: 'Trend', dataIndex: 'trend', key: 'trend', render: t => (
              <Tag color={t > 0 ? 'green' : 'red'}>
                {t > 0 ? '↑' : '↓'} {Math.abs(t).toFixed(1)}%
              </Tag>
            )}
          ]}
          dataSource={[
            { key: '1', metric: 'Total Revenue', value: metrics.totalRevenue, percentage: 100, trend: metrics.revenueChange },
            { key: '2', metric: 'Total Costs', value: metrics.totalCosts, percentage: (metrics.totalCosts / metrics.totalRevenue * 100), trend: metrics.costChange },
            { key: '3', metric: 'Gross Profit', value: (metrics.totalRevenue - metrics.totalCosts), percentage: metrics.profitMargin, trend: metrics.profitChange }
          ]}
          pagination={false}
        />
      </Card>
    </div>
  );
};

export default RevenueAnalysis;
