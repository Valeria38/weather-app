import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import type { Coords } from '../../types';
import { API_KEY } from '@/api';
import { useEffect } from 'react';
import { MaptilerLayer } from '@maptiler/leaflet-maptilersdk';

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
      <MapTileLayer />
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

function MapTileLayer() {
  const map = useMap();
  useEffect(() => {
    const tileLayer = new MaptilerLayer({
      style: 'basic-dark',
      apiKey: '7n9qkVm5bwvWbij2BHh6',
    });
    tileLayer.addTo(map);

    return () => {
      map.removeLayer(tileLayer);
    };
  }, [map]);

  return null;
}
