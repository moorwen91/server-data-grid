import React, { useEffect, useState } from 'react';
import { Route, RouteChildrenProps, RouteProps } from 'react-router-dom';
import TabPanel, { TabPanelProps } from './TabPanel';
import CachedRouteMatchContext from '../../contexts/CachedRouteMatchContext';

export type TabPanelRouteProps = RouteChildrenProps &
  TabPanelProps & {
    staticContext?: Record<string, unknown>;
  };
const TabPanelRoute: React.FC<TabPanelRouteProps> = ({
  match,
  location,
  history,
  staticContext,
  children,
  ...props
}) => {
  const [state, setState] = useState({
    lastMatch: match,
    isMatching: !!match,
  });
  useEffect(() => {
    setState(state => {
      return match
        ? { lastMatch: match, isMatching: true }
        : { ...state, isMatching: false };
    });
  }, [match]);

  return (
    <TabPanel {...props} shouldUnmount={false}>
      <CachedRouteMatchContext.Provider value={state.lastMatch}>
        {!!state.lastMatch
          ? typeof children === 'function'
            ? children({
                match: state.lastMatch,
                location,
                history,
                staticContext,
              })
            : children
          : null}
      </CachedRouteMatchContext.Provider>
    </TabPanel>
  );
};

export type TabPanelRouteContainerProp = RouteProps &
  TabPanelProps & {
    computedMatch?: Record<string, unknown>;
  };
const TabPanelRouteContainer = ({
  path,
  exact,
  strict,
  location,
  sensitive,
  computedMatch,
  ...props
}: TabPanelRouteContainerProp) => (
  <Route
    {...{
      path,
      exact,
      strict,
      location,
      sensitive,
    }}
    children={routeProps => <TabPanelRoute {...{ ...props, ...routeProps }} />}
  />
);

export default TabPanelRouteContainer;
