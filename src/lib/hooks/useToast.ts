import { OptionsObject, SnackbarMessage, useSnackbar } from 'notistack';
import { useCallback } from 'react';
import { Slide } from '@mui/material';

export default function useToast() {
  const { enqueueSnackbar, closeSnackbar: closeToast } = useSnackbar();

  const showToast = useCallback(
    (message: SnackbarMessage, options?: OptionsObject) =>
      enqueueSnackbar(message, {
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
        TransitionComponent: Slide as any,
        ...(options || {}),
      }),
    [enqueueSnackbar]
  );

  return {
    showToast,
    closeToast,
  };
}
