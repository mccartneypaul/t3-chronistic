import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import type { Dispatch, SetStateAction } from 'react';

export interface AlertDialogProps {
  isOpen: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  setDelete: Dispatch<SetStateAction<boolean>>;
}

export default function AlertDialog(props: AlertDialogProps) {

  const confirmDelete = () => {
    props.setOpen(false);
    props.setDelete(true);
  }

  const handleClose = () => {
    props.setOpen(false);
    props.setDelete(false);
  };

  return (
    <>
      <Dialog
        open={props.isOpen}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Delete this construct?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this construct?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={confirmDelete}>Delete</Button>
          <Button onClick={handleClose} autoFocus>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}