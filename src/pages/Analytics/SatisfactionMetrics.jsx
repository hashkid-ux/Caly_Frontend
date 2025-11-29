/**
 * Satisfaction Metrics Page
 * Phase 7: Advanced Analytics & Performance Optimization
 * 
 * Displays customer satisfaction, NPS, and sentiment analysis
 */

import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, Row, Col, Statistic, Table, Select, Button, Tag, Progress, Rate, Loading, Empty } from '@/components/Common';
import './Analytics.css';

const SatisfactionMetrics = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [sentiment, setSentiment] = useState(null);

  // Fetch satisfaction metrics
  const { data: satisfactionData, isLoading } = useQuery(
    ['satisfaction', timeRange],
    async () => {
      const params = new URLSearchParams({
        days: timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 1
      });

      const response = await fetch(`/api/analytics/satisfaction/metrics?${params}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      if (!response.ok) throw new Error('Failed to fetch satisfaction data');
      return response.json();
    },
    { refetchInterval: 60000 }
  );

  // Fetch sentiment analysis
  const { data: sentimentData } = useQuery(
    ['sentiment', timeRange],
    async () => {
      const response = await fetch(`/api/analytics/satisfaction/sentiment?days=${timeRange === '7d' ? 7 : 30}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      if (!response.ok) throw new Error('Failed to fetch sentiment');
      return response.json();
    }
  );

  // Fetch customer feedback
  const { data: feedbackData } = useQuery(
    ['feedback', timeRange, sentiment],
    async () => {
      const params = new URLSearchParams({
        days: timeRange === '7d' ? 7 : 30,
        ...(sentiment && { sentiment })
      });

      const response = await fetch(`/api/analytics/satisfaction/feedback?${params}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      if (!response.ok) throw new Error('Failed to fetch feedback');
      return response.json();
    }
  );

  // Fetch feedback categories
  const { data: categoriesData } = useQuery(
    ['feedback-categories', timeRange],
    async () => {
      const response = await fetch(`/api/analytics/satisfaction/feedback-categories?days=${timeRange === '7d' ? 7 : 30}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      if (!response.ok) throw new Error('Failed to fetch categories');
      return response.json();
    }
  );

  if (isLoading) return <Loading message="Loading satisfaction metrics..." />;

  const metrics = satisfactionData?.data || {};
  const sentiment_data = sentimentData?.data || {};
  const feedback = feedbackData?.data || [];
  const categories = categoriesData?.data || [];

  const COLORS = ['#00C49F', '#FFBB28', '#FF8042', '#0088FE', '#8884D8'];

  const getNPSColor = (nps) => {
    if (nps >= 50) return '#00C49F';
    if (nps >= 0) return '#FFBB28';
    return '#FF8042';
  };

  const getSentimentColor = (score) => {
    if (score > 0.3) return '#00C49F';
    if (score > -0.3) return '#FFBB28';
    return '#FF8042';
  };

  return (
    <div className="analytics-container">
      <div className="page-header">
        <h1>Satisfaction Metrics</h1>
        <p>Customer satisfaction, NPS, and sentiment analysis</p>
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
              placeholder="Sentiment Filter"
              value={sentiment}
              onChange={setSentiment}
              options={[
                { label: 'All Sentiment', value: null },
                { label: 'Positive', value: 'positive' },
                { label: 'Neutral', value: 'neutral' },
                { label: 'Negative', value: 'negative' }
              ]}
              allowClear
            />
          </Col>
          <Col span={8}>
            <Button type="primary" onClick={() => window.print()}>
              Export Report
            </Button>
          </Col>
        </Row>
      </div>

      {/* Key Metrics */}
      <Card title="Key Satisfaction Metrics" className="metrics-card">
        <Row gutter={24}>
          <Col span={6}>
            <div className="metric-box">
              <Statistic
                title="CSAT Score"
                value={metrics.csat?.toFixed(1) || 0}
                suffix="/5"
                valueStyle={{ color: '#0088FE', fontSize: '2rem' }}
              />
              <Rate allowHalf value={metrics.csat || 0} disabled size="small" />
              <Progress percent={(metrics.csat / 5) * 100} />
            </div>
          </Col>
          <Col span={6}>
            <div className="metric-box">
              <Statistic
                title="NPS Score"
                value={metrics.nps || 0}
                suffix="/100"
                valueStyle={{ color: getNPSColor(metrics.nps), fontSize: '2rem' }}
              />
              <p className="nps-category">
                {metrics.nps >= 50 ? '🌟 Excellent' : metrics.nps >= 0 ? '✓ Good' : '⚠️ At Risk'}
              </p>
            </div>
          </Col>
          <Col span={6}>
            <div className="metric-box">
              <Statistic
                title="Total Surveys"
                value={metrics.totalSurveys || 0}
              />
              <p className="response-rate">Response Rate: {metrics.responseRate?.toFixed(1) || 0}%</p>
              <Progress percent={metrics.responseRate || 0} />
            </div>
          </Col>
          <Col span={6}>
            <div className="metric-box">
              <Statistic
                title="Sentiment Score"
                value={sentiment_data.overallScore?.toFixed(2) || 0}
                suffix="/1"
                valueStyle={{ color: getSentimentColor(sentiment_data.overallScore), fontSize: '2rem' }}
              />
              <p className="sentiment-label">
                {sentiment_data.overallScore > 0.3 ? '😊 Positive' : sentiment_data.overallScore > -0.3 ? '😐 Neutral' : '😞 Negative'}
              </p>
            </div>
          </Col>
        </Row>
      </Card>

      {/* NPS and CSAT Trends */}
      <Row gutter={16} className="chart-row">
        <Col span={12}>
          <Card title="CSAT & NPS Trends">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={metrics.trends || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" domain={[0, 5]} />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="csat" stroke="#0088FE" name="CSAT" />
                <Line yAxisId="right" type="monotone" dataKey="nps" stroke="#00C49F" name="NPS" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col span={12}>
          <Card title="Sentiment Distribution">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={sentiment_data.distribution || []}
                  dataKey="count"
                  nameKey="sentiment"
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

      {/* Rating Distribution */}
      <Card title="CSAT Rating Distribution">
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={metrics.ratingDistribution || []}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="rating" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#0088FE" name="Count" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Feedback by Category */}
      <Card title="Feedback Analysis by Category">
        <Row gutter={16} className="chart-row">
          <Col span={12}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categories}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="positive" fill="#00C49F" name="Positive" />
                <Bar dataKey="neutral" fill="#FFBB28" name="Neutral" />
                <Bar dataKey="negative" fill="#FF8042" name="Negative" />
              </BarChart>
            </ResponsiveContainer>
          </Col>

          <Col span={12}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categories}
                  dataKey="total"
                  nameKey="category"
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
          </Col>
        </Row>
      </Card>

      {/* Recent Feedback */}
      <Card title="Recent Customer Feedback">
        {feedback.length === 0 ? (
          <Empty description="No feedback available" />
        ) : (
          <Table
            columns={[
              { title: 'Date', dataIndex: 'date', key: 'date', width: 120 },
              { title: 'Rating', dataIndex: 'rating', key: 'rating', render: r => <Rate allowHalf value={r} disabled size="small" /> },
              { title: 'Sentiment', dataIndex: 'sentiment', key: 'sentiment', render: s => (
                <Tag color={s === 'positive' ? 'green' : s === 'neutral' ? 'blue' : 'red'}>
                  {s === 'positive' ? '😊' : s === 'neutral' ? '😐' : '😞'} {s}
                </Tag>
              )},
              { title: 'Feedback', dataIndex: 'text', key: 'text', ellipsis: true },
              { title: 'Category', dataIndex: 'category', key: 'category' },
              { title: 'Agent', dataIndex: 'agentName', key: 'agent' }
            ]}
            dataSource={feedback.map((item, idx) => ({
              ...item,
              key: item.id || idx
            }))}
            pagination={{ pageSize: 10 }}
            scroll={{ x: 1200 }}
          />
        )}
      </Card>

      {/* NPS Breakdown */}
      <Card title="NPS Breakdown (Detractors, Passives, Promoters)">
        <Row gutter={16}>
          <Col span={8}>
            <div className="nps-box" style={{ borderLeft: '4px solid #FF8042' }}>
              <h4>Detractors (0-6)</h4>
              <Statistic
                value={metrics.detractorsPercent?.toFixed(1) || 0}
                suffix="%"
                valueStyle={{ color: '#FF8042', fontSize: '2rem' }}
              />
              <p>{metrics.detractorsCount || 0} customers</p>
            </div>
          </Col>
          <Col span={8}>
            <div className="nps-box" style={{ borderLeft: '4px solid #FFBB28' }}>
              <h4>Passives (7-8)</h4>
              <Statistic
                value={metrics.passivesPercent?.toFixed(1) || 0}
                suffix="%"
                valueStyle={{ color: '#FFBB28', fontSize: '2rem' }}
              />
              <p>{metrics.passivesCount || 0} customers</p>
            </div>
          </Col>
          <Col span={8}>
            <div className="nps-box" style={{ borderLeft: '4px solid #00C49F' }}>
              <h4>Promoters (9-10)</h4>
              <Statistic
                value={metrics.promotersPercent?.toFixed(1) || 0}
                suffix="%"
                valueStyle={{ color: '#00C49F', fontSize: '2rem' }}
              />
              <p>{metrics.promotersCount || 0} customers</p>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default SatisfactionMetrics;
