import React from 'react';
import { SubmitHandler } from 'react-hook-form';

export type IRouteDialogFormComponentRef = {
  submit(): void;
};

export type IRouteDialogFormComponentProps<T extends Record<string, unknown>> =
  {
    formRef?: React.Ref<IRouteDialogFormComponentRef>;
    item?: T;
    isLoading?: boolean;
    isEditing?: boolean;
    onSubmit: SubmitHandler<T>;
  };
