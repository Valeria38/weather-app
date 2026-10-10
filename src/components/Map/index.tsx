import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import type { Coords } from '../../../types';
import { API_KEY, STADIA_API_KEY } from '@/api';

type Props = {
  mapType: string;
  coords: Coords;
  onMapClick: (lat: number, lon: number) => void;
};


function Map({ coords: { lat, lon }, onMapClick, mapType }: Props) {
  return (
    <MapContainer
      center={[lat, lon]}
      zoom={5}
      style={{
        width: '100%',
        height: '100%',
      }}
    >
      <MapClick onMapClick={onMapClick} coords={{ lat, lon }} />
      {/* base map */}
      <TileLayer
        attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url={`https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png?api_key=${STADIA_API_KEY}`}
      />
      {/* weather top layer */}
      <TileLayer
        opacity={0.5}
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url={`https://tile.openweathermap.org/map/${mapType}/{z}/{x}/{y}.png?appid=${API_KEY}`}
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
