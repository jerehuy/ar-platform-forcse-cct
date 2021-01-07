import React, { useState } from 'react';
import axios from 'axios';
import { Row, Col, Form, Button, Alert, Container } from 'react-bootstrap';

export default function AddImage(props) {
  
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
            </Form.Group>
          </Col>

          <Col md>
            <Form.Group controlId="trackedImage">
              <Form.File label="Tracked Image: " required accept='.jpg, .png' onChange={e => setData({...data, image: e.target.files[0]})} />
              <Form.Text id="trackedHelpText" className="text-muted">Add image that you want program to recognise</Form.Text>
            </Form.Group>
          </Col>
        </Row>

        <Form.Group controlId="description">
          <Form.Label htmlFor="desc">Description: </Form.Label>
          <Form.Control as="textarea" id="desc" rows="3" required value={data.description} onChange={e => setData({...data, description: e.target.value})}/>
        </Form.Group>

        <Row>
          <Col md>
            <Form.Group controlId="contentImages">
              <Form.File label="Content images (optional): " id="images" multiple accept='.jpg, .png' onChange={e => setContentImages(e.target.files)}/>
              <Form.Text id="imagesHelpText" className="text-muted">Notice you need to select all wanted images at the same time.</Form.Text>
            </Form.Group>
          </Col>

          <Col md>
            <Form.Group controlId="audioFile">
              <Form.File label="An audiofile (optional):" id="audio" accept='.mp3' onChange={e => setData({...data, audio: e.target.files[0]})}/>
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
