import { ConstructStoreProvider } from "@chronistic/providers/construct-store-provider";
import { MapStoreProvider } from "@chronistic/providers/map-store-provider";
import { PositionStoreProvider } from "@chronistic/providers/position-store-provider";
import { ImageStoreProvider } from "./image-store-provider";

// Utility function to compose multiple providers
function composeProviders(
  ...providers: Array<React.ComponentType<{ children: React.ReactNode }>>
) {
  return providers.reduce(
    (AccumulatedProviders, CurrentProvider) => {
      const ComposedProvider = ({
        children,
      }: {
        children: React.ReactNode;
      }) => (
        <AccumulatedProviders>
          <CurrentProvider>{children}</CurrentProvider>
        </AccumulatedProviders>
      );
      ComposedProvider.displayName = `Composed(${CurrentProvider.displayName || CurrentProvider.name || "Component"})`;
      return ComposedProvider;
    },
    ({ children }: { children: React.ReactNode }) => <>{children}</>,
  );
}

export const MainProvider = composeProviders(
  PositionStoreProvider,
  ConstructStoreProvider,
  MapStoreProvider,
  ImageStoreProvider,
);
