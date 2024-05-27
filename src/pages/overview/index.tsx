import { type NextPage } from "next";
import OverviewMap from "@chronistic/components/overview-map"
import Timeline from "@chronistic/components/timeline";
import ResponsiveAppBar from "@chronistic/components/responsive-app-bar";

const Overview: NextPage = () => {
//   const hello = api.example.hello.useQuery({ text: "from tRPC" });

  return (
    <div className="min-h-screen bg-slate-700">
      <div className="flex flex-col">
        <ResponsiveAppBar />
        <OverviewMap />
        <Timeline />
      </div>
    </div>
  );
}

export default Overview;