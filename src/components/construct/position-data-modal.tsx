"use client";
import * as React from "react";
import { Suspense } from "react";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Typography from "@mui/material/Typography";
import {
  DataGrid,
  GridActionsCellItem,
  GridRowId,
  GridRowModel,
} from "@mui/x-data-grid";
import { GridColDef } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import { api } from "@chronistic/utils/api";
import DeleteIcon from "@mui/icons-material/Delete";
import { usePositionContext } from "@chronistic/providers/position-store-provider";
import { useConstructContext } from "@chronistic/providers/construct-store-provider";
import dayjs from "dayjs";
import {
  mapToApi,
  mapFromApi,
  StorePosition,
} from "@chronistic/stores/position";

export default function PositionDataModal() {
  const activeConstruct = useConstructContext((state) => state.activeConstruct);
  const activeMapId = useConstructContext((state) => state.activeMapId);
  const allPositions = usePositionContext((state) => state.positions);
  const constructPositions = React.useMemo(
    () => allPositions.filter((p) => p.constructId === activeConstruct?.id),
    [allPositions, activeConstruct],
  );
  const addPosition = usePositionContext((state) => state.addPosition);
  const updateStorePosition = usePositionContext(
    (state) => state.updatePosition,
  );
  const removePosition = usePositionContext((state) => state.removePosition);
  const createPosition = api.position.createPosition.useMutation();
  const updatePosition = api.position.updatePosition.useMutation();
  const deletePosition = api.position.deletePosition.useMutation();

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleDeleteClick = (id: GridRowId) => () => {
    deletePosition.mutate(id as string);
    removePosition(id as string);
  };

  const addNewPosition = async () => {
    const maxInterval =
      constructPositions.length > 0
        ? Math.max(
            ...constructPositions.map(
              (p) => p.intervalFromBeginning.asSeconds() + 1,
            ),
          )
        : 0;

    const newPosition = {
      constructId: activeConstruct?.id ?? "",
      mapId: activeMapId ?? "",
      posX: 0,
      posY: 0,
      intervalFromBeginning: dayjs
        .duration(maxInterval, "seconds")
        .toISOString(),
    };
    const persistedPosition = await createPosition.mutateAsync({
      data: newPosition,
    });
    addPosition(mapFromApi(persistedPosition));
  };

  const processRowUpdate = (newRow: GridRowModel<StorePosition>) => {
    const updatedRow = { ...newRow, isNew: false };
    const apiRow = { data: mapToApi(updatedRow) };
    updatePosition.mutate(apiRow);
    updateStorePosition(updatedRow);
    return updatedRow;
  };

  const columns: GridColDef<(typeof constructPositions)[number]>[] = [
    {
      field: "posX",
      headerName: "Position X",
      type: "number",
      width: 150,
      editable: true,
    },
    {
      field: "posY",
      headerName: "Position Y",
      type: "number",
      width: 150,
      editable: true,
    },
    {
      field: "intervalFromBeginning",
      headerName: "Interval",
      valueGetter: (value, row) => {
        return row.intervalFromBeginning.asSeconds();
      },
      valueSetter: (value, row) => {
        return {
          ...row,
          intervalFromBeginning: dayjs.duration(value, "seconds"),
        };
      },
      type: "number",
      width: 110,
      editable: true,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      cellClassName: "actions",
      getActions: ({ id }) => {
        return [
          <GridActionsCellItem
            key={`delete-${id}`}
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  return (
    <>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Location Data
      </Button>
      <Dialog
        open={open}
        scroll="paper"
        onClose={handleClose}
        aria-labelledby="child-modal-title"
        className="max-w-500 min-w-250"
        fullWidth={true}
        maxWidth="md"
      >
        <Suspense fallback={<p>Loading...</p>}>
          <DialogTitle
            id="scroll-dialog-title"
            component="div"
            sx={{ paddingBottom: "5px" }}
          >
            <Typography
              id="position-data-modal-title"
              variant="h5"
              component="h2"
            >
              {activeConstruct?.name ?? ""} - Position Data
            </Typography>
          </DialogTitle>
          <DialogContent dividers={true}>
            <Box sx={{ height: 400, width: "100%" }}>
              <DataGrid
                rows={constructPositions}
                columns={columns}
                processRowUpdate={processRowUpdate}
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: 5,
                    },
                  },
                }}
                pageSizeOptions={[5]}
                disableRowSelectionOnClick
              />
            </Box>
          </DialogContent>
          <DialogActions className="flex flex-row justify-between pr-3 pb-3 pl-3">
            <Button onClick={addNewPosition}>Add Position</Button>
          </DialogActions>
        </Suspense>
      </Dialog>
    </>
  );
}
