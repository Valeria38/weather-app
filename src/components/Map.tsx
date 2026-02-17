import { MapContainer, TileLayer, Popup, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

type Props = {};

function Map({}: Props) {
  return (
    <MapContainer
      center={[50.27, 30.31]}
      zoom={5}
      style={{
        width: '700px',
        height: '500px',
      }}
    >
      <MapClick />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[50.27, 30.31]} />
    </MapContainer>
  );
}

function MapClick() {
  const map = useMap();

  map.on('click', (e) => {
    const { lat, lng } = e.latlng;
    map.panTo([lat, lng]);
  });

  return null;
}

export default Map;
