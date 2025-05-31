import { api } from "@chronistic/utils/api";
import {
  CardActionArea,
  CardActions,
  CardMedia,
  IconButton,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

export interface MapIconProps {
  id: string;
  name: string;
  description?: string;
  filePath: string;
}

export default function MapIcon(props: MapIconProps) {
  const { data: mapImage } = api.s3.getByKey.useQuery(props.filePath);
  const deleteMap = api.map.deleteMap.useMutation();
  const deleteMapImage = api.s3.deleteByKey.useMutation();

  const handleDeleteClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    // TODO: Implement confirmation dialog before deletion
    deleteMapImage.mutateAsync(props.filePath).catch((error) => {
      console.error(error);
    });
    deleteMap
      .mutateAsync(props.id)
      .then((resp) => {
        if (resp) {
          // TODO: remove the map from the store or state
          // addConstruct(r);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <Card key={props.id}>
      <CardActionArea
        href={`/overview/${props.id}`}
        sx={{
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
          image={`data:${mapImage?.fileType};base64,${Buffer.from(mapImage?.u8Stream ?? []).toString("base64")}`}
          alt="Map Image"
        />
        <CardContent>
          <Typography variant="h5" component="div">
            {props.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {props.description}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions disableSpacing>
        <IconButton aria-label="Rename this map">
          <EditIcon />
        </IconButton>
        <IconButton aria-label="Delete this map" onClick={handleDeleteClick}>
          <DeleteIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
}
