import React, { Component } from 'react';
import axios from 'axios';

export default class AddImage extends Component {

  constructor(props) {
    super(props);  

    this.onChangeDestination = this.onChangeDestination.bind(this);
    this.onChangeImage = this.onChangeImage.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    
    this.state = {
      image: null,
      description: '',
      destination: '',
      errorMsg: '',
      successMsg: '',
      showError: false,
      showSuccess: false
    };
  }

  onChangeDestination(e) {
    this.setState({
      destination: e.target.value
    });
  }

  onChangeImage(e) {
    this.setState({
      image: e.target.files[0]
    });
  }

  onChangeDescription(e) {
    this.setState({
      description: e.target.value
    });
  }

  onSubmit(e) {
    e.preventDefault();

    console.log(this.state.image);

    const formData = new FormData();
    formData.append('image', this.state.image);
    formData.append('description', this.state.description);
    formData.append('destination', this.state.destination);
    axios.post('http://localhost:5000/images/add', formData)
      .then((res) => {
        console.log(res);
        this.setState({
          errorMsg: '',
          successMsg: "Added successfully!",
          showError: false,
          showSuccess: true
        })
      },(err) => {
        console.log(err.response.data);
        this.setState({
          errorMsg: err.response.data,
          successMsg: '',
          showError: true,
          showSuccess: false
        })
      });

    this.setState({
      image: null,
      description: '',
      filename: '',

    })
  }

  render() {
    return (
      <div>
        <h4>Add new image</h4>
        <form onSubmit={this.onSubmit}>
          <div className="form-group">
            <label>Unity Resource Folder Path: </label>
            <input type="text" required className="form-control" value={this.state.destination} onChange={this.onChangeDestination}/>
          </div>
          <div className="form-group">
            <input type="file" required accept='.jpg' onChange={this.onChangeImage} />
          </div>
          <div className="form-group">
            <label>Description: </label>
            <textarea rows="3" required className="form-control" value={this.state.description} onChange={this.onChangeDescription}/>
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
            <input type="submit" value="Add image" className="btn btn-outline-primary"/>
          </div>
        </form>
      </div>
    )
  }
}