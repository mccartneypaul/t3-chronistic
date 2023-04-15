import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

import { api } from "@chronistic/utils/api";
import OverviewMap from "@chronistic/components/overview-map"

const Overview: NextPage = () => {
//   const hello = api.example.hello.useQuery({ text: "from tRPC" });

  return (
    <>
        <OverviewMap></OverviewMap>
    </>
  );
}

export default Overview;