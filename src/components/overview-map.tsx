import Image from 'next/image'
import EventIcon from './event-icon';
import { ModalProvider } from '../contexts/modal-context';

const mapImage = "/TestWorldMap.png"

const OverviewMap = () => {
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
            <ModalProvider>
                <EventIcon initialPosition={{x: 450, y:650}} />
            </ModalProvider>
        </>
    );
};

export default OverviewMap;
