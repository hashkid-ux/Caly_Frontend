/**
 * Performance Dashboard Page
 * Phase 7: Advanced Analytics & Performance Optimization
 * 
 * Displays agent and sector performance metrics with real-time updates
 */

import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Card, Row, Col, Statistic, Table, Select, DatePicker, Button, Loading, Empty } from '@/components/Common';
import './Analytics.css';

const PerformanceDashboard = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [selectedSector, setSelectedSector] = useState(null);

  // Fetch performance metrics
  const { data: performanceData, isLoading: perfLoading, error: perfError } = useQuery(
    ['performance', timeRange, selectedAgent, selectedSector],
    async () => {
      const params = new URLSearchParams({
        days: timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 1,
        ...(selectedAgent && { agentId: selectedAgent }),
        ...(selectedSector && { sector: selectedSector })
      });

      const response = await fetch(`/api/analytics/performance/metrics?${params}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      if (!response.ok) throw new Error('Failed to fetch performance data');
      return response.json();
    },
    { refetchInterval: 30000 } // Refresh every 30 seconds
  );

  // Fetch agent rankings
  const { data: rankings } = useQuery(
    ['agent-rankings', timeRange],
    async () => {
      const params = new URLSearchParams({
        days: timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 1,
        limit: 10
      });

      const response = await fetch(`/api/analytics/performance/rankings?${params}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      if (!response.ok) throw new Error('Failed to fetch rankings');
      return response.json();
    }
  );

  // Fetch sector comparison
  const { data: sectorData } = useQuery(
    ['sector-comparison', timeRange],
    async () => {
      const params = new URLSearchParams({
        days: timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 1
      });

      const response = await fetch(`/api/analytics/performance/sector-comparison?${params}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      if (!response.ok) throw new Error('Failed to fetch sector data');
      return response.json();
    }
  );

  if (perfLoading) return <Loading message="Loading performance data..." />;

  const metrics = performanceData?.data || {};
  const agents = rankings?.data || [];
  const sectors = sectorData?.data || [];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="analytics-container">
      <div className="page-header">
        <h1>Performance Dashboard</h1>
        <p>Real-time agent and sector performance metrics</p>
      </div>

      {/* Controls */}
      <div className="controls-section">
        <Row gutter={16}>
          <Col span={6}>
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
          <Col span={6}>
            <Select
              placeholder="Select Agent"
              value={selectedAgent}
              onChange={setSelectedAgent}
              options={agents.map(a => ({ label: a.name, value: a.id }))}
              allowClear
            />
          </Col>
          <Col span={6}>
            <Select
              placeholder="Select Sector"
              value={selectedSector}
              onChange={setSelectedSector}
              options={[
                { label: 'Sales', value: 'sales' },
                { label: 'Support', value: 'support' },
                { label: 'Billing', value: 'billing' },
                { label: 'Technical', value: 'technical' }
              ]}
              allowClear
            />
          </Col>
          <Col span={6}>
            <Button type="primary" onClick={() => window.print()}>
              Export Report
            </Button>
          </Col>
        </Row>
      </div>

      {/* Key Metrics */}
      <Card title="Key Performance Indicators" className="metrics-card">
        <Row gutter={24}>
          <Col span={6}>
            <Statistic
              title="Average Handle Time"
              value={metrics.avgHandleTime?.toFixed(0) || 0}
              suffix="sec"
              valueStyle={{ color: '#0088FE' }}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="First Call Resolution"
              value={metrics.firstCallResolution?.toFixed(1) || 0}
              suffix="%"
              valueStyle={{ color: '#00C49F' }}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="Abandonment Rate"
              value={metrics.abandonmentRate?.toFixed(2) || 0}
              suffix="%"
              valueStyle={{ color: '#FFBB28' }}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="Customer Satisfaction"
              value={metrics.customerSatisfaction?.toFixed(1) || 0}
              suffix="/10"
              valueStyle={{ color: '#8884D8' }}
            />
          </Col>
        </Row>
      </Card>

      {/* Performance Trends */}
      <Row gutter={16} className="chart-row">
        <Col span={12}>
          <Card title="Performance Trends">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={metrics.trends || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="avgHandleTime" stroke="#0088FE" name="Handle Time" />
                <Line type="monotone" dataKey="fcr" stroke="#00C49F" name="FCR %" />
                <Line type="monotone" dataKey="satisfaction" stroke="#8884D8" name="Satisfaction" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col span={12}>
          <Card title="Sector Performance Comparison">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={sectors}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="sector" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="avgScore" fill="#0088FE" name="Avg Score" />
                <Bar dataKey="fcr" fill="#00C49F" name="FCR %" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Agent Rankings */}
      <Card title="Top Performing Agents" className="rankings-card">
        <Table
          columns={[
            { title: 'Rank', dataIndex: 'rank', key: 'rank', width: 80 },
            { title: 'Agent Name', dataIndex: 'name', key: 'name' },
            { title: 'Calls', dataIndex: 'callCount', key: 'calls' },
            { title: 'Avg Handle Time', dataIndex: 'avgHandleTime', key: 'aht', render: v => `${v.toFixed(0)}s` },
            { title: 'FCR %', dataIndex: 'fcr', key: 'fcr', render: v => `${v.toFixed(1)}%` },
            { title: 'Satisfaction', dataIndex: 'satisfaction', key: 'sat', render: v => `${v.toFixed(1)}/10` },
            { title: 'Score', dataIndex: 'score', key: 'score', render: v => `${v.toFixed(1)}/100` }
          ]}
          dataSource={agents.slice(0, 10).map((agent, idx) => ({
            ...agent,
            key: agent.id,
            rank: idx + 1
          }))}
          pagination={false}
          rowClassName={record => record.rank <= 3 ? 'top-performer' : ''}
        />
      </Card>

      {/* Distribution Charts */}
      <Row gutter={16} className="chart-row">
        <Col span={8}>
          <Card title="Handle Time Distribution">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={metrics.handleTimeDistribution || []}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
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

        <Col span={8}>
          <Card title="FCR by Sector">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={sectors.map(s => ({ name: s.sector, value: s.fcr }))}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
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

        <Col span={8}>
          <Card title="Call Volume Trend">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={metrics.callVolumeTrend || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="volume" fill="#8884D8" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default PerformanceDashboard;
