import ResponsiveAppBar from "@chronistic/components/responsive-app-bar";
import MapList from "@chronistic/components/world/map-list";

export default function World() {
  return (
    <>
      <div className="min-h-screen bg-slate-700">
        <ResponsiveAppBar />
        <MapList />
      </div>
    </>
  );
}
