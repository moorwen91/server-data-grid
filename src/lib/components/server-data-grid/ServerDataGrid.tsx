import React, { useCallback, useState } from 'react';
import { Box, Paper, TablePagination } from '@mui/material';
import ServerDataGridHeader from './ServerDataGridHeader';
import {
    DataGrid,
    DataGridProps,
    GridRowId,
    useGridApiContext,
    useGridState,
} from '@mui/x-data-grid';
import { DocumentNode, useMutation, useQuery } from '@apollo/client';
import useServerDataGridOrderBy, {
  UseServerDataGridOrderByProps,
} from './useServerDataGridOrderBy';
import useServerDataGridFilterBy, {
  UseServerDataGridFilterByProps,
} from './useServerDataGridFilterBy';
import useServerDataGridPagination from './useServerDataGridPagination';
import useServerDataGridColumns from './useServerDataGridColumns';
import { useDeleteServerDataGridRow } from './useDeleteServerDataGridRow';
import ServerDataGridDeleteRowDialog from './ServerDataGridDeleteRowDialog';
import ServerDataGridDeleteRowsDialog from './ServerDataGridDeleteRowsDialog';
import { Route, Switch, useHistory } from 'react-router-dom';
import useCustomRouteMatch from '../../hooks/useCustomRouteMatch';
import { titleCase } from 'title-case';
import ServerDataGridRouteDialog from './ServerDataGridRouteDialog';
import { IRouteDialogFormComponentProps } from './IRouteDialogFormComponentProps';
import useToast from '../../hooks/useToast';
import getFormattedErrorMessage from '../../utils/apolloErrorUtil';
import { Optional } from 'utility-types';
import useServerDataGridInsertItem from './useServerDataGridInsertItem';
import useServerDataGridUpdateItem from './useServerDataGridUpdateItem';

const ROWS_PER_PAGE_OPTIONS = [5, 10, 20];
function CustomPagination() {
  const apiRef = useGridApiContext();
  const [state] = useGridState(apiRef);
  return (
    <TablePagination
      component="div"
      count={state.pagination.rowCount}
      page={state.rows.totalRowCount > 0 ? state.pagination.page : 0}
      rowsPerPage={state.pagination.pageSize}
      rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
      onPageChange={(_, page) => apiRef.current.setPage(page)}
      onRowsPerPageChange={e => {
        apiRef.current.setPageSize(+e.target.value);
        apiRef.current.setPage(0);
      }}
    />
  );
}

export type Row = Record<string, unknown> & { id?: unknown };
type WithGetRowId = {
  getRowId: DataGridProps['getRowId'];
};
type RowId<T> = T extends { id: unknown }
  ? Record<string, unknown>
  : WithGetRowId;
export type ServerDataGridProps<
  GetItemsQueryData extends Record<string, unknown> = Record<string, unknown>,
  TableRow extends Row = Row,
  FormInputs extends Record<string, unknown> = Record<string, unknown>,
  Item extends Record<string, unknown> = Record<string, unknown>,
  UpdateVariables extends Record<string, unknown> = Record<string, unknown>
> = RowId<TableRow> &
  UseServerDataGridOrderByProps &
  Optional<UseServerDataGridFilterByProps, 'defaultFilter'> & {
    modelName: string;
    columns: DataGridProps['columns'];
    getItemsQuery: DocumentNode;
    getItemsQueryDataMapper: (
      queryData?: GetItemsQueryData
    ) => [TableRow[], number];
    deleteItemMutation: DocumentNode;
    formatItem: (item: TableRow) => React.ReactNode;
    FormComponent: React.ComponentType<
      IRouteDialogFormComponentProps<FormInputs>
    >;
    insertItemMutation: DocumentNode;
    getItemByIdQuery: DocumentNode;
    updateItemMutation: DocumentNode;
    getUpdateMutationVariables: (item: Item) => UpdateVariables;
  };

function ServerDataGrid<
  GetItemsQueryData extends Record<string, unknown> = Record<string, unknown>,
  TableRow extends Row = Row,
  FormInputs extends Record<string, unknown> = Record<string, unknown>,
  Item extends Record<string, unknown> = Record<string, unknown>,
  UpdateVariables extends Record<string, unknown> = Record<string, unknown>
