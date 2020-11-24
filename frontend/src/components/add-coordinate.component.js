import React, { useState } from 'react';
import axios from 'axios';
import Amap from './Maps';
import ExampleMap from './ExampleMap'
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
    
  })
  
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

    setData({
      ...data,
      audio: null,
      latitude: '',
      longitude: ''
    })
  }

  return (
    <div>
      <ExampleMap />
      <h4>Add new coordinates</h4>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Latitude</label>
          <input type="text" required className="form-control" value={data.latitude} onChange={e => setData({...data, latitude: e.target.value})}/>
        </div>
        <div className="form-group">
          <label>Longitude</label>
          <input type="text" required className="form-control" value={data.longitude} onChange={e => setData({...data, longitude: e.target.value})}/>
        </div>
        <div className="form-group">
          <input type="file" required accept='.mp3' onChange={e => setData({...data, audio: e.target.files[0]})} />
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