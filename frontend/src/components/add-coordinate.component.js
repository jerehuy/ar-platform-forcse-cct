import React, { useState } from 'react';
import axios from 'axios';
import Amap from './Maps';
export default function AddCoordinate({path}) {

  // Error handling
  const [errors, setErrors] = useState ({
    errorMsg: '',
    successMsg: '',
    showError: false,
    showSuccess: false
  })

  // Coordinate object data
  const [data, setData] = useState({
    audio: null,
    latitude: '',
    longitude: '',
    radius: '50',
    activation: '1',
    deactivation: '10',
    name: '',
  })
  
  // Current marker position
  const [position, setPosition] = useState([])
  
  // Sends a request to add a new image object
  const onSubmit = (e) => {
    e.preventDefault();
    var formData = new FormData();
    for (var item in data ) {
        formData.append(item, data[item]);
    }
    formData.append("path", path);
    axios.post('http://localhost:5000/coordinates/add', formData)
      .then((res) => {

        setErrors({
          ...errors,
          errorMsg: '',
          successMsg: "Added successfully!",
          showError: false,
          showSuccess: true
        })
      },(err) => {
        setErrors({
          ...errors,
          errorMsg: err.response.data ? err.response.data : 'Failed to add new coordinates',
          successMsg: '',
          showError: true,
          showSuccess: false
        })
      });
      setData({
        ...data,
        audio: null,
        latitude: '',
        longitude: '',
        radius: '50',
        activation: '1',
        deactivation: '10',
        name: ''
      })
      document.getElementById('audio').value= null;
  }

  // Handles map changes
  function handleMapChange(newPosition) {
    setData({...data, latitude: newPosition[0], longitude: newPosition[1]});
    setPosition(newPosition);
  }

  return (
    <div>
      <h4 className="pt-2 text-center">Add new coordinates</h4>
      <form onSubmit={onSubmit} className="was-validated">
        <div className="row">
            <div className="col-xl-6 pl-md-5">
            <Amap position={position} onChange={handleMapChange} />
            <small className="form-text text-muted">
              Notice: Position of the marker changes when you click on the map!
            </small>
          </div>
          <div className="col-xl-6">
            <div className="form-group">
              <label htmlFor="name">Name the component: </label>
              <input type="text" name="name" id="name" required value={data.name} className="form-control" onChange={e => setData({...data, name: e.target.value})}/>
            </div>
            <div className="form-group">
              <label htmlFor="lat">Latitude: </label>
              <input type="text" id="lat" required className="form-control" value={position[0]} onChange={e => setData({...data, latitude: e.target.value})}/>
              <small className="form-text text-muted">Click on the map on left to get latitude.</small>
            </div>
            <div className="form-group">
              <label htmlFor="lng">Longitude: </label>
              <input type="text" id="lng" required className="form-control" value={position[1]} onChange={e => setData({...data, longitude: e.target.value})}/>
              <small className="form-text text-muted">Click on the map on left to get longitude.</small>
            </div>
            <div className="form-group">
              <label htmlFor="audio">Add audio file: </label>
              <input type="file" id="audio" className="form-control-file border rounded" required accept='.mp3' onChange={e => setData({...data, audio: e.target.files[0]})} />
            </div>
            <div className="form-group">
              <label htmlFor="rad">Radius (meters): </label>
              <input type="number" id="rad" defaultValue={data.radius} className="form-control" onChange={e => setData({...data, radius: e.target.value})}/>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="form-group col-sm">
            <label htmlFor="act">Activation (seconds): </label>
            <input type="number" id="act" defaultValue={data.activation} className="form-control" onChange={e => setData({...data, activation: e.target.value})}/>
          </div>
          <div className="form-group col-sm">
            <label htmlFor="dact">Deactivation (seconds): </label>
            <input type="number" id="dact" defaultValue={data.deactivation} className="form-control" onChange={e => setData({...data, deactivation: e.target.value})}/>
          </div>
        </div>

        { errors.showError
          ? <div className="d-flex justify-content-center"><label className="alert alert-danger alert-dismissible fade showd-flex justify-content-center">{errors.errorMsg} <button type="button" className="close" onClick={() => setErrors({...errors, showError: false})}>&times;</button></label></div>
          : null
        }
        { errors.showSuccess
          ? <div className="d-flex justify-content-center"><label className="alert alert-success alert-dismissible fade show">{errors.successMsg} <button type="button" className="close" onClick={() => setErrors({...errors, showSuccess: false})}>&times;</button></label></div>
          : null
        }
        <div className="form-group d-flex justify-content-center">
          <input type="submit" value="Add coordinate" className="btn btn-outline-primary"/>
        </div>
    </form>
  </div>
  )
}