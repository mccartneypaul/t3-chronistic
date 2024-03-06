// import { useState } from 'react';
// import Button from '@mui/material/Button';
// import Dialog from '@mui/material/Dialog';
// import DialogActions from '@mui/material/DialogActions';
// import DialogContent from '@mui/material/DialogContent';
// import DialogContentText from '@mui/material/DialogContentText';
// import DialogTitle from '@mui/material/DialogTitle';
// import { styled } from '@mui/material/styles';

// const DraggableDiv = styled('div')(({ top, left, width, height }) => ({
//     position: 'absolute',
//     top: `${top}px`,
//     left: `${left}px`,
//     width: `${width}px`,
//     height: `${height}px`,
//   }));

// export default function EventIcon({ top, left, width, height }) {
//     const [open, setOpen] = useState(false);
//     const [name, setName] = useState('test');
//     const [animal, setAnimal] = useState('test armidillo');

//     const handleClickOpen = () => {
//         setOpen(true);
//     };

//     const handleClose = () => {
//         setOpen(false);
//     };

//     return (
//         <>
//         <DraggableDiv top={top} left={left} width={width} height={height}>
//             <Button onClick={handleClickOpen}>
//             <HomeIcon />
//             </Button>
//         </DraggableDiv>
//         <Dialog open={open} onClose={handleClose}>
//             <DialogTitle>Event Overview</DialogTitle>
//             <DialogContent>
//             <DialogContentText>
//                 Name: {name}
//             </DialogContentText>
//             <DialogContentText>
//                 Animal: {animal}
//             </DialogContentText>
//             </DialogContent>
//             <DialogActions>
//             <Button onClick={handleClose}>Close</Button>
//             </DialogActions>
//         </Dialog>
//         </>
//     );
// }