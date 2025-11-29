/**
 * Predictions Dashboard Page
 * Phase 7: Advanced Analytics & Performance Optimization
 * 
 * Displays forecasts, anomaly detection, and AI recommendations
 */

import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, Row, Col, Statistic, Table, Select, Button, Tag, Alert, Progress, Loading, Collapse } from '@/components/Common';
import './Analytics.css';

const PredictionsDashboard = () => {
  const [forecastDays, setForecastDays] = useState(7);
  const [anomalyThreshold, setAnomalyThreshold] = useState('medium');

  // Fetch predictions
  const { data: predictionsData, isLoading } = useQuery(
    ['predictions', forecastDays],
    async () => {
      const response = await fetch(`/api/analytics/predictions/call-volume?days=${forecastDays}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      if (!response.ok) throw new Error('Failed to fetch predictions');
      return response.json();
    },
    { refetchInterval: 300000 } // 5 minute refresh
  );

  // Fetch anomalies
  const { data: anomaliesData } = useQuery(
    ['anomalies', anomalyThreshold],
    async () => {
      const response = await fetch(`/api/analytics/predictions/anomalies?severity=${anomalyThreshold}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      if (!response.ok) throw new Error('Failed to fetch anomalies');
      return response.json();
    }
  );

  // Fetch recommendations
  const { data: recommendationsData } = useQuery(
    ['recommendations'],
    async () => {
      const response = await fetch(`/api/analytics/predictions/recommendations`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      if (!response.ok) throw new Error('Failed to fetch recommendations');
      return response.json();
    }
  );

  // Fetch churn risk
  const { data: churnData } = useQuery(
    ['churn-risk'],
    async () => {
      const response = await fetch(`/api/analytics/predictions/churn-risk`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      if (!response.ok) throw new Error('Failed to fetch churn risk');
      return response.json();
    }
  );

  // Fetch staffing recommendations
  const { data: staffingData } = useQuery(
    ['staffing'],
    async () => {
      const response = await fetch(`/api/analytics/predictions/staffing`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      if (!response.ok) throw new Error('Failed to fetch staffing');
      return response.json();
    }
  );

  if (isLoading) return <Loading message="Loading predictions..." />;

  const predictions = predictionsData?.data || {};
  const anomalies = anomaliesData?.data || [];
  const recommendations = recommendationsData?.data || [];
  const churn = churnData?.data || {};
  const staffing = staffingData?.data || {};

  const getAnomalySeverityColor = (severity) => {
    const severityLower = severity?.toLowerCase();
    if (severityLower === 'critical') return '#FF8042';
    if (severityLower === 'high') return '#FFBB28';
    if (severityLower === 'medium') return '#0088FE';
    return '#00C49F';
  };

  const getRecommendationColor = (priority) => {
    if (priority === 'critical') return '#FF8042';
    if (priority === 'high') return '#FFBB28';
    if (priority === 'medium') return '#0088FE';
    return '#00C49F';
  };

  return (
    <div className="analytics-container">
      <div className="page-header">
        <h1>Predictions & Insights</h1>
        <p>AI-powered forecasts, anomaly detection, and recommendations</p>
      </div>

      {/* Controls */}
      <div className="controls-section">
        <Row gutter={16}>
          <Col span={8}>
            <Select
              placeholder="Forecast Period"
              value={forecastDays}
              onChange={setForecastDays}
              options={[
                { label: '1 Day Ahead', value: 1 },
                { label: '7 Days Ahead', value: 7 },
                { label: '14 Days Ahead', value: 14 },
                { label: '30 Days Ahead', value: 30 }
              ]}
            />
          </Col>
          <Col span={8}>
            <Select
              placeholder="Anomaly Sensitivity"
              value={anomalyThreshold}
              onChange={setAnomalyThreshold}
              options={[
                { label: 'Critical Only', value: 'critical' },
                { label: 'High & Critical', value: 'high' },
                { label: 'All Anomalies', value: 'medium' }
              ]}
            />
          </Col>
          <Col span={8}>
            <Button type="primary" onClick={() => window.print()}>
              Export Insights
            </Button>
          </Col>
        </Row>
      </div>

      {/* Alerts */}
      {anomalies && anomalies.length > 0 && (
        <Alert
          message={`${anomalies.length} Anomalies Detected`}
          description="Review anomalies and take action as needed"
          type={anomalies.some(a => a.severity === 'critical') ? 'error' : 'warning'}
          showIcon
          closable
          style={{ marginBottom: 20 }}
        />
      )}

      {/* Call Volume Forecast */}
      <Card title="Call Volume Forecast">
        <Row gutter={16} style={{ marginBottom: 20 }}>
          <Col span={6}>
            <Statistic
              title="Current Volume"
              value={predictions.currentVolume || 0}
              suffix="calls/day"
              valueStyle={{ color: '#0088FE' }}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="Forecast Average"
              value={predictions.forecastAverage || 0}
              suffix="calls/day"
              valueStyle={{ color: '#00C49F' }}
            />
            <p className="metric-change" style={{ color: (predictions.forecastChange || 0) > 0 ? '#FF8042' : '#00C49F' }}>
              {(predictions.forecastChange || 0) > 0 ? '↑' : '↓'} {Math.abs(predictions.forecastChange || 0).toFixed(1)}% expected
            </p>
          </Col>
          <Col span={6}>
            <Statistic
              title="Peak Forecast"
              value={predictions.peakForecast || 0}
              suffix="calls/hour"
              valueStyle={{ color: '#FFBB28' }}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="Confidence"
              value={predictions.confidence || 0}
              suffix="%"
              valueStyle={{ color: '#8884D8' }}
            />
            <Progress percent={predictions.confidence || 0} />
          </Col>
        </Row>

        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={predictions.forecast || []}>
            <defs>
              <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0088FE" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#0088FE" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="actual" stroke="#00C49F" name="Actual" />
            <Area type="monotone" dataKey="forecast" stroke="#0088FE" fillOpacity={1} fill="url(#colorForecast)" name="Forecast" />
            <Area type="monotone" dataKey="upper" stroke="#FFBB28" strokeDasharray="5 5" name="Upper Bound" />
            <Area type="monotone" dataKey="lower" stroke="#FF8042" strokeDasharray="5 5" name="Lower Bound" />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* Staffing Recommendations */}
      <Card title="Staffing Recommendations">
        <Row gutter={16} style={{ marginBottom: 20 }}>
          <Col span={6}>
            <div style={{ borderLeft: '4px solid #0088FE', paddingLeft: 15 }}>
              <h4>Current Staff</h4>
              <Statistic value={staffing.currentStaff || 0} suffix="agents" />
            </div>
          </Col>
          <Col span={6}>
            <div style={{ borderLeft: '4px solid #00C49F', paddingLeft: 15 }}>
              <h4>Recommended Staff</h4>
              <Statistic value={staffing.recommendedStaff || 0} suffix="agents" />
              <p className="metric-change" style={{ color: (staffing.recommendedStaff - staffing.currentStaff) > 0 ? '#FF8042' : '#00C49F' }}>
                {(staffing.recommendedStaff - staffing.currentStaff) > 0 ? '↑' : '↓'} {Math.abs(staffing.recommendedStaff - staffing.currentStaff)} agents
              </p>
            </div>
          </Col>
          <Col span={6}>
            <div style={{ borderLeft: '4px solid #FFBB28', paddingLeft: 15 }}>
              <h4>Utilization Target</h4>
              <Statistic value={staffing.utilizationTarget || 85} suffix="%" />
            </div>
          </Col>
          <Col span={6}>
            <div style={{ borderLeft: '4px solid #8884D8', paddingLeft: 15 }}>
              <h4>Expected SLA</h4>
              <Statistic value={staffing.expectedSLA || 0} suffix="%" />
              <p>Service Level Achievement</p>
            </div>
          </Col>
        </Row>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={staffing.byHour || []}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hour" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="required" fill="#0088FE" name="Required Staff" />
            <Bar dataKey="scheduled" fill="#00C49F" name="Scheduled Staff" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Anomalies Detection */}
      <Card title="Anomaly Detection">
        {anomalies.length === 0 ? (
          <Alert message="No anomalies detected" type="success" showIcon />
        ) : (
          <Table
            columns={[
              { title: 'Date', dataIndex: 'date', key: 'date', width: 120 },
              { title: 'Metric', dataIndex: 'metric', key: 'metric' },
              { title: 'Expected', dataIndex: 'expected', key: 'expected' },
              { title: 'Actual', dataIndex: 'actual', key: 'actual' },
              { title: 'Deviation', dataIndex: 'deviation', key: 'deviation', render: d => `${d.toFixed(1)}%` },
              { title: 'Severity', dataIndex: 'severity', key: 'severity', render: s => (
                <Tag color={getAnomalySeverityColor(s)}>{s}</Tag>
              )},
              { title: 'Status', dataIndex: 'status', key: 'status', render: s => (
                <Tag color={s === 'resolved' ? 'green' : s === 'investigating' ? 'blue' : 'red'}>{s}</Tag>
              )}
            ]}
            dataSource={anomalies.map((a, idx) => ({
              ...a,
              key: a.id || idx
            }))}
            pagination={{ pageSize: 10 }}
          />
        )}
      </Card>

      {/* Churn Risk Analysis */}
      <Card title="Customer Churn Risk Analysis">
        <Row gutter={16}>
          <Col span={8}>
            <div style={{ borderLeft: '4px solid #FF8042', paddingLeft: 15 }}>
              <h4>High Risk Customers</h4>
              <Statistic value={churn.highRiskCount || 0} />
              <p>{(churn.highRiskPercent || 0).toFixed(1)}% of customer base</p>
            </div>
          </Col>
          <Col span={8}>
            <div style={{ borderLeft: '4px solid #FFBB28', paddingLeft: 15 }}>
              <h4>Medium Risk Customers</h4>
              <Statistic value={churn.mediumRiskCount || 0} />
              <p>{(churn.mediumRiskPercent || 0).toFixed(1)}% of customer base</p>
            </div>
          </Col>
          <Col span={8}>
            <div style={{ borderLeft: '4px solid #00C49F', paddingLeft: 15 }}>
              <h4>Low Risk Customers</h4>
              <Statistic value={churn.lowRiskCount || 0} />
              <p>{(churn.lowRiskPercent || 0).toFixed(1)}% of customer base</p>
            </div>
          </Col>
        </Row>

        <h4 style={{ marginTop: 20 }}>Risk Factors Contributing to Churn</h4>
        <ul>
          {(churn.riskFactors || []).map((factor, idx) => (
            <li key={idx}>
              <strong>{factor.factor}:</strong> {factor.description} (Impact: {factor.impact}%)
            </li>
          ))}
        </ul>
      </Card>

      {/* AI Recommendations */}
      <Card title="AI-Powered Recommendations">
        {recommendations.length === 0 ? (
          <Alert message="No action items at this time. Keep up the good work!" type="success" showIcon />
        ) : (
          <Collapse>
            {recommendations.map((rec, idx) => (
              <Collapse.Panel
                key={idx}
                header={
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <span>
                      <Tag color={getRecommendationColor(rec.priority)}>{rec.priority.toUpperCase()}</Tag>
                      {' '}{rec.title}
                    </span>
                    <span style={{ fontSize: 12, color: '#999' }}>Impact: {rec.impact}</span>
                  </div>
                }
              >
                <p>{rec.description}</p>
                <h5>Recommended Actions:</h5>
                <ol>
                  {(rec.actions || []).map((action, actionIdx) => (
                    <li key={actionIdx}>{action}</li>
                  ))}
                </ol>
                <p style={{ marginTop: 10, color: '#666', fontSize: 12 }}>
                  <strong>Expected Outcome:</strong> {rec.expectedOutcome}
                </p>
              </Collapse.Panel>
            ))}
          </Collapse>
        )}
      </Card>

      {/* Forecast Accuracy */}
      <Card title="Model Performance">
        <Row gutter={24}>
          <Col span={8}>
            <Statistic
              title="Forecast Accuracy"
              value={predictions.accuracy || 0}
              suffix="%"
              valueStyle={{ color: '#0088FE' }}
            />
            <Progress percent={predictions.accuracy || 0} />
          </Col>
          <Col span={8}>
            <Statistic
              title="Mean Absolute Error"
              value={predictions.mae?.toFixed(0) || 0}
              suffix="calls"
              valueStyle={{ color: '#00C49F' }}
            />
            <p>Average forecast deviation</p>
          </Col>
          <Col span={8}>
            <Statistic
              title="Model Update"
              value={predictions.lastUpdate}
              valueStyle={{ fontSize: 12 }}
            />
            <p>Last trained on historical data</p>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default PredictionsDashboard;
