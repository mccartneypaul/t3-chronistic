import Timeline from "@chronistic/components/map/timeline";
import ResponsiveAppBar from "@chronistic/components/responsive-app-bar";
import { ConstructStoreProvider } from "@chronistic/providers/construct-store-provider";
import { api } from "@chronistic/utils/api";
import { mapFromApi, type StoreConstruct } from "@chronistic/stores/construct";
import OverviewMap from "@chronistic/components/map/overview-map";
import { Suspense, useEffect, useState, startTransition } from "react";
import { useRouter } from "next/router";

export default function Overview() {
  const router = useRouter();
  const mapId = typeof router.query.id === "string" ? router.query.id : "";
  // TODO: Get the map using the mapId and return the url here
  const mapUrl = "middleearth.jpg";
  const { data } = api.construct.getByMap.useQuery(mapId);
  const [constructs, setConstructs] = useState<StoreConstruct[] | undefined>(
    undefined
  );

  useEffect(() => {
    startTransition(() => {
      const mappedConstructs =
        data?.map((construct) => mapFromApi(construct)) ?? [];
      setConstructs(mappedConstructs);
    });
  }, [data]);

  return (
    <div className="min-h-screen bg-slate-700">
      <div className="flex flex-col">
        <Suspense fallback={<div>Loading...</div>}>
          {constructs != undefined ? (
            <ConstructStoreProvider activeMapId={mapId} constructs={constructs}>
              <ResponsiveAppBar />
              <OverviewMap mapUrl={mapUrl} />
              <Timeline />
            </ConstructStoreProvider>
          ) : (
            <div>Loading constructs...</div>
          )}
        </Suspense>
      </div>
    </div>
  );
}
