import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { titleCase } from 'title-case';
import { uniqueId } from 'lodash';
import { Row } from './ServerDataGrid';

export type ServerDataGridDeleteRowDialogProps<T extends Row> = {
  modelName: string;
  isOpen: boolean;
  isDeleting: boolean;
  deleteCandidate?: T;
  formatItem: (item: T) => React.ReactNode;
  onDeleteConfirm: () => void;
  onClose: () => void;
};

const ServerDataGridDeleteRowDialog = <T extends Row = Row>({
  modelName,
  isOpen,
  isDeleting,
  deleteCandidate,
  formatItem,
  onDeleteConfirm,
  onClose,
}: ServerDataGridDeleteRowDialogProps<T>) => {
  const singleModelName = titleCase(modelName).toLowerCase();
  const [titleId] = useState(uniqueId('alert-dialog-title-'));
  const [descriptionId] = useState(uniqueId('alert-dialog-description-'));

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
    >
      <DialogTitle id={titleId}>Delete {singleModelName}</DialogTitle>
      <DialogContent>
        <DialogContentText id={descriptionId}>
          Are you sure you want to delete the {singleModelName}:{' '}
          <strong>{deleteCandidate && formatItem(deleteCandidate)}</strong>?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button autoFocus disabled={isDeleting} onClick={onClose}>
          Cancel
        </Button>
        <LoadingButton
          loading={isDeleting}
          color="error"
          onClick={onDeleteConfirm}
        >
          Delete
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default ServerDataGridDeleteRowDialog;
