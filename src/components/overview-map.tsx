'use client'
import Image from 'next/image'
import EventIcon from './event-icon';
import EventOverview from './event-overview';
import React from 'react';
import { useRouter } from "next/router";
import { api } from "../utils/api";
import type { Construct, Prisma } from '@prisma/client';

const mapImage = "/TestWorldMap.png"

function OverviewMap() {
    const [isOpen, setOpen] = React.useState(false);
    const [getConstruct, setConstruct] = React.useState({} as Construct);
    const { query } = useRouter();
    const hardCodedMapId = "totesacuid"
    const constructQuery = api.construct.getByMap.useQuery(hardCodedMapId);

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
            <EventOverview isOpen={isOpen} setOpen={setOpen} getConstruct={getConstruct} setConstruct={setConstruct}/ >

            {constructQuery.data?.map((construct) => (
                <EventIcon
                key={construct.id}
                initialPosition={{x: construct.posX, y:construct.posY}}
                setOpen={setOpen}
                construct={construct}
                setConstruct={setConstruct}
                />
            ))}
        </>
    );
}

export default OverviewMap;
