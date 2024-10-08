import { useState } from 'react';
import { LoadingButton } from '@mui/lab';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

interface UseDeleteConfirmDialog {
  DeleteConfirmDialog: JSX.Element;
  closeDeleteConfirmDialog: () => void;
  openDeleteConfirmDialog: () => void;
}

const useDeleteConfirmDialog = ( callback: () => Promise<void> ): UseDeleteConfirmDialog => {
  const [ isDeleteConfirmDialogOpen, setIsDeleteConfirmDialogOpen ] = useState( false );
  const [ deleteBtnLoading, setDeleteBtnLoading ] = useState( false );

  const closeDeleteConfirmDialog = () => {
    setIsDeleteConfirmDialogOpen( false );
  };

  const openDeleteConfirmDialog = () => {
    setIsDeleteConfirmDialogOpen( true );
  };

  const handleDelete = async () => {
    try {
      setDeleteBtnLoading( true );
      await callback(); // Execute the passed callback function
    } finally {
      setDeleteBtnLoading( false );
    }
    setIsDeleteConfirmDialogOpen( false );
  };

  const DeleteConfirmDialog = (
    <Dialog open={isDeleteConfirmDialogOpen} onClose={closeDeleteConfirmDialog}>
      <DialogTitle>Confirm Delete</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete this item? This action cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <LoadingButton onClick={closeDeleteConfirmDialog} color="primary">
          Cancel
        </LoadingButton>
        <LoadingButton
          loading={deleteBtnLoading}
          onClick={handleDelete}
          color="error"
        >
          Delete
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );

  return { DeleteConfirmDialog, closeDeleteConfirmDialog, openDeleteConfirmDialog };
};

export default useDeleteConfirmDialog;