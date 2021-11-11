import React, { useMemo } from 'react';
import {
  DataGridProps,
  GridActionsCellItem,
  GridRowModel,
} from '@mui/x-data-grid';
import { IconPencil, IconTrash } from '@tabler/icons';

export interface UseServerDataGridColumnsProps<T extends GridRowModel> {
  columnsProp: DataGridProps['columns'];
  onDelete: (candidate: T) => void;
  onEdit?: (candidate: T) => void;
}

export default function useServerDataGridColumns<T extends GridRowModel>({
  columnsProp,
  onDelete,
  onEdit,
}: UseServerDataGridColumnsProps<T>): DataGridProps['columns'] {
  return useMemo<DataGridProps['columns']>(() => {
    return [
      ...columnsProp,
      {
        field: 'actions',
        sortable: false,
        filterable: false,
        headerName: 'Actions',
        width: 128,
        type: 'actions',
        getActions: ({ row }) => [
          <GridActionsCellItem
            icon={<IconPencil />}
            label="Edit"
            onClick={e => {
              e.stopPropagation();
              onEdit && onEdit(row as T);
            }}
          />,
          <GridActionsCellItem
            icon={<IconTrash />}
            label="Delete"
            color="error"
            onClick={e => {
              e.stopPropagation();
              onDelete && onDelete(row as T);
            }}
          />,
        ],
      },
    ];
  }, [columnsProp, onDelete, onEdit]);
}
