import React, { useState } from 'react';
import axios from 'axios';

export default function AddImage({path}) {
  
  // Image object data
  const [data, setData] = useState ({
    image: null,
    description: '',
    name: ''
  })

  // Content images
  const [contentImages, setContentImages] = useState([])

  // Error handling
  const [errors, setErrors] = useState ({
    errorMsg: '',
    successMsg: '',
    showError: false,
    showSuccess: false,
  })

  // Sends a request to add a new image object
  const onSubmit = (e) => {
    e.preventDefault();

    var formData = new FormData();
    for (var item in data ) {
        formData.append(item, data[item]);
    }
    for (const key of Object.keys(contentImages)) {
      formData.append('contentImages', contentImages[key])
    }
    axios.post('http://localhost:5000/images/add', formData)
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
          errorMsg: err.response.data ? err.response.data : 'Failed to add new images',
          successMsg: '',
          showError: true,
          showSuccess: false
        })
      });

    setData({
      ...data,
      image: null,
      description: '',
      name: '',
      audio: null
    })
    document.getElementById('tracked').value= null;
  }

  return (
    <div>
      <h4 className="pt-2 text-center">Add new image</h4>
      <form onSubmit={onSubmit} className="was-validated">
        <div className="row">
          <div className="col-md">
            <div className="form-group">
              <label htmlFor="name">Name the component: </label>
              <input type="text" name="name" id="name" required className="form-control" value={data.name} onChange={e => setData({...data, name: e.target.value})}/>
            </div>
          </div>
          <div className="col-md">
            <div className="form-group">
              <label htmlFor="tracked">Tracked Image: </label>
              <input type="file" name="tracked" className="form-control-file border rounded" id="tracked" required accept='.jpg, .png' onChange={e => setData({...data, image: e.target.files[0]})} />
              <small id="trackedHelpText" className="form-text text-muted">Add image that you want program to recognise</small>
            </div>
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="desc">Description: </label>
          <textarea id="desc" rows="3" required className="form-control" value={data.description} onChange={e => setData({...data, description: e.target.value})}/>
        </div>
        <div className="row">
          <div className="col-md">
            <div className="form-group">
              <label htmlFor="images[]">Content images (optional): </label>
              <input type="file" className="form-control-file border rounded" name="images[]" id="images" multiple accept='.jpg, .png' onChange={e => setContentImages(e.target.files)}/>
              <small id="imagesHelpText" className="form-text text-muted">Notice you need to select all wanted images at the same time</small>
            </div>
          </div>
          <div className="col-md">
            <div className="form-group">
              <label htmlFor="audio">An audiofile (optional): </label>
              <input type="file" className="form-control-file border rounded" name="audio" id="audio" accept='.mp3' onChange={e => setData({...data, audio: e.target.files[0]})}/>
            </div>
          </div>
        </div>
        
        
        { errors.showError
          ? <div className="d-flex justify-content-center"><label className="alert alert-dangeer fade show alert-dismissible">{errors.errorMsg}<button type="button" className="close" onClick={() => setErrors({...errors, showError: false})}>&times;</button></label></div>
          : null
        }
        { errors.showSuccess
          ? <div className="d-flex justify-content-center"><label className="alert alert-success fade show alert-dismissible">{errors.successMsg}<button type="button" className="close" onClick={() => setErrors({...errors, showSuccess: false})}>&times;</button></label></div>
          : null
        }
        <div className="form-group d-flex justify-content-center">
          <input type="submit" value="Add image" className="btn btn-outline-primary"/>
        </div>
      </form>
    </div>
  )
}
