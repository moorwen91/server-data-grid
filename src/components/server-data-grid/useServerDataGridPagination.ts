import { useCallback, useReducer } from 'react';

const initialState = {
  page: 0,
  pageSize: 10,
  pagination: {
    limit: 10,
    offset: 0,
  },
};
type ACTION_TYPE =
  | { type: 'SET_PAGE'; payload: number }
  | { type: 'SET_PAGE_SIZE'; payload: number };
function reducer(state: typeof initialState, { type, payload }: ACTION_TYPE) {
  switch (type) {
    case 'SET_PAGE':
      return {
        ...state,
        page: payload,
        pagination: {
          ...state.pagination,
          offset: state.pageSize * payload,
        },
      };
    case 'SET_PAGE_SIZE':
      return {
        page: 0,
        pageSize: payload,
        pagination: {
          limit: payload,
          offset: 0,
        },
      };
    default:
      throw new Error('Not implemented');
  }
}

export default function useServerDataGridPagination() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const onPageChange = useCallback(payload => {
    dispatch({ type: 'SET_PAGE', payload });
  }, []);
  const onPageSizeChange = useCallback(payload => {
    dispatch({ type: 'SET_PAGE_SIZE', payload });
  }, []);

  return {
    ...state,
    page: state.page + 1,
    onPageChange,
    onPageSizeChange,
  };
}
