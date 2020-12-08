import React, { useState } from 'react';
import axios from 'axios';

export default function AddImage(props) {

  const [destination, setDestination] = useState("");
  const [data, setData] = useState ({
    image: null,
    description: '',
  })

  const [errors, setErrors] = useState ({
    errorMsg: '',
    successMsg: '',
    showError: false,
    showSuccess: false,
  })

  const onSubmit = (e) => {
    e.preventDefault();

    var formData = new FormData();
    for (var item in data ) {
        formData.append(item, data[item]);
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
    })
  }

  return (
    <div>
      <h4>Add new image</h4>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Unity Resource Folder Path: </label>
          <input type="text" required className="form-control" value={destination} onChange={e => setDestination(e.target.value)}/>
        </div>
        <div className="form-group">
          <label htmlFor="name">Name the component: </label>
          <input type="text" name="name" id="name" className="form-control" onChange={e => setData({...data, name: e.target.value})}/>
        </div>
        <div className="form-group">
          <label htmlFor="tracked">Add image that you want program to recognise</label>
          <input type="file" id="tracked" required accept='.jpg .png' onChange={e => setData({...data, image: e.target.files[0]})} />
        </div>
        <div className="form-group">
          <label htmlFor="desc">Description: </label>
          <textarea id="desc" rows="3" required className="form-control" value={data.description} onChange={e => setData({...data, description: e.target.value})}/>
        </div>
        <div className="form-group">
          <label htmlFor="images">Content images (optional)</label>
          <input type="file" name="images[]" id="images" multiple accept='.jpg .png' onChange={e => setData({...data, contentImages: e.target.value})}/>
          <p id="images">Notice you need to select all wanted images at the same time</p>
        </div>
        <div className="form-group">
          <label htmlFor="audio">An audiofile (optional)</label>
          <input type="file" name="audio" id="audio" accept='.mp3' onChange={e => setData({...data, audioFile: e.target.value})}/>
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
          <input type="submit" value="Add image" className="btn btn-outline-primary"/>
        </div>
      </form>
    </div>
  )
}