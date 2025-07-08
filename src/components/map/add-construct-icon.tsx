import { Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { api } from "@chronistic/utils/api";
import { useConstructContext } from "@chronistic/providers/construct-store-provider";
import { usePositionContext } from "@chronistic/providers/position-store-provider";
import { ApiPosition, mapFromApi } from "@chronistic/stores/position";

export function AddConstructIcon() {
  const createConstruct = api.construct.createConstruct.useMutation();
  const addConstruct = useConstructContext((state) => state.addConstruct);
  const createPosition = api.position.createPosition.useMutation();
  const addPosition = usePositionContext((state) => state.addPosition);
  const timelinePosition = usePositionContext(
    (state) => state.timelinePosition,
  );
  const activeMapId = useConstructContext((state) => state.activeMapId);

  const handleIconClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const { clientX, clientY } = event;

    const newConstruct = {
      name: "New Construct",
      description: "New Construct Description",
      mapId: activeMapId,
      posX: clientX + 15,
      posY: clientY + 15,
    };
    console.log(newConstruct);

    // Create a new construct and add it to the store
    createConstruct
      .mutateAsync({ data: newConstruct })
      .then((r) => {
        if (r) {
          addConstruct(r);
          // Create a new position for that construct and add it to the store
          createMyPosition(r.id, clientX, clientY);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const createMyPosition = (
    constructId: string,
    clientX: number,
    clientY: number,
  ) => {
    const newPosition = {
      constructId: constructId,
      mapId: activeMapId,
      posX: clientX + 15,
      posY: clientY + 15,
      intervalFromBeginning: timelinePosition.toISOString(),
    };

    createPosition
      .mutateAsync({ data: newPosition })
      .then((r: ApiPosition) => {
        if (r) {
          addPosition(mapFromApi(r));
        }
      })
      .catch((error) => {
        console.error("Error creating position:", error);
      });
  };

  return (
    <>
      <Fab color="primary" aria-label="add construct" onClick={handleIconClick}>
        <AddIcon />
      </Fab>
    </>
  );
}
