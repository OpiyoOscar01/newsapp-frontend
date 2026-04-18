import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import {
  shouldTrackRouteVisit,
  useInitializeVisitorAnalyticsSync,
  useTrackCurrentVisitor,
} from '../../api/visitor-analytics/VisitorAnalyticsQueries';

const VisitorAnalyticsTracker: React.FC = () => {
  const location = useLocation();
  const previousRouteRef = useRef<string | null>(null);

  useInitializeVisitorAnalyticsSync();

  const { trackCurrentVisitor } = useTrackCurrentVisitor();

  useEffect(() => {
    const routeKey = `${location.pathname}${location.search}`;

    if (!shouldTrackRouteVisit(routeKey)) {
      previousRouteRef.current = routeKey;
      return;
    }

    trackCurrentVisitor({
      page: routeKey,
      additionalData: {
        trackingSource: previousRouteRef.current ? 'route-change' : 'initial-load',
        previousRoute: previousRouteRef.current,
        hash: location.hash || null,
        trackedAt: new Date().toISOString(),
      },
    });

    previousRouteRef.current = routeKey;
  }, [location.pathname, location.search, location.hash, trackCurrentVisitor]);

  return null;
};

export default VisitorAnalyticsTracker;
