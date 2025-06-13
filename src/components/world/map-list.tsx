import Box from "@mui/material/Box";
import React, { Suspense, useEffect, useState } from "react";
import MapIcon from "./map-icon";
import { api } from "@chronistic/utils/api";
import Dropzone from "../drop-zone";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Form from "next/form";
import Typography from "@mui/material/Typography";
import { useMapContext } from "@chronistic/providers/map-store-provider";

export default function MapList() {
  const [worldId, setWorldId] = useState("");
  const { data: worldData } = api.world.getByUser.useQuery();

  const createWorld = api.world.createWorld.useMutation();
  async function createWorldFromFormData(formData: FormData) {
    const worldName = formData.get("worldName") as string;
    const resp = await createWorld.mutateAsync({ data: { name: worldName } });
    setWorldId(resp.id);
  }

  const storeMaps = useMapContext((state) => state.maps);

  // useEffect(() => {
  //   console.log("OverviewMap re-rendered with constructs:", storeMaps);
  // }, [storeMaps]);

  // console.log("World id: ", worldId);

  useEffect(() => {
    if (worldData) {
      setWorldId(worldData.id);
    }
  }, [worldData]);

  // TODO: make the maps pull from the store so that they get updated when a new map is added

  return (
    <Suspense fallback={<p>Loading...</p>}>
      {!worldId && (
        <Box
          sx={{
            minHeight: "80vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 4,
          }}
        >
          <div className="object-center">
            <Typography
              variant="h6"
              noWrap
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
                fontFamily: "monospace",
                fontWeight: 700,
                color: "white",
                textDecoration: "none",
              }}
            >
              You don&apos;t have a world yet. Create one to get started with
              Chronistic.
            </Typography>
            <Form
              action={createWorldFromFormData}
              className="flex flex-row justify-center gap-4 rounded-lg bg-white p-4"
            >
              <TextField
                required
                id="worldNameBox"
                label="Required"
                placeholder="World Name"
                name="worldName"
              />
              <Button variant="contained" type="submit">
                Create
              </Button>
            </Form>
          </div>
        </Box>
      )}
      <Box
        sx={{
          width: "100%",
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fill, minmax(min(250px, 100%), 1fr))",
          gap: 2,
          p: 2,
        }}
      >
        {worldId &&
          storeMaps.map((card) => (
            <MapIcon
              key={card.id}
              id={String(card.id)}
              name={card.name}
              filePath={card.filePath}
            />
          ))}
        {worldId && <Dropzone worldId={worldId} />}
      </Box>
    </Suspense>
  );
}
