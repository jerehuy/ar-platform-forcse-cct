import React, { Component } from 'react';
import axios from 'axios';
import Map from './Maps';
import '../map.css'
export default class AddCoordinate extends Component {

  constructor(props) {
    super(props);  
  
    this.onChangeAudio = this.onChangeAudio.bind(this);
    this.onChangeLatitude = this.onChangeLatitude.bind(this);
    this.onChangeLongitude = this.onChangeLongitude.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    
    this.state = {
      audio: null,
      latitude: '',
      longitude: '',
      radius: 50,
      activation: 1,
      deactivation: 10,
      errorMsg: '',
      successMsg: '',
      showError: false,
      showSuccess: false
    };
  }
  
  onChangeAudio(e) {
    this.setState({
      audio: e.target.files[0]
    });
  }

  onChangeLatitude(e) {
    this.setState({
      latitude: e.target.value
    });
  }
  
  onChangeLongitude(e) {
    this.setState({
      longitude: e.target.value
    });
  }
  
  onSubmit(e) {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append('audio', this.state.audio);
    formData.append('longitude', this.state.longitude);
    formData.append('latitude', this.state.latitude);
    formData.append('radius', this.state.radius);
    formData.append('activation', this.state.activation);
    formData.append('deactivation', this.state.deactivation);
    axios.post('http://localhost:5000/coordinates/add', formData)
      .then((res) => {
        console.log(res);
        this.setState({
          errorMsg: '',
          successMsg: "Added successfully!",
          showError: false,
          showSuccess: true
        })
      },(err) => {
        this.setState({
          errorMsg: err.response.data ? err.response.data : 'Failed to add new coordinates',
          successMsg: '',
          showError: true,
          showSuccess: false
        })
      });

    this.setState({
      audio: null,
      latitude: '',
      longitude: ''
    })
  }

  render() {
    return (
      <div>
        <h4>Add new coordinates</h4>
        <Map />
        <form onSubmit={this.onSubmit}>
          <div className="form-group">
            <label>Latitude</label>
            <input type="text" required className="form-control" value={this.state.latitude} onChange={this.onChangeLatitude}/>
          </div>
          <div className="form-group">
            <label>Longitude</label>
            <input type="text" required className="form-control" value={this.state.longitude} onChange={this.onChangeLongitude}/>
          </div>
          <div className="form-group">
            <input type="file" required accept='.mp3' onChange={this.onChangeAudio} />
          </div>
          { this.state.showError
            ? <label style={{color: "red"}}>{this.state.errorMsg}</label>
            : null
          }
          { this.state.showSuccess
            ? <label style={{color: "green"}}>{this.state.successMsg}</label>
            : null
          }
          <div className="form-group">
            <input type="submit" value="Add coordinate" className="btn btn-outline-primary"/>
          </div>
        </form>
      </div>
    )
  }
}