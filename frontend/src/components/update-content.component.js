import React, { useState, useEffect } from 'react';
import axios from 'axios';
export default function UpdateContent(props) {

  const [imageData, setImageData] = useState([]);
  const [gpsData, setGpsData] = useState([]);

  const [selectedImage, setSelectedImage]  = useState(null);
  const [selectedCoord, setSelectedCoord]  = useState(null);

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
    e.preventDefault();
    axios.put('http://localhost:5000/images/'+ selectedImage.id, {data: selectedImage})
    .then((res) => {
      setImageData(res.data.data);
      setSelectedImage(null);
    },(err) => {
      console.log(err);
    });
  }
  const onUpdateCoordinates = (e) => {
    e.preventDefault(e);
    axios.put('http://localhost:5000/coordinates/' + selectedCoord.id, {data: selectedCoord})
    .then((res) => {
      setGpsData(res.data.data);
      setSelectedCoord(null);
    },(err) => {
      console.log(err);
    });
  }
  const onRemoveImage = (e) => {
    console.log(e.target.id)
    axios.delete('http://localhost:5000/images/' + e.target.id, {data: imageData})
      .then((res) => {
        setImageData(res.data.data);
        setSelectedImage(null);
      },(err) => {
        console.log(err);
      });
  }
  const onRemoveCoordinates = (e) => {
    axios.delete('http://localhost:5000/coordinates/' + e.target.id, {data: gpsData})
    .then((res) => {
      setGpsData(res.data.data);
    },(err) => {
      console.log(err);
    });
  }

  const onChangeSelectedImage = (newSelectedImage) => {
    if(selectedImage != null && selectedImage.id === newSelectedImage.id) {
      setSelectedImage(null);
    }
    else {
      setSelectedImage(newSelectedImage)
    }
  }

  const onChangeSelectedCoord = (newSelectedCoord) => {
    if(selectedCoord != null && selectedCoord.id === newSelectedCoord.id) {
      setSelectedCoord(null);
    }
    else {
      setSelectedCoord(newSelectedCoord)
    }
  }

  return (
    <div>
      <h5>Images</h5>
      {Object.keys(imageData).map((keyName, i) => (
        <div>
          <label onClick={() => onChangeSelectedImage(imageData[i])}>{imageData[i].id}</label>
          {(selectedImage != null && imageData[i].id === selectedImage.id) && 
            <div>
              <form onSubmit={onUpdateImage}>
                <div className="form-group">
                  <label htmlFor="name">Rename the component: </label>
                  <input type="text" name="name" id="name" className="form-control" onChange={e => setSelectedImage({...selectedImage, name: e.target.value})}/>
                </div>
                <div className="form-group">
                  <label>Tracked image name: {selectedImage.trackedImageName}</label><br/>
                  <label>Change tracked image</label><br/>
                  <input type="file" accept='.jpg .png' onChange={e => setSelectedImage({...selectedImage, image: e.target.files[0]})} />
                </div>
                <div className="form-group">
                  <label>Description: </label>
                  <textarea rows="3" required className="form-control" value={selectedImage.text} onChange={e => setSelectedImage({...selectedImage, text: e.target.value})}/>
                </div>
                <div className="form-group">
                  <label htmlFor="images">Content images (optional)</label>
                  <input type="file" name="images[]" id="images" multiple accept='.jpg .png' onChange={e => setSelectedImage({...selectedImage, contentImages: e.target.value})}/>
                  <p id="images">Notice you need to select all wanted images at the same time</p>
                </div>
                <div className="form-group">
                  <label htmlFor="audio">An audiofile (optional)</label>
                  <input type="file" name="audio" id="audio" accept='.mp3' onChange={e => setSelectedImage({...selectedImage, audioFile: e.target.value})}/>
                </div>
                <div className="form-group">
                  <input type="submit" value="Update image" className="btn btn-outline-primary"/>
                </div>
              </form>
              <button id={imageData[i].id} onClick={onRemoveImage} className="btn btn-outline-secondary">Remove</button>
            </div>
          }
        </div>
      ))}
      <h5>Coordinates</h5>
      {Object.keys(gpsData).map((keyName, i) => (
        <div>
          <label onClick={() => onChangeSelectedCoord(gpsData[i])}>{gpsData[i].id}</label>
          {(selectedCoord != null && gpsData[i].id === selectedCoord.id) && 
          <div>
            <form onSubmit={onUpdateCoordinates}>
            <div className="form-group">
              <label htmlFor="name">Rename the component: </label>
              <input type="text" name="name" id="name" className="form-control" onChange={e => setSelectedCoord({...selectedCoord, name: e.target.value})}/>
            </div>
              <div className="form-group">
                <label>Latitude</label>
                <input type="text" required className="form-control" value={selectedCoord.latitude} onChange={e => setSelectedCoord({...selectedCoord, latitude: e.target.value})}/>
              </div>
              <div className="form-group">
                <label>Longitude</label>
                <input type="text" required className="form-control" value={selectedCoord.longitude} onChange={e => setSelectedCoord({...selectedCoord, longitude: e.target.value})}/>
              </div>
              <div className="form-group">
                <label htmlFor="rad">Radius (meters?)</label>
                <input type="number" id="rad" defaultValue={selectedCoord.radius} className="form-control" onChange={e => setSelectedCoord({...selectedCoord, radius: e.target.value})}/>
              </div>
              <div className="form-group">
                <label htmlFor="act">Activation (seconds?)</label>
                <input type="number" id="act" defaultValue={selectedCoord.activation} className="form-control" onChange={e => setSelectedCoord({...selectedCoord, activation: e.target.value})}/>
              </div>
              <div className="form-group">
                <label htmlFor="dact">Deactivation (seconds?)</label>
                <input type="number" id="dact" defaultValue={selectedCoord.deactivation} className="form-control" onChange={e => setSelectedCoord({...selectedCoord, deactivation: e.target.value})}/>
              </div>
              <div className="form-group">
                <label>Name of the audio file: {selectedCoord.audioName}</label> <br/>
                <label htmlFor="audio">Change audio file: </label>
                <input type="file" id="audio" required accept='.mp3' onChange={e => setSelectedCoord({...selectedCoord, audio: e.target.files[0]})} />
              </div>
              <div className="form-group">
                <input type="submit" value="Update coordinate" className="btn btn-outline-primary"/>
              </div>
            </form>
            <button id={gpsData[i].id} onClick={onRemoveCoordinates} className="btn btn-outline-secondary">Remove</button>
          </div>
          } 
        </div>
      ))}
    </div>
  )
}
