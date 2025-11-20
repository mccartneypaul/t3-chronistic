import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import React from "react";
import { api } from "@chronistic/utils/api";

import "@chronistic/styles/globals.css";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";
import { MainProvider } from "@chronistic/providers/main-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

dayjs.extend(duration);
dayjs.extend(relativeTime);

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  // Need to do this for material to work properly probably???
  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement?.removeChild(jssStyles);
    }
  }, []);

  return (
    <MainProvider>
      <QueryClientProvider client={queryClient}>
        <SessionProvider session={session}>
          <Component {...pageProps} />
        </SessionProvider>
      </QueryClientProvider>
    </MainProvider>
  );
};

export default api.withTRPC(MyApp);
