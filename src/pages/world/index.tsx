import ResponsiveAppBar from "@chronistic/components/responsive-app-bar";
import MapList from "@chronistic/components/world/map-list";
import { useMapContext } from "@chronistic/providers/map-store-provider";
import { mapFromApi } from "@chronistic/stores/map";
import { api } from "@chronistic/utils/api";
import { useEffect } from "react";

export default function World() {
  const { data: mapData } = api.map.getByUser.useQuery();

  const { setMaps } = useMapContext((state) => ({
    setMaps: state.setMaps,
  }));

  useEffect(() => {
    const mapped = mapData?.map((map) => mapFromApi(map)) ?? [];
    setMaps(mapped);
  }, [mapData]);

  return (
    <>
      <div className="min-h-screen bg-slate-700">
        <ResponsiveAppBar />
        <MapList />
      </div>
    </>
  );
}
