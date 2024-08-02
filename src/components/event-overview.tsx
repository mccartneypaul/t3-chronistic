"use client";
import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import type { Dispatch, SetStateAction } from "react";
import { DialogActions, DialogContent, DialogTitle, Divider, Typography } from "@mui/material";

export interface ModalOpenProps {
  isOpen: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export default function EventOverview(props: ModalOpenProps) {

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
          <DialogTitle id="scroll-dialog-title">
            <Typography id="event-overview-modal-title" variant="h5" component="h2">Event Overview </Typography>
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
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc nisi urna, aliquam nec bibendum eu, ornare a leo. Maecenas facilisis nisi quis posuere euismod. Pellentesque urna arcu, congue vitae nisl eu, tincidunt suscipit quam. Phasellus eget velit ante. In eu nulla ac purus iaculis commodo. Suspendisse ultrices ut sem nec euismod. Donec efficitur eros eu sollicitudin luctus. Nulla porta efficitur elit, et luctus turpis gravida dapibus.
                    Maecenas pharetra magna nunc, vel consectetur odio aliquam ac. Cras auctor purus a enim luctus suscipit. Aliquam ultricies, libero at iaculis iaculis, nibh est hendrerit purus, id dignissim neque magna ut ligula. Vestibulum sit amet velit porta nisi ultrices condimentum ac quis augue. Nam id nibh viverra, euismod nunc a, iaculis mi. Curabitur auctor, ex eget interdum imperdiet, ipsum ligula mattis nisl, et venenatis ex purus pretium eros. Nulla sagittis pulvinar maximus.
                  </p>
                  <Button variant="contained" className="self-end mb-2" color="primary">Edit</Button>
                </span>

                <Divider className="ml-10 mr-10" flexItem orientation="vertical"/>

                <span className="flex grow shrink basis-1/2 flex-col">
                  <Typography variant="h6">Associated Entities</Typography>
                  <p>Event 1</p>
                  <p>Event 2</p>
                  <p>Event 3</p>
                  <p>Event 4</p>
                  <p>Event 5</p>
                  <p>Event 6</p>
                  <Button variant="contained" className="self-start mb-2" color="primary">Add Entity</Button>
                </span>
              </div>
            </div>
          </DialogContent>
          <DialogActions className="flex flex-row justify-between pl-3 pr-3 pb-3">
            <Button variant="contained" color="primary">Picture File Notes</Button>
            <Button variant="contained" color="primary">Location Data</Button>
          </DialogActions>
        </Dialog>
    </>
  );
}
