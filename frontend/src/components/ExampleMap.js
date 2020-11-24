import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents} from 'react-leaflet';
import Leaflet from 'leaflet';
import 'leaflet/dist/leaflet.css';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';

Leaflet.Marker.prototype.options.icon = Leaflet.icon({
  iconRetinaUrl: iconRetina,
  iconUrl: icon,
  shadowUrl: iconShadow,
  shadowSize: [41, 41],
  iconSize: [25, 41],
  popupAnchor: [1, -34],
  iconAnchor: [12, 41]
});

function MyComponent() {

  const [position, setPosition] = useState([51.505, -0.09]);

  const map = useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
    }

  })
  return (
    <Marker position={position} draggable={true}>
      <Popup>
      A pretty CSS3 popup. <br /> Easily customizable. <br />
      Position <pre>{JSON.stringify(position, null, 2)}</pre>
      </Popup>
    </Marker>
  )
}

export default function MyMapComponent() {
      return (
          <MapContainer 
            center={[51.505, -0.09]} 
            zoom={13} 
            scrollWheelZoom={false} 
            style = {{height: "400px", width: "400px"}}>
              <TileLayer
                  attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
          <MyComponent/>
          </MapContainer>
      );
}