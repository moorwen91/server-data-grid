import { DocumentNode, useMutation } from '@apollo/client';
import getFormattedErrorMessage from '../../utils/apolloErrorUtil';
import { useCallback } from 'react';
import { mapToInsertMutationPayload } from '../../utils/hasuraMutationUtil';
import { OptionsObject, SnackbarMessage } from 'notistack';
import { History } from 'history';

export default function useServerDataGridInsertItem<
  Item extends Record<string, unknown> = Record<string, unknown>,
  InsertVariables extends Record<string, unknown> = Record<string, unknown>
>(
  insertItemMutation: DocumentNode,
  getItemsQuery: DocumentNode,
  showToast: (
    message: SnackbarMessage,
    options?: OptionsObject
  ) => string | number,
  titleCasedModelName: string,
  history: History<unknown>,
  path: string,
  getInsertMutationVariables?: (item: Item) => InsertVariables
) {
  const [insertItem, { loading: isInsertingItem }] = useMutation(
    insertItemMutation,
    {
      refetchQueries: [getItemsQuery],
      onCompleted() {
        showToast(`${titleCasedModelName} created`, {
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
  const handleInsertItem = useCallback(
    (object: Item) => {
      insertItem({
        variables: getInsertMutationVariables
          ? getInsertMutationVariables(object)
          : {
              object: mapToInsertMutationPayload(object),
            },
      });
    },
    [insertItem]
  );

  return { isInsertingItem, handleInsertItem };
}
