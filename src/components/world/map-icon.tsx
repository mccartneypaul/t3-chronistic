import { CardActionArea, CardMedia, Typography } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

export interface MapIconProps {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
}

export default function MapIcon(props: MapIconProps) {
  return (
    <Card key={props.id}>
      <CardActionArea
        sx={{
          height: "100%",
          "&[data-active]": {
            backgroundColor: "action.selected",
            "&:hover": {
              backgroundColor: "action.selectedHover",
            },
          },
        }}
      >
        <CardMedia
          component="img"
          height="140"
          image={props.imageUrl}
          alt="Map Image"
        />
        <CardContent sx={{ height: "100%" }}>
          <Typography variant="h5" component="div">
            {props.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {props.description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
