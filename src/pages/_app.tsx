import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import React from "react";
import { api } from "@chronistic/utils/api";

import "@chronistic/styles/globals.css";
import { ConstructStoreProvider } from "@chronistic/providers/construct-store-provider";

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
    <ConstructStoreProvider>
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
    </ConstructStoreProvider>
  );
};

export default api.withTRPC(MyApp);
