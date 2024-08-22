"use client";
import * as React from 'react';
import { Suspense, useState, useEffect, type Dispatch, type SetStateAction } from "react";
import { DialogActions, DialogContent, DialogTitle, Divider, TextField, Typography, Button, Dialog } from "@mui/material";
import { useConstructContext } from '../providers/construct-store-provider'
import { api } from "../utils/api";
import { mapFromApi } from '@chronistic/stores/construct';

export interface ModalOpenProps {
  isOpen: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export default function ConstructOverview(props: ModalOpenProps) {
  const mutateDescription = api.construct.descriptionPatch.useMutation();
  const [tempDescription, setTempDescription] = useState("");
  const activeConstruct = useConstructContext((state) => state.activeConstruct)
  const setConstruct = useConstructContext((state) => state.setConstruct)
  
  useEffect(() => {
    if (activeConstruct) {
      setTempDescription(activeConstruct.description);
    }
  }, [activeConstruct?.id]);

  useEffect(() => {
    async function asyncMutate() {
      if (!activeConstruct) { return; }
      return await mutateDescription.mutateAsync(
        {
          id: activeConstruct.id,
          description: tempDescription
        });
    }

    const timeout = setTimeout(() => {
      asyncMutate().then(r => {if(activeConstruct && r) {setConstruct(activeConstruct?.id, mapFromApi(r))}}).catch(console.error);
    }, 300);
    
    // If the hook is called again, cancel the previous timeout
    // This creates a debounce instead of a delay
    return () => clearTimeout(timeout);
    },
    // Run the hook every time the user makes a keystroke
    [tempDescription]
  );

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
          <Suspense fallback={<p>Loading...</p>}>
            <DialogTitle id="scroll-dialog-title">
              <Typography id="construct-overview-modal-title" variant="h5" component="h2">Construct Overview - {activeConstruct?.name}</Typography>
            </DialogTitle>
            <DialogContent dividers={true}>
              <div id="construct-overview-modal-content">
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
                      <TextField
                        id="standard-multiline-static"
                        multiline
                        fullWidth
                        rows={10}
                        variant="standard"
                        value={tempDescription}
                        onChange={({ target }) => setTempDescription(target.value)}
                      />
                    </p>
                  </span>

                  <Divider className="ml-10 mr-10" flexItem orientation="vertical"/>

                  <span className="flex grow shrink basis-1/2 flex-col">
                    <Typography variant="h6">Associated Entities</Typography>
                    <ul>
                      <li>Construct 1</li>
                      <li>Construct 2</li>
                      <li>Construct 3</li>
                      <li>Construct 4</li>
                      <li>Construct 5</li>
                      <li>Construct 6</li>
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
