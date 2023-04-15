import { NextComponentType, NextPage } from 'next'
import Image from 'next/image'

const OverviewMap: unknown = () => {
    return <div className="flex flex-col">
        <div className="self-center flex h-[75vw]">
            <Image className="object-contain"
                    src="/TestWorldMap.png"
                    alt="map"
                    fill 
                    quality="100"/>
        </div>

    </div>;
};

export default OverviewMap;
