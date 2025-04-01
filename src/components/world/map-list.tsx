import Box from "@mui/material/Box";
import React from "react";
import MapIcon from "./map-icon";
import { api } from "@chronistic/utils/api";

export default function MapList() {
  const worldId = "myworldscuidwowowow";
  const { data } = api.map.getByWorld.useQuery(worldId);

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
      {data &&
        data.map((card) => (
          <MapIcon
            key={card.id}
            id={String(card.id)}
            name={card.name}
            filePath={card.filePath}
          />
        ))}
    </Box>
  );
}
