import { useState, useCallback, Dispatch, SetStateAction } from 'react';
import { DataGridProps, GridFilterModel } from '@mui/x-data-grid';

export type UseServerDataGridFilterByProps = {
  defaultFilter: Record<string, unknown>;
  customFilter?: (
    columnField: string,
    filter: Record<string, unknown>,
    setWhere: Dispatch<SetStateAction<Record<string, unknown>>>
  ) => void;
};
export default function useServerDataGridFilterBy({
  defaultFilter,
  customFilter,
}: UseServerDataGridFilterByProps) {
  const [where, setWhere] = useState(defaultFilter);

  const onFilterModelChange: DataGridProps['onFilterModelChange'] = useCallback(
    (filterModel: GridFilterModel) => {
      if (filterModel.items.length > 0 && filterModel.items[0].value) {
        const { value, columnField, operatorValue } = filterModel.items[0];
        let filter: Record<string, unknown> | undefined;
        // eslint-disable-next-line default-case
        switch (operatorValue) {
          case 'contains':
            filter = { _ilike: `%${value}%` };
            break;
          case 'equals':
            filter = { _eq: value };
            break;
          case 'startsWith':
            filter = { _ilike: `${value}%` };
            break;
          case 'endsWith':
            filter = { _ilike: `%${value}` };
            break;
          case 'isEmpty':
            filter = { _eq: '' };
            break;
          case 'isNotEmpty':
            filter = { _neq: '' };
            break;
        }
        if (filter) {
          if (customFilter) {
            customFilter(columnField!, filter, setWhere);
          } else {
            setWhere({ [columnField!]: filter });
          }
        }
      } else {
        setWhere({});
      }
    },
    [customFilter]
  );

  return {
    where,
    onFilterModelChange,
  };
}
