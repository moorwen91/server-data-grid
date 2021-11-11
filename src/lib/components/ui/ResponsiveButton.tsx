import React from 'react';
import { styled } from '@mui/material';
import { LoadingButton, LoadingButtonProps } from '@mui/lab';

const StyledButton = styled(LoadingButton)(({ theme }) => ({
  [theme.breakpoints.only('xs')]: {
    minWidth: 'auto',
    '& .MuiButton-startIcon': {
      marginRight: 0,
      marginLeft: 0,
    },
  },
}));

const ButtonText = styled('span')(({ theme }) => ({
  [theme.breakpoints.only('xs')]: {
    display: 'none',
  },
}));

const ResponsiveButton: React.FC<LoadingButtonProps> = ({
  children,
  ...rest
}) => {
  return (
    <StyledButton {...rest}>
      <ButtonText>{children}</ButtonText>
    </StyledButton>
  );
};

export default ResponsiveButton;
