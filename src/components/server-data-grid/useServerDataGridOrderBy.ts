import { Dispatch, SetStateAction, useCallback, useState } from 'react';
import { GridSortItem } from '@mui/x-data-grid';

export type UseServerDataGridOrderByProps = {
  defaultOrderBy: string;
  defaultOrderByDir?: 'asc' | 'desc';
  customOrderBy?: (
    model: GridSortItem,
    setOrder: Dispatch<
      SetStateAction<{ [p: string]: 'asc' | 'desc' | undefined }>
    >
  ) => void;
};

export default function useServerDataGridOrderBy({
  defaultOrderBy,
  defaultOrderByDir,
  customOrderBy,
}: UseServerDataGridOrderByProps) {
  const [orderBy, setOrderBy] = useState({
    [defaultOrderBy]: defaultOrderByDir,
  });
  const [sortModel, setSortModel] = useState([
    { field: defaultOrderBy, sort: defaultOrderByDir },
  ]);
  const onSortModelChange = useCallback(
    sortModelParam => {
      if (sortModelParam !== sortModel) {
        setSortModel(sortModelParam);
        const model = sortModelParam[0];
        if (model) {
          if (customOrderBy) {
            customOrderBy(model, setOrderBy);
          } else {
            setOrderBy({ [model.field]: model.sort });
          }
        } else {
          setOrderBy({});
        }
      }
    },
    [customOrderBy, sortModel]
  );

  return {
    orderBy,
    sortModel,
    onSortModelChange,
  };
}
