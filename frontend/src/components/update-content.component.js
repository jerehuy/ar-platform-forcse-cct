import React, { Component } from 'react';
import axios from 'axios';
export default class UpdateContent extends Component {

  constructor(props) {
    super(props);  
    
    this.state = {
      image_data: [],
      gps_data: [],
    };
    this.onUpdateImage = this.onUpdateImage.bind(this);
    this.onUpdateCoordinates = this.onUpdateCoordinates.bind(this);
    this.onRemoveImage = this.onRemoveImage.bind(this);
    this.onRemoveCoordinates = this.onRemoveCoordinates.bind(this);
  }

  componentDidMount() {
    axios.get('http://localhost:5000/images/')
    .then((res) => {
      this.setState({image_data: res.data.data })
    },(err) => {
      console.log(err);
    });
    axios.get('http://localhost:5000/coordinates/')
    .then((res) => {
      this.setState({gps_data: res.data.data })
    },(err) => {
      console.log(err);
    });
  }
  onUpdateImage(e) {
    axios.get('http://localhost:5000/images/')
    .then((res) => {
      this.setState({image_data: res.data.data })
    },(err) => {
      console.log(err);
    });
  }
  onUpdateCoordinates(e) {
    axios.get('http://localhost:5000/coordinates/')
    .then((res) => {
      console.log(res.data.data);
      this.setState({image_data: res.data.data })
    },(err) => {
      console.log(err);
    });
  }
  onRemoveImage(e) {
    console.log(e.target.id);
    axios.delete('http://localhost:5000/images/' + e.target.id, {data: this.state.image_data})
      .then((res) => {
        this.setState({image_data: res.data.data })
      },(err) => {
        console.log(err);
      });
  }
  onRemoveCoordinates(e) {
    axios.get('http://localhost:5000/coordinates/')
    .then((res) => {
      console.log(res.data.data);
      this.setState({image_data: res.data.data })
    },(err) => {
      console.log(err);
    });
  }

  render() {
    return (
      <div>

        <h5>Images</h5>
        {Object.keys(this.state.image_data).map((keyName, i) => (
          <div>
            <button id={this.state.image_data[i].id} onClick={this.onRemoveImage}>Remove</button>
          </div>
        ))}
        <h5>Coordinates</h5>
        {Object.keys(this.state.gps_data).map((keyName, i) => (
          <div>
            <button>Remove</button>
          </div>
        ))}
      </div>
    )
  }
}