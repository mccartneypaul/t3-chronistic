import Timeline from "@chronistic/components/map/timeline";
import ResponsiveAppBar from "@chronistic/components/responsive-app-bar";
import { useConstructContext } from "@chronistic/providers/construct-store-provider";
import { api } from "@chronistic/utils/api";
import { mapFromApi } from "@chronistic/stores/construct";
import OverviewMap from "@chronistic/components/map/overview-map";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Overview() {
  const router = useRouter();
  const mapId = typeof router.query.id === "string" ? router.query.id : "";
  // const mapData = {
  //   filePath: "/images/maps/overview.png",
  // };
  const { data: mapData } = api.map.getById.useQuery(mapId);
  const { data: constructData } = api.construct.getByMap.useQuery(mapId);

  const { setMapConstructs } = useConstructContext((state) => ({
    setMapConstructs: state.setMapConstructs,
  }));

  useEffect(() => {
    const mappedConstructs =
      constructData?.map((construct) => mapFromApi(construct)) ?? [];
    setMapConstructs(mapId, mappedConstructs);
  }, [constructData]);

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
