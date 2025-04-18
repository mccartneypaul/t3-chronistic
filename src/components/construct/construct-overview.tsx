"use client";
import * as React from "react";
import {
  Suspense,
  useState,
  useEffect,
  type Dispatch,
  type SetStateAction,
} from "react";
import {
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  TextField,
  Typography,
  Button,
  Dialog,
  IconButton,
} from "@mui/material";
import { useConstructContext } from "@chronistic/providers/construct-store-provider";
import { api } from "@chronistic/utils/api";
import { mapFromApi } from "@chronistic/stores/construct";
import DeleteIcon from "@mui/icons-material/Delete";
import AlertDialog from "@chronistic/components/alert-dialog";

export interface ModalOpenProps {
  isOpen: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export default function ConstructOverview(props: ModalOpenProps) {
  const mutateDescription = api.construct.patchDescription.useMutation();
  const deleteConstruct = api.construct.deleteConstruct.useMutation();
  const mutateName = api.construct.patchName.useMutation();
  const [tempDescription, setTempDescription] = useState("");
  const [tempName, setTempName] = useState("");
  const [isAlertOpen, setAlertOpen] = React.useState(false);
  const [isOkToDelete, setOkToDelete] = React.useState(false);
  const activeConstruct = useConstructContext((state) => state.activeConstruct);
  const setConstruct = useConstructContext((state) => state.setConstruct);
  const removeConstruct = useConstructContext((state) => state.removeConstruct);

  // Initialize temp values with active construct values
  useEffect(() => {
    if (activeConstruct) {
      setTempDescription(activeConstruct.description);
      setTempName(activeConstruct.name);
    }
  }, [activeConstruct?.id]);

  useEffect(() => {
    if (activeConstruct && isOkToDelete) {
      deleteConstruct
        .mutateAsync(activeConstruct.id)
        .then(() => {
          removeConstruct(activeConstruct.id);
        })
        .catch((error) => {
          console.error(error);
        });
      setOkToDelete(false);
      props.setOpen(false);
    }
  }, [isOkToDelete]);

  useEffect(() => {
    async function asyncMutate() {
      if (!activeConstruct) {
        return;
      }
      return await mutateDescription.mutateAsync({
        id: activeConstruct.id,
        description: tempDescription,
      });
    }

    const timeout = setTimeout(() => {
      asyncMutate()
        .then((r) => {
          if (activeConstruct && r) {
            setConstruct(activeConstruct?.id, mapFromApi(r));
          }
        })
        .catch(console.error);
    }, 300);

    return () => clearTimeout(timeout);
  }, [tempDescription]);

  useEffect(() => {
    async function asyncMutate() {
      if (!activeConstruct) {
        return;
      }
      return await mutateName.mutateAsync({
        id: activeConstruct.id,
        name: tempName,
      });
    }

    const timeout = setTimeout(() => {
      asyncMutate()
        .then((r) => {
          if (activeConstruct && r) {
            setConstruct(activeConstruct?.id, mapFromApi(r));
          }
        })
        .catch(console.error);
    }, 300);

    return () => clearTimeout(timeout);
  }, [tempName]);

  return (
    <>
      <Dialog
        open={props.isOpen}
        scroll="paper"
        onClose={() => props.setOpen(false)}
        aria-labelledby="child-modal-title"
        className="max-w-750 min-w-500"
        fullWidth={true}
        maxWidth="md"
      >
        <Suspense fallback={<p>Loading...</p>}>
          <DialogTitle
            id="scroll-dialog-title"
            component="div"
            sx={{ paddingBottom: "5px" }}
          >
            <div className="flex flex-row justify-between">
              <div className="flex flex-row">
                <div className="mr-2">
                  <Typography
                    id="construct-overview-modal-title"
                    variant="h5"
                    component="h2"
                  >
                    Construct Overview -
                  </Typography>
                </div>
                <TextField
                  id="title-edit"
                  variant="standard"
                  size="small"
                  value={tempName}
                  sx={{ marginLeft: "5", marginTop: "-5" }}
                  inputProps={{ style: { fontSize: "1.5rem" } }}
                  onChange={({ target }) => setTempName(target.value)}
                />
              </div>
              <IconButton
                color="warning"
                onClick={() => {
                  setAlertOpen(true);
                }}
              >
                <DeleteIcon />
              </IconButton>
            </div>
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

              <Divider variant="middle" className="mt-2" />

              <div className="flex flex-row justify-between">
                <span className="flex shrink grow basis-1/2 flex-col">
                  <Typography variant="h6">Description</Typography>
                  <div>
                    <TextField
                      id="standard-multiline-static"
                      multiline
                      fullWidth
                      rows={10}
                      variant="standard"
                      value={tempDescription}
                      onChange={({ target }) =>
                        setTempDescription(target.value)
                      }
                    />
                  </div>
                </span>

                <Divider
                  className="mr-10 ml-10"
                  flexItem
                  orientation="vertical"
                />

                <span className="flex shrink grow basis-1/2 flex-col">
                  <Typography variant="h6">Associated Entities</Typography>
                  <ul>
                    <li>Construct 1</li>
                    <li>Construct 2</li>
                    <li>Construct 3</li>
                    <li>Construct 4</li>
                    <li>Construct 5</li>
                    <li>Construct 6</li>
                  </ul>
                  <Button
                    variant="contained"
                    className="mb-2 self-start"
                    color="primary"
                  >
                    Add Entity
                  </Button>
                </span>
              </div>
            </div>
          </DialogContent>
          <DialogActions className="flex flex-row justify-between pr-3 pb-3 pl-3">
            <Button variant="contained" color="primary">
              Picture File Notes
            </Button>
            <Button variant="contained" color="primary">
              Location Data
            </Button>
          </DialogActions>
        </Suspense>
      </Dialog>
      <AlertDialog
        isOpen={isAlertOpen}
        setOpen={setAlertOpen}
        setDelete={setOkToDelete}
      />
    </>
  );
}
