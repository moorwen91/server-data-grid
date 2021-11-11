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
import pluralize from 'pluralize';
import { uniqueId } from 'lodash';
import { DataGridProps } from '@mui/x-data-grid';

export interface ServerDataGridDeleteRowsDialogProps {
  modelName: string;
  isOpen: boolean;
  isDeleting: boolean;
  deleteCandidates: any[];
  formatItem: (item: any) => React.ReactNode;
  getRowId?: DataGridProps['getRowId'];
  onDeleteConfirm: () => void;
  onClose: () => void;
}

const ServerDataGridDeleteRowsDialog = ({
  modelName,
  isOpen,
  isDeleting,
  deleteCandidates,
  formatItem,
  getRowId,
  onDeleteConfirm,
  onClose,
}: ServerDataGridDeleteRowsDialogProps) => {
  const pluralModelName = titleCase(pluralize(modelName)).toLowerCase();
  const [titleId] = useState(uniqueId('alert-dialog-title-'));
  const [descriptionId] = useState(uniqueId('alert-dialog-description-'));

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
    >
      <DialogTitle id={titleId}>Delete {pluralModelName}</DialogTitle>
      <DialogContent>
        <DialogContentText id={descriptionId}>
          Are you sure you want to delete the following {pluralModelName}?
        </DialogContentText>
        <ul>
          {deleteCandidates.map(item => (
            <li key={getRowId ? getRowId(item) : item.id}>
              {item && formatItem(item)}
            </li>
          ))}
        </ul>
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

export default ServerDataGridDeleteRowsDialog;
