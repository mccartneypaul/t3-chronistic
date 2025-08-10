"use client";
import * as React from "react";
import { Suspense } from "react";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Typography from "@mui/material/Typography";
import { DataGrid } from "@mui/x-data-grid";
import { GridColDef } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import { api } from "@chronistic/utils/api";
import DeleteIcon from "@mui/icons-material/Delete";
import { usePositionContext } from "@chronistic/providers/position-store-provider";

export default function PositionDataModal() {
  // const [tempDescription, setTempDescription] = useState("");
  // const [tempName, setTempName] = useState("");
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const columns: GridColDef<(typeof rows)[number]>[] = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "firstName",
      headerName: "First name",
      width: 150,
      editable: true,
    },
    {
      field: "lastName",
      headerName: "Last name",
      width: 150,
      editable: true,
    },
    {
      field: "age",
      headerName: "Age",
      type: "number",
      width: 110,
      editable: true,
    },
    {
      field: "fullName",
      headerName: "Full name",
      description: "This column has a value getter and is not sortable.",
      sortable: false,
      width: 160,
      valueGetter: (value, row) =>
        `${row.firstName || ""} ${row.lastName || ""}`,
    },
  ];

  const rows = [
    { id: 1, lastName: "Snow", firstName: "Jon", age: 14 },
    { id: 2, lastName: "Lannister", firstName: "Cersei", age: 31 },
    { id: 3, lastName: "Lannister", firstName: "Jaime", age: 31 },
    { id: 4, lastName: "Stark", firstName: "Arya", age: 11 },
    { id: 5, lastName: "Targaryen", firstName: "Daenerys", age: null },
    { id: 6, lastName: "Melisandre", firstName: null, age: 150 },
    { id: 7, lastName: "Clifford", firstName: "Ferrara", age: 44 },
    { id: 8, lastName: "Frances", firstName: "Rossini", age: 36 },
    { id: 9, lastName: "Roxie", firstName: "Harvey", age: 65 },
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
              Construct Life
            </Typography>
          </DialogTitle>
          <DialogContent dividers={true}>
            <Box sx={{ height: 400, width: "100%" }}>
              <DataGrid
                rows={rows}
                columns={columns}
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: 5,
                    },
                  },
                }}
                pageSizeOptions={[5]}
                checkboxSelection
                disableRowSelectionOnClick
              />
            </Box>
          </DialogContent>
          <DialogActions className="flex flex-row justify-between pr-3 pb-3 pl-3"></DialogActions>
        </Suspense>
      </Dialog>
    </>
  );
}
