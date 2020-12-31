import React, { useState, useEffect } from 'react';
import axios from 'axios';
export default function UpdateContent(props) {

  // All image objects
  const [imageData, setImageData] = useState([]);

  // All coordinate objects
  const [gpsData, setGpsData] = useState([]);

  // Image object that is being edited
  const [selectedImage, setSelectedImage]  = useState(null);

  // Coordinate object that is being edited
  const [selectedCoord, setSelectedCoord]  = useState(null);

  // Fetches image and coordinate objects
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

  // Sends a request to update the selected image object
  const onUpdateImage = (e) => {
    e.preventDefault();
    var formData = new FormData();

    //Adds selectedImage to formData
    for (var item in selectedImage ) {
      if(item === "contentImages") {
        for (let i in selectedImage.contentImages) {
          formData.append('contentImages', selectedImage.contentImages[i])
        }
      } 
      else if(item === "contentImageNames") {
        for (let i in selectedImage.contentImageNames) {
          formData.append('contentImageNames', selectedImage.contentImageNames[i])
        }
      }
      else if(item === "removedImages") {
        for (let i in selectedImage.removedImages) {
          formData.append('removedImages',selectedImage.removedImages[i])
        }
      }
      else {
        formData.append(item, selectedImage[item]);
      }
    }

    //Adds gpsData to formData, needed for updating audio files
    for (let i in gpsData) {
      console.log(gpsData[i].audioName)
      formData.append('gpsAudioNames', gpsData[i].audioName)
    }
  
    axios.put('http://localhost:5000/images/'+ selectedImage.id, formData)
    .then((res) => {
      setImageData(res.data.data);
      setSelectedImage(null);
    },(err) => {
      console.log(err);
    });
  }

  // Sends a request to update the selected coordinate object
  const onUpdateCoordinates = (e) => {
    e.preventDefault(e);
    var formData = new FormData();
    for (var item in selectedCoord ) {
        formData.append(item, selectedCoord[item]);
    }
    axios.put('http://localhost:5000/coordinates/' + selectedCoord.id, formData)
    .then((res) => {
      setGpsData(res.data.data);
      setSelectedCoord(null);
    },(err) => {
      console.log(err);
    });
  }

  // Sends a request to remove the selected image object
  const onRemoveImage = (e) => {
    if (window.confirm('Are you sure you wish to remove this image component?')) {
    axios.delete('http://localhost:5000/images/' + e.target.id, {data: {imageData, gpsData}})
      .then((res) => {
        setImageData(res.data.data);
        setSelectedImage(null);
      },(err) => {
        console.log(err);
      });
    }
  }

  // Sends a request to remove the selected coordinate object
  const onRemoveCoordinates = (e) => {
    if (window.confirm('Are you sure you wish to remove this coordinate component?')) {
      axios.delete('http://localhost:5000/coordinates/' + e.target.id, {data: {gpsData, imageData}})
      .then((res) => {
        setGpsData(res.data.data);
      },(err) => {
        console.log(err);
      });
    }
  }

  // Changes the currently selected image object to another
  const onChangeSelectedImage = (newSelectedImage) => {
    if(selectedImage != null && selectedImage.id === newSelectedImage.id) {
      setSelectedImage(null);
    }
    else {
      setSelectedImage({...newSelectedImage, removedImages: [], contentImages: []})
    }
  }

  // Changes the currently selected coordinate object to another
  const onChangeSelectedCoord = (newSelectedCoord) => {
    if(selectedCoord != null && selectedCoord.id === newSelectedCoord.id) {
      setSelectedCoord(null);
    }
    else {
      setSelectedCoord(newSelectedCoord)
    }
  }

  // Handles content image removals
  const onRemoveContentImage = (e, imgName) => {
    e.preventDefault();
    if (window.confirm('Are you sure you wish to remove this content image?')) {
      var names = selectedImage.contentImageNames.filter(x => x !== imgName);
      var imgs = selectedImage.contentImages.filter(x => x.name !== imgName);
      var removed = selectedImage.removedImages;
      removed.push(imgName);

      setSelectedImage({...selectedImage, contentImageNames: names, contentImages: imgs, removedImages: removed})
    }
  }

  // Handles content image additions
  const onAddContentImage = (e) => {
    e.preventDefault();

    if(selectedImage.contentImageNames.filter(imgName => imgName === e.target.files[0].name).length === 0) {
      var imgs = selectedImage.contentImages;
      imgs.push(e.target.files[0]);

      var imgNames = selectedImage.contentImageNames;
      imgNames.push(e.target.files[0].name);

      setSelectedImage({...selectedImage, contentImages: imgs, contentImageNames: imgNames})
    }
  }

  return (
    <div className="row">
      <div className="col-md">
        <h5 className="py-2">Images</h5>
        {Object.keys(imageData).map((keyName, i) => (
          <div className="list-group">
            <label className="list-group-item list-group-item-action" onClick={() => onChangeSelectedImage(imageData[i])}>{imageData[i].name}</label>
            {(selectedImage != null && imageData[i].id === selectedImage.id) && 
              <div className="pb-3">
                <form onSubmit={onUpdateImage}>
                  <div className="form-group">
                    <label htmlFor="name">Object name</label> <br/>
                    <input type="text" name="name" id="name" required className="form-control" value={selectedImage.name} onChange={e => setSelectedImage({...selectedImage, name: e.target.value})}/>
                  </div>
                  <div className="form-group">
                    <label>Tracked image name: {selectedImage.trackedImageName}</label><br/>
                    <label htmlFor="tracked">Change tracked image: </label>
                    <input type="file" id="tracked" class="form-control-file border rounded" accept='.jpg, .png' onChange={e => setSelectedImage({...selectedImage, image: e.target.files[0]})} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="desc">Description: </label>
                    <textarea rows="3" id="desc" required className="form-control" value={selectedImage.text} onChange={e => setSelectedImage({...selectedImage, text: e.target.value})}/>
                  </div>
                  <div className="form-group">
                    <label htmlFor="images">Content images (optional): </label>
                    <input type="file" className="form-control-file border rounded" name="images[]" id="images" accept='.jpg, .png' onChange={e => onAddContentImage(e)}/>
                    <small className="form-text text-muted">Add new content images one at a time they will show up below this text.</small>
                    {selectedImage.contentImageNames.map(imgName => (
                      <div>
                        <label htmlFor="contentImg" className="pr-1">{imgName}</label>
                        <button id="contentImg" name="removeContentImg" className="btn btn-outline-danger" onClick={e => onRemoveContentImage(e, imgName)}>Remove Content Image</button>
                      </div>
                    ))}
                  </div>
                  <div className="form-group">
                    <label className="pr-1">Name of the audio file: {selectedImage.audioName} </label> 
                    <button className="btn btn-outline-danger">Remove audiofile</button> <br/>
                    <label htmlFor="audio">Add/Change audiofile (optional): </label>
                    <input type="file" className="form-control-file border rounded" name="audio" id="audio" accept='.mp3' onChange={e => setSelectedImage({...selectedImage, audio: e.target.files[0]})}/>
                  </div>
                  <div className="form-group">
                    <input type="submit" value="Save changes" className="btn btn-outline-primary"/>
                  </div>
                </form>
                <button id={imageData[i].id} onClick={onRemoveImage} className="btn btn-outline-danger">Remove component "{selectedImage.name}"</button>
              </div>
            }
          </div>
        ))}
      </div>
      <div className="col-md">
        <h5 className="py-2">Coordinates</h5>
        {Object.keys(gpsData).map((keyName, i) => (
          <div className="list-group">
            <label className="list-group-item list-group-item-action rounded" onClick={() => onChangeSelectedCoord(gpsData[i])}>{gpsData[i].name}</label>
            {(selectedCoord != null && gpsData[i].id === selectedCoord.id) && 
            <div className="pb-3">
              <form onSubmit={onUpdateCoordinates}>
                <div className="form-group">
                    <label htmlFor="name">Object name</label> <br/>
                    <input type="text" name="name" id="name" required className="form-control" value={selectedCoord.name} onChange={e => setSelectedCoord({...selectedCoord, name: e.target.value})}/>
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
                  <label htmlFor="rad">Radius (meters)</label>
                  <input type="number" id="rad" defaultValue={selectedCoord.radius} className="form-control" onChange={e => setSelectedCoord({...selectedCoord, radius: e.target.value})}/>
                </div>
                <div className="form-group">
                  <label htmlFor="act">Activation (seconds)</label>
                  <input type="number" id="act" defaultValue={selectedCoord.activation} className="form-control" onChange={e => setSelectedCoord({...selectedCoord, activation: e.target.value})}/>
                </div>
                <div className="form-group">
                  <label htmlFor="dact">Deactivation (seconds)</label>
                  <input type="number" id="dact" defaultValue={selectedCoord.deactivation} className="form-control" onChange={e => setSelectedCoord({...selectedCoord, deactivation: e.target.value})}/>
                </div>
                <div className="form-group">
                  <label>Name of the audio file: {selectedCoord.audioName}</label> <br/>
                  <label htmlFor="audio">Change audio file: </label>
                  <input type="file" className="form-control-file border rounded" id="audio" accept='.mp3' onChange={e => setSelectedCoord({...selectedCoord, audio: e.target.files[0], audioName: e.target.files[0].name})} />
                </div>
                <div className="form-group">
                  <input type="submit" value="Save changes" className="btn btn-outline-primary"/>
                </div>
              </form>
              <button id={gpsData[i].id} onClick={onRemoveCoordinates} className="btn btn-outline-danger">Remove Component "{selectedCoord.name}"</button>
            </div>
            } 
          </div>
        ))}
      </div>
    </div>
  )
}
