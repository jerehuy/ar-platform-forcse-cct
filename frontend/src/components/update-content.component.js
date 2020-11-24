import React, { useState, useEffect } from 'react';
import axios from 'axios';
export default function UpdateContent(props) {

  const [imageData, setImageData] = useState([]);
  const [gpsData, setGpsData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/images/')
    .then((res) => {
      setImageData(res.data.data);
    },(err) => {
      console.log(err);
    });
    axios.get('http://localhost:5000/coordinates/')
    .then((res) => {
      setGpsData(res.data.data);
    },(err) => {
      console.log(err);
    });
  }, [])

  const onUpdateImage = (e) => {
    axios.get('http://localhost:5000/images/')
    .then((res) => {
      setImageData(res.data.data);
    },(err) => {
      console.log(err);
    });
  }
  const onUpdateCoordinates = (e) => {
    axios.get('http://localhost:5000/coordinates/')
    .then((res) => {
      setGpsData(res.data.data);
    },(err) => {
      console.log(err);
    });
  }
  const onRemoveImage = (e) => {
    console.log(e.target.id);
    axios.delete('http://localhost:5000/images/' + e.target.id, {data: imageData})
      .then((res) => {
        setImageData(res.data.data);
      },(err) => {
        console.log(err);
      });
  }
  const onRemoveCoordinates = (e) => {
    console.log(e.target.id);
    axios.delete('http://localhost:5000/coordinates/' + e.target.id, {data: gpsData})
    .then((res) => {
      setGpsData(res.data.data);
    },(err) => {
      console.log(err);
    });
  }

  return (
    <div>

      <h5>Images</h5>
      {Object.keys(imageData).map((keyName, i) => (
        <div>
          <button id={imageData[i].id} onClick={onRemoveImage}>Remove</button>
        </div>
      ))}
      <h5>Coordinates</h5>
      {Object.keys(gpsData).map((keyName, i) => (
        <div>
          <button id={gpsData[i].id} onClick={onRemoveCoordinates}>Remove</button>
        </div>
      ))}
    </div>
  )
}