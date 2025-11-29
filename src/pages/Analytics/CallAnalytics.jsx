/**
 * Call Analytics Page
 * Phase 7: Advanced Analytics & Performance Optimization
 * 
 * Displays detailed call quality metrics and analysis
 */

import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter } from 'recharts';
import { Card, Row, Col, Statistic, Table, Select, Button, Tag, Progress, Loading } from '@/components/Common';
import './Analytics.css';

const CallAnalytics = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [qualityThreshold, setQualityThreshold] = useState(80);
  const [selectedIssueType, setSelectedIssueType] = useState(null);

  // Fetch quality metrics
  const { data: qualityData, isLoading } = useQuery(
    ['call-quality', timeRange],
    async () => {
      const params = new URLSearchParams({
        days: timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 1
      });

      const response = await fetch(`/api/analytics/quality/metrics?${params}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      if (!response.ok) throw new Error('Failed to fetch quality data');
      return response.json();
    },
    { refetchInterval: 60000 }
  );

  // Fetch FCR analysis
  const { data: fcrData } = useQuery(
    ['fcr-analysis', timeRange],
    async () => {
      const response = await fetch(`/api/analytics/quality/fcr?days=${timeRange === '7d' ? 7 : 30}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      if (!response.ok) throw new Error('Failed to fetch FCR data');
      return response.json();
    }
  );

  // Fetch quality issues
  const { data: issuesData } = useQuery(
    ['quality-issues', timeRange, selectedIssueType],
    async () => {
      const params = new URLSearchParams({
        days: timeRange === '7d' ? 7 : 30,
        ...(selectedIssueType && { type: selectedIssueType })
      });

      const response = await fetch(`/api/analytics/quality/issues?${params}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      if (!response.ok) throw new Error('Failed to fetch issues');
      return response.json();
    }
  );

  if (isLoading) return <Loading message="Loading call analytics..." />;

  const metrics = qualityData?.data || {};
  const fcr = fcrData?.data || {};
  const issues = issuesData?.data || [];

  const getScoreTrend = (score) => {
    if (score >= 90) return { color: '#00C49F', text: 'Excellent' };
    if (score >= 80) return { color: '#0088FE', text: 'Good' };
    if (score >= 70) return { color: '#FFBB28', text: 'Fair' };
    return { color: '#FF8042', text: 'Poor' };
  };

  return (
    <div className="analytics-container">
      <div className="page-header">
        <h1>Call Analytics</h1>
        <p>Detailed call quality metrics and analysis</p>
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
              placeholder="Issue Type"
              value={selectedIssueType}
              onChange={setSelectedIssueType}
              options={[
                { label: 'All Issues', value: null },
                { label: 'Compliance', value: 'compliance' },
                { label: 'Tone', value: 'tone' },
                { label: 'Procedure', value: 'procedure' },
                { label: 'Documentation', value: 'documentation' }
              ]}
              allowClear
            />
          </Col>
          <Col span={8}>
            <Button type="primary" onClick={() => window.print()}>
              Export Analysis
            </Button>
          </Col>
        </Row>
      </div>

      {/* Quality Metrics Summary */}
      <Card title="Quality Metrics Summary" className="metrics-card">
        <Row gutter={24}>
          <Col span={6}>
            <Statistic
              title="Average Quality Score"
              value={metrics.avgScore?.toFixed(1) || 0}
              suffix="/100"
              valueStyle={{ color: getScoreTrend(metrics.avgScore).color }}
            />
            <Progress percent={metrics.avgScore || 0} status={metrics.avgScore >= 80 ? 'success' : 'exception'} />
          </Col>
          <Col span={6}>
            <Statistic
              title="Calls Audited"
              value={metrics.totalAudited || 0}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="First Call Resolution"
              value={metrics.fcr?.toFixed(1) || 0}
              suffix="%"
              valueStyle={{ color: '#00C49F' }}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="Repeat Rate"
              value={metrics.repeatRate?.toFixed(1) || 0}
              suffix="%"
              valueStyle={{ color: '#FF8042' }}
            />
          </Col>
        </Row>
      </Card>

      {/* Quality Trends & Distribution */}
      <Row gutter={16} className="chart-row">
        <Col span={12}>
          <Card title="Quality Score Trends">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={metrics.scoreTrends || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="score" stroke="#0088FE" name="Quality Score" />
                <Line type="monotone" dataKey="target" stroke="#00C49F" strokeDasharray="5 5" name="Target (80)" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col span={12}>
          <Card title="FCR vs Repeat Rate">
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" dataKey="fcr" name="FCR %" />
                <YAxis type="number" dataKey="repeatRate" name="Repeat Rate %" />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Scatter name="Agents" data={fcr.agents || []} fill="#0088FE" />
              </ScatterChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Issue Categories */}
      <Card title="Quality Issues Analysis" className="issues-card">
        <Row gutter={16} className="chart-row">
          <Col span={12}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={metrics.issuesByCategory || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#FF8042" name="Issue Count" />
              </BarChart>
            </ResponsiveContainer>
          </Col>

          <Col span={12}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={metrics.issueBySeverity || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="severity" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="critical" fill="#FF8042" name="Critical" />
                <Bar dataKey="major" fill="#FFBB28" name="Major" />
                <Bar dataKey="minor" fill="#0088FE" name="Minor" />
              </BarChart>
            </ResponsiveContainer>
          </Col>
        </Row>
      </Card>

      {/* Detailed Issues Table */}
      <Card title="Recent Quality Issues" className="issues-table">
        <Table
          columns={[
            { title: 'Date', dataIndex: 'date', key: 'date', width: 120 },
            { title: 'Agent', dataIndex: 'agentName', key: 'agent' },
            { title: 'Call Duration', dataIndex: 'duration', key: 'duration', render: v => `${(v/60).toFixed(1)}m` },
            { title: 'Issue Type', dataIndex: 'issueType', key: 'type' },
            { title: 'Severity', dataIndex: 'severity', key: 'severity', render: v => (
              <Tag color={v === 'critical' ? 'red' : v === 'major' ? 'orange' : 'blue'}>{v}</Tag>
            )},
            { title: 'Score Impact', dataIndex: 'scoreImpact', key: 'impact', render: v => `${v} pts` },
            { title: 'Status', dataIndex: 'status', key: 'status', render: v => (
              <Tag color={v === 'resolved' ? 'green' : v === 'in-progress' ? 'blue' : 'red'}>{v}</Tag>
            )}
          ]}
          dataSource={issues.map((issue, idx) => ({
            ...issue,
            key: issue.id || idx
          }))}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      {/* Call Timeline */}
      <Card title="Call Timeline Analysis">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={metrics.callTimeline || []}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hour" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="callCount" stroke="#0088FE" name="Call Count" />
            <Line yAxisId="right" type="monotone" dataKey="avgScore" stroke="#00C49F" name="Avg Quality Score" />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};

export default CallAnalytics;
