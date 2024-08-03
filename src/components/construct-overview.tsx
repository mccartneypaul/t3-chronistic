"use client";
import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { Suspense, type Dispatch, type SetStateAction } from "react";
import { DialogActions, DialogContent, DialogTitle, Divider, Typography } from "@mui/material";
import type { Construct } from '@prisma/client';

export interface ModalOpenProps {
  isOpen: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  getConstruct: Construct;
  setConstruct: Dispatch<SetStateAction<Construct>>;
}

export default function EventOverview(props: ModalOpenProps) {
  const construct = props.getConstruct;

  return (
    <>
        <Dialog
          open={props.isOpen}
          scroll="paper"
          onClose={() => props.setOpen(false)}
          aria-labelledby="child-modal-title"
          className="min-w-500 max-w-750"
          fullWidth={true}
          maxWidth="md"
        >
          <Suspense fallback={<p>Loading feed...</p>}>
            <DialogTitle id="scroll-dialog-title">
              <Typography id="event-overview-modal-title" variant="h5" component="h2">Event Overview - {construct.name}</Typography>
            </DialogTitle>
            <DialogContent dividers={true}>
              <div id="event-overview-modal-content">
                <div className="flex flex-row justify-between">
                  <span>
                    <div>Time/Date</div>
                    <div>Beginning</div>
                  </span>
                  <span>
                    <div>Time/Date</div>
                    <div>End</div>
                  </span>
                </div>
                
                <Divider variant="middle" className="mt-2"/>

                <div className="flex flex-row justify-between">
                  <span className="flex grow shrink basis-1/2 flex-col">
                    <Typography variant="h6">Description</Typography>
                    <p>
                      {construct.description}
                    </p>
                    <Button variant="contained" className="self-end mb-2" color="primary">Edit</Button>
                  </span>

                  <Divider className="ml-10 mr-10" flexItem orientation="vertical"/>

                  <span className="flex grow shrink basis-1/2 flex-col">
                    <Typography variant="h6">Associated Entities</Typography>
                    <ul>
                      <li>Event 1</li>
                      <li>Event 2</li>
                      <li>Event 3</li>
                      <li>Event 4</li>
                      <li>Event 5</li>
                      <li>Event 6</li>
                    </ul>
                    <Button variant="contained" className="self-start mb-2" color="primary">Add Entity</Button>
                  </span>
                </div>
              </div>
            </DialogContent>
            <DialogActions className="flex flex-row justify-between pl-3 pr-3 pb-3">
              <Button variant="contained" color="primary">Picture File Notes</Button>
              <Button variant="contained" color="primary">Location Data</Button>
            </DialogActions>
          </Suspense>
        </Dialog>
    </>
  );
}