>({
  modelName,
  columns: columnsProp,
  getItemsQuery,
  getItemsQueryDataMapper,
  customOrderBy,
  defaultOrderBy,
  defaultOrderByDir = 'asc',
  defaultFilter = {},
  customFilter,
  deleteItemMutation,
  formatItem,
  getRowId,
  FormComponent,
  insertItemMutation,
  getItemByIdQuery,
  updateItemMutation,
  getUpdateMutationVariables,
}: ServerDataGridProps<
  GetItemsQueryData,
  TableRow,
  FormInputs,
  Item,
  UpdateVariables
>) {
  const history = useHistory();
  const routeMatch = useCustomRouteMatch();
  const { path, url } = routeMatch;

  const { showToast } = useToast();
  const titleCasedModelName = titleCase(modelName);

  const { orderBy, sortModel, onSortModelChange } = useServerDataGridOrderBy({
    defaultOrderBy,
    defaultOrderByDir,
    customOrderBy,
  });
  const { pageSize, pagination, onPageChange, onPageSizeChange } =
    useServerDataGridPagination();
  const { where, onFilterModelChange } = useServerDataGridFilterBy({
    defaultFilter,
    customFilter,
  });

  const { data, loading } = useQuery<GetItemsQueryData>(getItemsQuery, {
    variables: {
      orderBy,
      where,
      ...pagination,
    },
  });
  const [rows, rowCount] = getItemsQueryDataMapper(data);

  const [deleteItems, { loading: isDeleting }] = useMutation(
    deleteItemMutation,
    {
      refetchQueries: [getItemsQuery],
      onCompleted() {
        showToast(`${titleCasedModelName} deleted`, {
          variant: 'success',
        });
      },
      onError(error) {
        showToast(getFormattedErrorMessage(error), {
          variant: 'error',
          title: `Error deleting ${titleCasedModelName}`,
        });
      },
    }
  );

  const [deleteCandidates, setDeleteCandidates] = useState<GridRowId[]>([]);
  const {
    isOpen: isDeleteDialogOpen,
    deleteCandidate,
    onClose: onCloseDeleteDialog,
    onDelete: onDeleteSingle,
  } = useDeleteServerDataGridRow<TableRow>(isDeleting);
  const {
    isOpen: isDeleteSelectionDialogOpen,
    onClose: onCloseDeleteSelectionDialog,
    onDelete: onDeleteSelection,
  } = useDeleteServerDataGridRow<TableRow>(isDeleting);

  const onEdit = useCallback(
    item => {
      history.push(`${url}/${getRowId ? getRowId(item) : item.id}`);
    },
    [getRowId, history, url]
  );

  const columns = useServerDataGridColumns<TableRow>({
    columnsProp,
    onDelete: onDeleteSingle,
    onEdit,
  });

  const { isInsertingItem, handleInsertItem } =
    useServerDataGridInsertItem<FormInputs>(
      insertItemMutation,
      getItemsQuery,
      showToast,
      titleCasedModelName,
      history,
      path
    );

  const { isUpdatingItem, handleUpdateItem } = useServerDataGridUpdateItem<
    Item,
    UpdateVariables
  >(
    updateItemMutation,
    getItemsQuery,
    showToast,
    titleCasedModelName,
    history,
    path,
    getUpdateMutationVariables
  );

  return (
    <Box>
      <ServerDataGridHeader
        modelName={modelName}
        selectedItemCount={deleteCandidates.length}
        onAdd={() => {
          history.push(`${url}/add`);
        }}
        onDelete={() => onDeleteSelection()}
      />

      <Paper>
        <DataGrid
          autoHeight
          checkboxSelection
          rows={rows}
          rowCount={rowCount}
          columns={columns}
          loading={loading}
          pageSize={pageSize}
          filterMode="server"
          paginationMode="server"
          sortingMode="server"
          sortModel={sortModel}
          getRowId={getRowId}
          components={{
            Pagination: CustomPagination,
          }}
          onFilterModelChange={onFilterModelChange}
          onSelectionModelChange={setDeleteCandidates}
          onSortModelChange={onSortModelChange}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />

        <ServerDataGridDeleteRowDialog<TableRow>
          {...{
            modelName,
            isOpen: isDeleteDialogOpen,
            isDeleting,
            deleteCandidate,
            formatItem,
            onDeleteConfirm: () => {
              deleteItems({
                variables: {
                  ids: [
                    getRowId
                      ? getRowId(deleteCandidate!)
                      : 'id' in deleteCandidate!
                      ? deleteCandidate?.id
                      : undefined,
                  ],
                },
              }).then(onCloseDeleteDialog);
            },
            onClose: onCloseDeleteDialog,
          }}
        />

        <ServerDataGridDeleteRowsDialog
          {...{
            modelName,
            isOpen: isDeleteSelectionDialogOpen,
            isDeleting,
            deleteCandidates: deleteCandidates
              .map(id =>
                rows.find(
                  row =>
                    (getRowId
                      ? getRowId(row)
                      : 'id' in row
                      ? row.id
                      : undefined) === id
                )
              )
              .filter(i => !!i),
            formatItem,
            getRowId,
            onDeleteConfirm: () => {
              deleteItems({ variables: { ids: deleteCandidates } }).then(
                onCloseDeleteSelectionDialog
              );
            },
            onClose: onCloseDeleteSelectionDialog,
          }}
        />
      </Paper>

      <Switch>
        <Route
          path={`${path}/add`}
          render={props => (
            <ServerDataGridRouteDialog
              {...props}
              modelName={modelName}
              isSubmitting={isInsertingItem}
              FormComponent={FormComponent}
              onSubmit={handleInsertItem as any}
            />
          )}
        />
        <Route
          path={`${path}/:id`}
          render={props => (
            <ServerDataGridRouteDialog
              {...props}
              isEditing
              getItemByIdQuery={getItemByIdQuery}
              itemId={props.match.params.id}
              modelName={modelName}
              isSubmitting={isUpdatingItem}
              FormComponent={FormComponent}
              onSubmit={handleUpdateItem}
            />
          )}
        />
      </Switch>
    </Box>
  );
}

export default ServerDataGrid;
