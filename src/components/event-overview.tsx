"use client";
import {useSearchParams, usePathname} from "next/navigation";
import Link from "next/link";
import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import type { Dispatch, SetStateAction } from "react";
import { Divider, Typography } from "@mui/material";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  minWidth: '500px',
  maxWidth: '750px',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

export interface ModalOpenProps {
  isOpen: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export default function EventOverview(props: ModalOpenProps) {

  return (
    <>
        <Modal
          open={props.isOpen}
          onClose={() => props.setOpen(false)}
          aria-labelledby="child-modal-title"
        >
          <Box sx={{ ...style}}>
            <Typography id="event-overview-modal-title" variant="h5" component="h2">
              Event Overview
            </Typography>
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

              <Divider variant="middle" className="mb-2"/>

              <div className="flex flex-row justify-between">
                <Button variant="contained" color="primary">Picture File Notes</Button>
                <Button variant="contained" color="primary">Location Data</Button>
              </div>

            </div>
          </Box>
        </Modal>
    </>
  );
}
