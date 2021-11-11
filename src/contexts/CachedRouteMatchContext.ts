import React from 'react';
import { RouteChildrenProps } from 'react-router';

const CachedRouteMatchContext =
  React.createContext<RouteChildrenProps['match']>(null);
export default CachedRouteMatchContext;
