import { type NextPage } from "next";
import OverviewMap from "@chronistic/components/overview-map"
import Timeline from "@chronistic/components/timeline";

const Overview: NextPage = () => {
//   const hello = api.example.hello.useQuery({ text: "from tRPC" });

  return (
    <div className="bg-slate-800 h-screen">
      <div className="flex flex-col">
        <OverviewMap />
        <Timeline />
      </div>
    </div>
  );
}

export default Overview;