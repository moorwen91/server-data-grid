import React, { useEffect, useRef } from 'react';
import {
  AppBar,
  Dialog,
  Slide,
  SlideProps,
  Toolbar,
  Typography,
} from '@mui/material';
import { IconArrowBack, IconDeviceFloppy } from '@tabler/icons';
import { RouteComponentProps } from 'react-router';
import { titleCase } from 'title-case';
import ResponsiveButton from '../ui/ResponsiveButton';
import {
  IRouteDialogFormComponentProps,
  IRouteDialogFormComponentRef,
} from './IRouteDialogFormComponentProps';
import { SubmitHandler } from 'react-hook-form';
import { DocumentNode, gql, useLazyQuery } from '@apollo/client';

const DialogTransition = React.forwardRef<unknown, SlideProps>(
  function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  }
);

const EMPTY_QUERY = gql`
  query EmptyQuery {
    contacts {
      id
    }
  }
`;

export interface ServerDataGridRouteDialogProps<
  T extends Record<string, unknown>
> extends RouteComponentProps {
  modelName: string;
  FormComponent: React.ComponentType<IRouteDialogFormComponentProps<T>>;
  isEditing?: boolean;
  getItemByIdQuery?: DocumentNode;
  itemId?: string | number;
  isSubmitting?: boolean;
  onSubmit: SubmitHandler<T>;
}

const ServerDataGridRouteDialog = <T extends Record<string, unknown>>({
  history,
  match,
  modelName,
  FormComponent,
  isEditing,
  getItemByIdQuery,
  itemId,
  isSubmitting,
  onSubmit,
}: ServerDataGridRouteDialogProps<T>) => {
  const singleModelName = titleCase(modelName).toLowerCase();

  const { path } = match;
  const handleOnClose = () => {
    if (!isSubmitting) {
      const lastSlash = path.lastIndexOf('/');
      const parentPath = path.substr(0, lastSlash);
      history.push(parentPath);
    }
  };

  const formRef = useRef<IRouteDialogFormComponentRef>(null!);

  const [getItem, { loading, data }] = useLazyQuery(
    getItemByIdQuery || EMPTY_QUERY,
    {
      variables: {
        id: itemId,
      },
      fetchPolicy: 'no-cache',
    }
  );
  const item = data ? data[Object.keys(data)[0]] : undefined;

  useEffect(() => {
    if (isEditing && getItemByIdQuery && itemId) {
      getItem();
    }
  }, [getItem, getItemByIdQuery, isEditing, itemId]);

  return (
    <Dialog
      open
      fullScreen
      onClose={handleOnClose}
      TransitionComponent={DialogTransition}
    >
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <ResponsiveButton
            color="inherit"
            disabled={isSubmitting}
            startIcon={<IconArrowBack />}
            sx={
              isSubmitting
                ? { color: 'rgba(255, 255, 255, 0.5) !important' }
                : undefined
            }
            onClick={handleOnClose}
          >
            Cancel
          </ResponsiveButton>
          <Typography
            variant="h3"
            component="div"
            color="inherit"
            sx={{ flex: 1, textAlign: 'center' }}
          >
            {isEditing ? 'Edit' : 'Add'} {singleModelName}
          </Typography>
          <ResponsiveButton
            autoFocus
            color="inherit"
            loading={isSubmitting}
            startIcon={<IconDeviceFloppy />}
            sx={{
              '& .MuiLoadingButton-loadingIndicator': {
                color: theme => theme.palette.primary.contrastText,
              },
            }}
            onClick={() => {
              formRef.current.submit();
            }}
          >
            Save
          </ResponsiveButton>
        </Toolbar>
      </AppBar>
      <FormComponent
        formRef={formRef}
        item={item}
        isLoading={loading}
        isEditing={isEditing}
        onSubmit={onSubmit}
      />
    </Dialog>
  );
};

export default ServerDataGridRouteDialog;
