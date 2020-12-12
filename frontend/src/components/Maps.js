import React from 'react';
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

function Amap(props) {

    //Here you can decide how big the map will be
    const mapSize = {
        height: "400px", 
        width: "600px"
    }

    function MyMarker() {
      
        const map = useMapEvents({
          click: (e) => {
            const { lat, lng } = e.latlng;
            props.onChange([lat, lng]);
          }
        });
        if(props.position && props.position.length) {
          return (
            <Marker position={props.position} draggable={true}>
              <Popup>
                  Position <pre>{JSON.stringify(props.position, null, 2)}</pre>
              </Popup>
            </Marker>
          )
        }
        else {
          return null;
        }
        
      }

    return (
        <div>
            <MapContainer 
              center={[51.505, -0.09]} 
              zoom={13} 
              scrollWheelZoom={false} 
              style = {mapSize}>
                <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MyMarker />
            </MapContainer>
        </div>
    );
}

export default Amap;