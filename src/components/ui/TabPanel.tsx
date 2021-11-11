import { CardContent } from '@mui/material';
import React, { useEffect, useState } from 'react';

export const a11yProps = (index: number) => ({
  id: `tab-${index}`,
  'aria-controls': `tabpanel-${index}`,
});

export interface TabPanelProps {
  isActive: boolean;
  index: number;
  shouldUnmount?: boolean;
}

const TabPanel: React.FC<TabPanelProps> = ({
  isActive,
  index,
  shouldUnmount = true,
  children,
  ...rest
}) => {
  const [hasBeenActivated, setHasBeenActivated] = useState(isActive);
  useEffect(() => {
    if (isActive && !hasBeenActivated) {
      setHasBeenActivated(true);
    }
  }, [isActive, hasBeenActivated]);

  const content = <CardContent {...rest}>{children}</CardContent>;
  return (
    <div
      role="tabpanel"
      hidden={!isActive}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
    >
      {shouldUnmount ? isActive && content : hasBeenActivated && content}
    </div>
  );
};

export default TabPanel;
