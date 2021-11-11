import { DocumentNode, useMutation } from '@apollo/client';
import getFormattedErrorMessage from '../../utils/apolloErrorUtil';
import { useCallback } from 'react';
import { OptionsObject, SnackbarMessage } from 'notistack';
import { History } from 'history';

export default function useServerDataGridUpdateItem<
  Item extends Record<string, unknown> = Record<string, unknown>,
  UpdateVariables extends Record<string, unknown> = Record<string, unknown>
>(
  updateItemMutation: DocumentNode,
  getItemsQuery: DocumentNode,
  showToast: (
    message: SnackbarMessage,
    options?: OptionsObject
  ) => string | number,
  titleCasedModelName: string,
  history: History<unknown>,
  path: string,
  getUpdateMutationVariables: (item: Item) => UpdateVariables
) {
  const [updateItem, { loading: isUpdatingItem }] = useMutation(
    updateItemMutation,
    {
      refetchQueries: [getItemsQuery],
      onCompleted() {
        showToast(`${titleCasedModelName} saved`, {
          variant: 'success',
        });
        history.push(path);
      },
      onError(error) {
        showToast(getFormattedErrorMessage(error), {
          variant: 'error',
          title: `Error saving ${titleCasedModelName}`,
        });
      },
    }
  );
  const handleUpdateItem = useCallback(
    object => {
      updateItem({
        variables: getUpdateMutationVariables(object),
      });
    },
    [getUpdateMutationVariables, updateItem]
  );

  return { isUpdatingItem, handleUpdateItem };
}
