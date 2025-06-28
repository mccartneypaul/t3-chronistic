import Timeline from "@chronistic/components/map/timeline";
import ResponsiveAppBar from "@chronistic/components/responsive-app-bar";
import { useConstructContext } from "@chronistic/providers/construct-store-provider";
import { api } from "@chronistic/utils/api";
import { mapFromApi as mapConstruct } from "@chronistic/stores/construct";
import { mapFromApi as mapPosition } from "@chronistic/stores/position";
import OverviewMap from "@chronistic/components/map/overview-map";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { usePositionContext } from "@chronistic/providers/position-store-provider";

export default function Overview() {
  const router = useRouter();
  const mapId = typeof router.query.id === "string" ? router.query.id : "";
  // const mapData = {
  //   filePath: "/images/maps/overview.png",
  // };
  const { data: mapData } = api.map.getById.useQuery(mapId);
  const { data: constructData } = api.construct.getByMap.useQuery(mapId);
  const { data: positionData } = api.position.getByMap.useQuery(mapId);

  const { setMapConstructs } = useConstructContext((state) => ({
    setMapConstructs: state.setMapConstructs,
  }));
  const { setPositions } = usePositionContext((state) => ({
    setPositions: state.setPositions,
  }));

  useEffect(() => {
    const mappedConstructs =
      constructData?.map((construct) => mapConstruct(construct)) ?? [];
    setMapConstructs(mapId, mappedConstructs);
  }, [constructData]);
  useEffect(() => {
    const mappedPositions =
      positionData?.map((position) => mapPosition(position)) ?? [];
    setPositions(mappedPositions);
  }, [positionData]);

  return (
    <div className="min-h-screen bg-slate-700">
      <div className="flex flex-col">
        {mapData != undefined && (
          <>
            <ResponsiveAppBar />
            <OverviewMap mapUrl={mapData?.filePath} />
            <Timeline />
          </>
        )}
      </div>
    </div>
  );
}
