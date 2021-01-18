import React, { useState } from 'react';
import axios from 'axios';
import { Row, Col, Form, Button, Alert, Container } from 'react-bootstrap';

export default function AddImage({path}) {
  
  // Image object data
  const [data, setData] = useState ({
    image: null,
    description: '',
    name: ''
  })

  // Content images
  const [contentImages, setContentImages] = useState({files: [], names: []});

  // Handles content image additions
  const onAddContentImage = (e) => {
    e.preventDefault();

    if(contentImages.names.filter(imgName => imgName === e.target.files[0].name).length === 0) {
      var imgs = contentImages.files;
      imgs.push(e.target.files[0]);

      var imgNames = contentImages.names;
      imgNames.push(e.target.files[0].name);

      setContentImages({files: imgs, names: imgNames});
    }
  }

  // Handles content image removals
  const onRemoveContentImage = (e, imgName) => {
    e.preventDefault();
    if (window.confirm('Are you sure you wish to remove this content image?')) {
      var imgNames = contentImages.names.filter(x => x !== imgName);
      var imgs = contentImages.files.filter(x => x.name !== imgName);

      setContentImages({files: imgs, names: imgNames});
    }
  }

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
    for (const key of Object.keys(contentImages.files)) {
      formData.append('contentImages', contentImages.files[key])
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
    setContentImages({files: [], names: []});
    document.getElementById('images').value = null;
  }

  return (
    <Container>
      <h4 className="pt-2 text-center">Add new image</h4>

      <form onSubmit={onSubmit} className="was-validated">
        <Row>
          <Col md>
            <Form.Group controlId="componentName">
              <Form.Label htmlFor="name">Name of the component: </Form.Label>
              <Form.Control type="text" id="name" required value={data.name} onChange={e => setData({...data, name: e.target.value})}/>
              <Form.Text className="text-muted"> Unique name for this component.</Form.Text>
            </Form.Group>
          </Col>

          <Col md>
            <Form.Group controlId="trackedImage">
              <Form.File id="tracked" label="Tracked Image: " required accept='.jpg, .png' onChange={e => setData({...data, image: e.target.files[0]})} />
              <Form.Text id="trackedHelpText" className="text-muted">Add image that you want program to recognise. Don't use the same image in multiple places.</Form.Text>
            </Form.Group>
          </Col>
        </Row>

        <Form.Group controlId="description">
          <Form.Label htmlFor="desc">Description: </Form.Label>
          <Form.Control as="textarea" id="desc" rows="3" required value={data.description} onChange={e => setData({...data, description: e.target.value})}/>
          <Form.Text className="text-muted">Text you want the program to show when Tracked Image is recognised.</Form.Text>
        </Form.Group>

        <Row>
          <Col md>
            <Form.Group controlId="contentImages">
              <Form.File label="Content images (optional): " id="images" accept='.jpg, .png' onChange={e => onAddContentImage(e)}/>
              <Form.Text id="imagesHelpText" className="text-muted pb-2">Add images one at a time. The image names will appear under this.</Form.Text>

              {contentImages.names.map(imgName => (
                <Form.Group controlId="contentImage">
                  <Form.Label className="pr-1">{imgName}</Form.Label>
                  <Button variant="outline-danger" onClick={e => onRemoveContentImage(e, imgName)}>Remove Content Image</Button>
                </Form.Group>
              ))}
            </Form.Group>
          </Col>

          <Col md>
            <Form.Group controlId="audioFile">
              <Form.File label="An audiofile (optional):" id="audio" accept='.mp3' onChange={e => setData({...data, audio: e.target.files[0]})}/>
              <Form.Text className="text-muted">Audio that you can play when Tracked Image is recognised.</Form.Text>
            </Form.Group>
          </Col>
        </Row>
        
        { errors.showError
          ? <div className="d-flex justify-content-center">
              <Alert variant="danger" dismissible onClose={() => setErrors({...errors, showError: false})} className="fade show alert-dismissible">
                {errors.errorMsg}
              </Alert>
            </div>
          : null
        }
        { errors.showSuccess
          ? <div className="d-flex justify-content-center">
              <Alert variant="success" dismissible onClose={() => setErrors({...errors, showSuccess: false})} className="fade show">{errors.successMsg}
              </Alert>
            </div>
          : null
        }

        <Form.Group className="d-flex justify-content-center">
          <Button type="submit" variant="outline-primary">Add image</Button>
        </Form.Group>

      </form>
    </Container>
  )
}
