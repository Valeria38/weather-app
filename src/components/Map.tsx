import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import type { Coords } from '../../types';

type Props = {
  coords: Coords;
  onMapClick: (lat: number, lon: number) => void;
};

function Map({ coords: { lat, lon }, onMapClick }: Props) {
  return (
    <MapContainer
      center={[lat, lon]}
      zoom={5}
      style={{
        width: '700px',
        height: '500px',
      }}
    >
      <MapClick onMapClick={onMapClick} coords={{ lat, lon }} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[lat, lon]} />
    </MapContainer>
  );
}

function MapClick({
  onMapClick,
  coords,
}: {
  coords: Coords;
  onMapClick: (lat: number, lon: number) => void;
}) {
  const map = useMap();
  map.panTo([coords.lat, coords.lon]);

  map.on('click', (e) => {
    const { lat, lng } = e.latlng;
    onMapClick(lat, lng);
  });

  return null;
}

export default Map;
