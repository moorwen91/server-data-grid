import { useState, useCallback, useEffect } from 'react';
import usePrevious from '../../hooks/usePrevious';

export function useDeleteServerDataGridRow<T>(isDeleting: boolean) {
  const [isOpen, setIsOpen] = useState(false);
  const prevIsOpen = usePrevious(isOpen);
  const [deleteCandidate, setDeleteCandidate] = useState<T | undefined>(
    undefined!
  );

  const onDelete = useCallback((row?: T) => {
    setDeleteCandidate(row);
    setIsOpen(true);
  }, []);
  const closeDeleteDialog = useCallback(() => {
    setIsOpen(false);
  }, []);
  const onClose = useCallback(() => {
    if (!isDeleting) {
      closeDeleteDialog();
    }
  }, [closeDeleteDialog, isDeleting]);

  // Wait for the modal close animation
  useEffect(() => {
    if (prevIsOpen && !isOpen) {
      const timeout = setTimeout(() => {
        setDeleteCandidate(undefined);
      }, 225);
      return () => {
        clearTimeout(timeout);
      };
    }
  }, [isOpen, prevIsOpen]);

  return {
    isOpen,
    deleteCandidate,
    onDelete,
    onClose,
  };
}
