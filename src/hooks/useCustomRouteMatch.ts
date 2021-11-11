import { useRouteMatch } from 'react-router-dom';
import { useContext } from 'react';
import CachedRouteMatchContext from '../contexts/CachedRouteMatchContext';

export default function useCustomRouteMatch() {
  const defaultRouteMatch = useRouteMatch();
  const cachedRouteMatch = useContext(CachedRouteMatchContext);
  return cachedRouteMatch || defaultRouteMatch;
}
