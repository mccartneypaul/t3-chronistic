import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useModal } from '../contexts/modal-context';

export default function EventOverview() {
  const { isModalOpen, closeModal } = useModal();

  return (
    <Dialog
    open={isModalOpen}
    onClose={closeModal}
    PaperProps={{
        component: 'form',
        onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        closeModal();
        },
    }}
    >
    <DialogTitle>Subscribe</DialogTitle>
    <DialogContent>
        <DialogContentText>
        To subscribe to this website, please enter your email address here. We
        will send updates occasionally.
        </DialogContentText>
        <TextField
        autoFocus
        required
        margin="dense"
        id="name"
        name="email"
        label="Email Address"
        type="email"
        fullWidth
        variant="standard"
        />
    </DialogContent>
    <DialogActions>
        <Button onClick={closeModal}>Cancel</Button>
        <Button type="submit">Subscribe</Button>
    </DialogActions>
    </Dialog>
  );
}