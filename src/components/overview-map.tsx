import Image from 'next/image'
import ConstructIcon from './construct-icon';
import ConstructOverview from './construct-overview';
import React, { Suspense, useContext, useEffect } from 'react';
import { useConstructContext } from '@chronistic/providers/construct-store-provider'

const mapImage = "/TestWorldMap.png"

interface OverviewMapProps {
  mapId: string;
}

function OverviewMap({mapId}: OverviewMapProps) {
  const [isOpen, setOpen] = React.useState(false);
  const constructs = useConstructContext((state) => state.constructs)
  const activeConstruct = useConstructContext((state) => state.activeConstruct)

  useEffect(() => {
    console.log('OverviewMap re-rendered with constructs:', constructs);
  }, [constructs]);

  return (
    <>
      <div className="relative aspect-auto h-[37vw]">
        <Image
        className="object-contain"
        src={mapImage}
        alt="map"
        quality="100"
        fill
        />
      </div>
      {activeConstruct && <ConstructOverview isOpen={isOpen} setOpen={setOpen}/ >}


      {/* This is causing an issue right now where it will replace the data that the child is trying to modify */}
      {/* Need to modify this so that it uses a context somehow to keep track of the constructs. */}
      {/* Also, needs to go back and modify that construct in the list of constructs... */}
      {constructs.map((construct) => (
        <ConstructIcon
        key={construct.id}
        initialPosition={{x: construct.posX, y:construct.posY}}
        setOpen={setOpen}
        constructId={construct.id}
        />
      ))}
    </>
  );
}

export default OverviewMap;
