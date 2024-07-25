"use client";
import {useSearchParams, usePathname} from "next/navigation";
import Link from "next/link";
import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import type { modalOpenProps } from "./overview-map";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

export default function EventOverview(props: modalOpenProps) {

  return (
    <>
        <Modal
          open={props.isOpen}
          onClose={() => props.setOpen(false)}
          aria-labelledby="child-modal-title"
          aria-describedby="child-modal-description"
        >
          <Box sx={{ ...style, width: 200 }}>
            <h2 id="child-modal-title">Text in a child modal</h2>
            <p id="child-modal-description">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit.
            </p>
            <Button onClick={() => props.setOpen(false)}>Close Child Modal</Button>
          </Box>
        </Modal>
    </>
  );
}
