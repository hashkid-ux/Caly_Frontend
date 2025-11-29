import React from 'react';
import TeamAnalytics from '../pages/TeamAnalytics';

/**
 * PerformanceChart - Wrapper around TeamAnalytics for use as component
 */
export default function PerformanceChart({ teamId, token }) {
  return <TeamAnalytics teamId={teamId} token={token} />;
}
