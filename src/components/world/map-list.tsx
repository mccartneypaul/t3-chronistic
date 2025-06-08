import Box from "@mui/material/Box";
import React from "react";
import MapIcon from "./map-icon";
import { api } from "@chronistic/utils/api";
import Dropzone from "../drop-zone";

export default function MapList() {
  const { data: worldData } = api.world.getByUser.useQuery();
  const { data: mapData } = api.map.getByWorld.useQuery(worldData?.id ?? "");

  // TODO: make the maps pull from the store so that they get updated when a new map is added

  return (
    <Box
      sx={{
        width: "100%",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(min(250px, 100%), 1fr))",
        gap: 2,
        p: 2,
      }}
    >
      {worldData &&
        mapData &&
        mapData.map((card) => (
          <MapIcon
            key={card.id}
            id={String(card.id)}
            name={card.name}
            filePath={card.filePath}
          />
        ))}
      {worldData && <Dropzone worldId={worldData.id} />}
    </Box>
  );
}
