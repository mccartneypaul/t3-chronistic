import Image from 'next/image'
import EventIcon from './event-icon';
import EventOverview from './event-overview';
import React from 'react';

const mapImage = "/TestWorldMap.png"

function OverviewMap() {
    const [isOpen, setOpen] = React.useState(false);

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
            <EventOverview isOpen={isOpen} setOpen={setOpen}/ >
            <EventIcon initialPosition={{x: 450, y:650}} setOpen={setOpen} />
        </>
    );
}

export default OverviewMap;
