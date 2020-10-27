import React, { Component } from 'react';
import axios from 'axios';
export default class AddCoordinate extends Component {

  constructor(props) {
    super(props);  
  
    this.onChangeLatitude = this.onChangeLatitude.bind(this);
    this.onChangeLongitude = this.onChangeLongitude.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    
    this.state = {
      latitude: '',
      longitude: '',
    };
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
    formData.append('longitude', this.state.longitude);
    formData.append('latitude', this.state.latitude);
    axios.post('http://localhost:5000/coordinates/add', formData);
    this.setState({
      latitude: '',
      longitude: ''
    })
  }

  render() {
    return (
      <div>
        <h4>Add new coordinates</h4>
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
            <input type="submit" value="Add coordinate" className="btn btn-outline-primary"/>
          </div>
        </form>
      </div>
    )
  }
}