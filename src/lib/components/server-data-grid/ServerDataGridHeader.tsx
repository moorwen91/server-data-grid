import React from 'react';
import { Button, Grid, Typography } from '@mui/material';
import pluralize from 'pluralize';
import { sentenceCase } from 'sentence-case';
import { IconPlus, IconTrash } from '@tabler/icons';

export interface ServerDataGridHeaderProps {
  modelName: string;
  selectedItemCount: number;
  onAdd: () => void;
  onDelete: () => void;
}
const ServerDataGridHeader = ({
  modelName,
  selectedItemCount,
  onAdd,
  onDelete,
}: ServerDataGridHeaderProps) => {
  const title = sentenceCase(pluralize(modelName));

  return (
    <Grid
      container
      alignItems="center"
      justifyContent="space-between"
      marginBottom={1}
    >
      <Grid item xs>
        <Typography
          variant="h2"
          noWrap
          textAlign={{ xs: 'center', sm: 'initial' }}
          marginBottom={{ xs: 1, sm: 0 }}
        >
          {title}
        </Typography>
      </Grid>
      <Grid item xs sm="auto" textAlign="center">
        <Button
          variant="text"
          startIcon={<IconPlus />}
          aria-label="Add"
          sx={{ marginRight: 1 }}
          onClick={onAdd}
        >
          Add
        </Button>
        <Button
          variant="text"
          color="error"
          startIcon={<IconTrash />}
          aria-label="Delete"
          disabled={selectedItemCount === 0}
          onClick={onDelete}
        >
          Delete
        </Button>
      </Grid>
    </Grid>
  );
};

export default ServerDataGridHeader;
