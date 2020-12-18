import React, { useState } from 'react';
import axios from 'axios';
import Amap from './Maps';
export default function AddCoordinate(props) {

  const [errors, setErrors] = useState ({
    errorMsg: '',
    successMsg: '',
    showError: false,
    showSuccess: false
  })
  const [data, setData] = useState({
    audio: null,
    latitude: '',
    longitude: '',
    radius: 50,
    activation: 1,
    deactivation: 10,
    name: ''
  })
  
  const [position, setPosition] = useState([])
  
  const onSubmit = (e) => {
    e.preventDefault();
    var formData = new FormData();
    for (var item in data ) {
        formData.append(item, data[item]);
    }
    axios.post('http://localhost:5000/coordinates/add', formData)
      .then((res) => {
        console.log(res);

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
  }

  function handleMapChange(newPosition) {
    setData({...data, latitude: newPosition[0], longitude: newPosition[1]})
    setPosition(newPosition);
  }

  return (
    <div>
      <h4>Add new coordinates</h4>
      <Amap position={position} onChange={handleMapChange} />
      <p>
        Position of the marker <br />
        Latitude: {position[0]}, Longtitude: {position[1]} <br/>
        Notice: Position of the marker changes when you click on the map!
      </p>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name the component: </label>
          <input type="text" name="name" id="name" required className="form-control" onChange={e => setData({...data, name: e.target.value})}/>
        </div>
        <div className="form-group">
          <label htmlFor="lat">Latitude</label>
          <input type="text" id="lat" required className="form-control" value={position[0]} onChange={e => setData({...data, latitude: e.target.value})}/>
        </div>
        <div className="form-group">
          <label htmlFor="lng">Longitude</label>
          <input type="text" id="lng" required className="form-control" value={position[1]} onChange={e => setData({...data, longitude: e.target.value})}/>
        </div>
        <div className="form-group">
          <label htmlFor="rad">Radius (meters?)</label>
          <input type="number" id="rad" defaultValue={data.radius} className="form-control" onChange={e => setData({...data, radius: e.target.value})}/>
        </div>
        <div className="form-group">
          <label htmlFor="act">Activation (seconds?)</label>
          <input type="number" id="act" defaultValue={data.activation} className="form-control" onChange={e => setData({...data, activation: e.target.value})}/>
        </div>
        <div className="form-group">
          <label htmlFor="dact">Deactivation (seconds?)</label>
          <input type="number" id="dact" defaultValue={data.deactivation} className="form-control" onChange={e => setData({...data, deactivation: e.target.value})}/>
        </div>
        <div className="form-group">
          <label htmlFor="audio">Add audio file</label>
          <input type="file" id="audio" required accept='.mp3' onChange={e => setData({...data, audio: e.target.files[0]})} />
        </div>
        { errors.showError
          ? <label style={{color: "red"}}>{errors.errorMsg}</label>
          : null
        }
        { errors.showSuccess
          ? <label style={{color: "green"}}>{errors.successMsg}</label>
          : null
        }
        <div className="form-group">
          <input type="submit" value="Add coordinate" className="btn btn-outline-primary"/>
        </div>
      </form>
    </div>
  )
}