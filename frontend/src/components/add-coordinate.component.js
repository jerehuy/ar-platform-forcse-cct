import React, { useState } from 'react';
import axios from 'axios';
import Amap from './Maps';
import { Col, Container, Form, Row, Alert, Button } from 'react-bootstrap';

export default function AddCoordinate(props) {

  // Error handling
  const [errors, setErrors] = useState ({
    errorMsg: '',
    successMsg: '',
    showError: false,
    showSuccess: false
  })

  // Coordinate object data
  const [data, setData] = useState({
    audio: null,
    latitude: '',
    longitude: '',
    radius: '50',
    activation: '1',
    deactivation: '10',
    name: '',
  })
  
  // Current marker position
  const [position, setPosition] = useState([])
  
  // Sends a request to add a new image object
  const onSubmit = (e) => {
    e.preventDefault();
    var formData = new FormData();
    for (var item in data ) {
        formData.append(item, data[item]);
    }
    formData.append("path", props.path);
    axios.post('http://localhost:5000/coordinates/add', formData)
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
        longitude: '',
        radius: '50',
        activation: '1',
        deactivation: '10',
        name: ''
      })
      document.getElementById('audio').value= null;
  }

  // Handles map changes
  function handleMapChange(newPosition) {
    setData({...data, latitude: newPosition[0], longitude: newPosition[1]});
    setPosition(newPosition);
  }

  return (
    <Container>
      <h4 className="pt-2 text-center">Add new coordinates</h4>

      <form onSubmit={onSubmit} className="was-validated">
        <Row>
          <Col xl="6" className="pl-md-5">
            <Amap position={position} onChange={handleMapChange} />
            <Form.Text className="text-muted">
              Position of the marker changes when you click on the map!
            </Form.Text>
          </Col>

          <Col xl='6'>
            <Form.Group controlId="componentName">
              <Form.Label htmlFor="name">Name the component: </Form.Label>
              <Form.Control type="text" id="name" required value={data.name} onChange={e => setData({...data, name: e.target.value})}/>
              <Form.Text className="text-muted">Unique name for this component.</Form.Text>
            </Form.Group>

            <Form.Group controlId="latitude">
              <Form.Label htmlFor="lat">Latitude: </Form.Label>
              <Form.Control type="text" id="lat" required value={position[0]} onChange={e => setData({...data, latitude: e.target.value})}/>
              <Form.Text className="text-muted">Click on the map on left to get latitude.</Form.Text>
            </Form.Group>

            <Form.Group controlId="longtitude">
              <Form.Label htmlFor="lng">Longitude: </Form.Label>
              <Form.Control type="text" id="lng" required value={position[1]} onChange={e => setData({...data, longitude: e.target.value})}/>
              <Form.Text className="text-muted">Click on the map on left to get longitude.</Form.Text>
            </Form.Group>

            <Form.Group controlId="audioFile">
              <Form.File id="audio" label="Add audio file: " required accept='.mp3' onChange={e => setData({...data, audio: e.target.files[0]})} />
              <Form.Text className="text-muted">Audio that plays in selected coordinates.</Form.Text>
            </Form.Group>

            <Form.Group controlId="radius">
              <Form.Label htmlFor="rad">Radius (meters): </Form.Label>
              <Form.Control type="number" id="rad" defaultValue={data.radius} onChange={e => setData({...data, radius: e.target.value})}/>
              <Form.Text className="text-muted">Radius of the area this object covers.</Form.Text>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Form.Group as={Col} sm controlId="activationTime">
            <Form.Label htmlFor="act">Activation (seconds): </Form.Label>
            <Form.Control type="number" id="act" defaultValue={data.activation} onChange={e => setData({...data, activation: e.target.value})}/>
            <Form.Text className="text-muted">Stay time in area for the audio to activate.</Form.Text>
          </Form.Group>

          <Form.Group as={Col} sm controlId="deactivationTime">
            <Form.Label htmlFor="dact">Deactivation (seconds): </Form.Label>
            <Form.Control type="number" id="dact" defaultValue={data.deactivation} onChange={e => setData({...data, deactivation: e.target.value})}/>
            <Form.Text className="text-muted">Time you need to be out of the area for the audio to deactivate.</Form.Text>
          </Form.Group>
        </Row>

        { errors.showError
          ? <div className="d-flex justify-content-center">
            <Alert variant="danger" dismissible onClose={() => setErrors({...errors, showError: false})} className="fade show">
              {errors.errorMsg}
            </Alert>
          </div>
          : null
        }
        { errors.showSuccess
          ? <div className="d-flex justify-content-center">
              <Alert variant="success" dismissible onClose={() => setErrors({...errors, showSuccess: false})} className="fade show">
                {errors.successMsg}
              </Alert>
            </div>
          : null
        }
        
        <Form.Group className="form-group d-flex justify-content-center">
          <Button type="submit" variant="outline-primary">Add coordinate</Button>
        </Form.Group>
      </form>
    </Container>
  )
}