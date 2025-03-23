import Box from "@mui/material/Box";
import React from "react";
import MapIcon from "./map-icon";

const cards = [
  {
    id: "totesacuid",
    title: "Plants",
    description: "Plants are essential for all life.",
    imageUrl: "middleearth.jpg",
  },
  {
    id: 2,
    title: "Animals",
    description: "Animals are a part of nature.",
    imageUrl: "TestWorldMap.png",
  },
  {
    id: 3,
    title: "Humans",
    description: "Humans depend on plants and animals for survival.",
    imageUrl: "",
  },
];

export default function MapList() {
  // const [selectedCard, setSelectedCard] = React.useState(0);
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
      {cards.map((card, index) => (
        <MapIcon
          key={card.id}
          id={String(card.id)}
          name={card.title}
          description={card.description}
          imageUrl={card.imageUrl}
        />
      ))}
    </Box>
  );
}
