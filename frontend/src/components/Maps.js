import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup} from 'react-leaflet';
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
        width: "400px"
    }

    //use coordinates you want as the center of the map as default
    //in format [Latitude, longtitude]
    const [position, setPosition] = useState([51.505, -0.09])

    function markerFinder() {
        var marker = document.getElementById("marker");
        marker.on('dragend', function(event) {
            var marker = event.target;  // you could also simply access the marker through the closure
            var result = marker.getLatLng();  // but using the passed event is cleaner
            console.log(result);
            setPosition(result);
        });
    }

    return (
        <MapContainer 
            center={[51.505, -0.09]} 
            zoom={13} 
            scrollWheelZoom={false} 
            style = {mapSize}>

            <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={position} draggable={true} eventHandlers={markerFinder()} id='marker'>
                <Popup>
                A pretty CSS3 popup. <br /> Easily customizable. <br />
                Position <pre>{JSON.stringify(position, null, 2)}</pre>
                </Popup>
            </Marker>
        </MapContainer>
    );
}

export default Amap;