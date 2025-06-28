import { Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { api } from "@chronistic/utils/api";
import { useConstructContext } from "@chronistic/providers/construct-store-provider";

export function AddConstructIcon() {
  const createConstruct = api.construct.createConstruct.useMutation();
  const addConstruct = useConstructContext((state) => state.addConstruct);
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

    createConstruct
      .mutateAsync({ data: newConstruct })
      .then((r) => {
        if (r) {
          addConstruct(r);
        }
      })
      .catch((error) => {
        console.error(error);
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
