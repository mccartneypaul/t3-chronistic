import Image from 'next/image'

const mapImage = "/TestWorldMap.png"

const OverviewMap = () => {
    return (
        <div className="relative aspect-auto h-[40vw]">
            <Image
            className="object-contain"
            src={mapImage}
            alt="map"
            quality="100"
            fill
            />
        </div>
    );
};

export default OverviewMap;
