import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Amap from "./Maps";
import { Col, Row, ListGroup, Form, Button, Container } from "react-bootstrap";
export default function UpdateContent(props) {

  // All image objects
  const [imageData, setImageData] = useState([]);

  // All coordinate objects
  const [gpsData, setGpsData] = useState([]);

  // Image object that is being edited
  const [selectedImage, setSelectedImage]  = useState(null);

  // Coordinate object that is being edited
  const [selectedCoord, setSelectedCoord]  = useState(null);

  // Fetches image and coordinate objects
  useEffect(() => {
    axios.get('http://localhost:5000/images/')
    .then((res) => {
      setImageData(res.data.data);
    },(err) => {
      console.log(err);
    });
    axios.get('http://localhost:5000/coordinates/')
    .then((res) => {
      setGpsData(res.data.data);
    },(err) => {
      console.log(err);
    });
  }, [])

  // Sends a request to update the selected image object
  const onUpdateImage = (e) => {
    e.preventDefault();
    var formData = new FormData();

    //Adds selectedImage to formData
    for (var item in selectedImage ) {
      if(item === "contentImages") {
        for (let i in selectedImage.contentImages) {
          formData.append('contentImages', selectedImage.contentImages[i])
        }
      } 
      else if(item === "contentImageNames") {
        for (let i in selectedImage.contentImageNames) {
          formData.append('contentImageNames', selectedImage.contentImageNames[i])
        }
      }
      else if(item === "removedImages") {
        for (let i in selectedImage.removedImages) {
          formData.append('removedImages',selectedImage.removedImages[i])
        }
      }
      else {
        formData.append(item, selectedImage[item]);
      }
    }

    //Adds gpsData to formData, needed for updating audio files
    for (let i in gpsData) {
      console.log(gpsData[i].audioName)
      formData.append('gpsAudioNames', gpsData[i].audioName)
    }
  
    axios.put('http://localhost:5000/images/'+ selectedImage.id, formData)
    .then((res) => {
      setImageData(res.data.data);
      setSelectedImage(null);
    },(err) => {
      console.log(err);
    });
  }

  // Sends a request to update the selected coordinate object
  const onUpdateCoordinates = (e) => {
    e.preventDefault(e);
    var formData = new FormData();
    for (var item in selectedCoord ) {
        formData.append(item, selectedCoord[item]);
    }
    axios.put('http://localhost:5000/coordinates/' + selectedCoord.id, formData)
    .then((res) => {
      setGpsData(res.data.data);
      setSelectedCoord(null);
    },(err) => {
      console.log(err);
    });
  }

  // Sends a request to remove the selected image object
  const onRemoveImage = (e) => {
    if (window.confirm('Are you sure you wish to remove this image component?')) {
    axios.delete('http://localhost:5000/images/' + e.target.id, {data: {imageData, gpsData}})
      .then((res) => {
        setImageData(res.data.data);
        setSelectedImage(null);
      },(err) => {
        console.log(err);
      });
    }
  }

  // Sends a request to remove the selected coordinate object
  const onRemoveCoordinates = (e) => {
    if (window.confirm('Are you sure you wish to remove this coordinate component?')) {
      axios.delete('http://localhost:5000/coordinates/' + e.target.id, {data: {gpsData, imageData}})
      .then((res) => {
        setGpsData(res.data.data);
      },(err) => {
        console.log(err);
      });
    }
  }

  // Changes the currently selected image object to another
  const onChangeSelectedImage = (newSelectedImage) => {
    if(selectedImage != null && selectedImage.id === newSelectedImage.id) {
      setSelectedImage(null);
    }
    else {
      setSelectedImage({...newSelectedImage, removedImages: [], contentImages: []})
    }
  }

  // Changes the currently selected coordinate object to another
  const onChangeSelectedCoord = (newSelectedCoord) => {
    if(selectedCoord != null && selectedCoord.id === newSelectedCoord.id) {
      setSelectedCoord(null);
      setPosition([]);
    }
    else {
      setSelectedCoord(newSelectedCoord);
      setPosition([newSelectedCoord.latitude, newSelectedCoord.longitude]);
    }
  }

  const onRemoveAudio = (e, audioName) => {
    e.preventDefault();
    if (window.confirm('Are you sure you wish to remove this content image?')) {
      setSelectedImage({...selectedImage, audioName:""});
    }
  }

  // Handles content image removals
  const onRemoveContentImage = (e, imgName) => {
    e.preventDefault();
    if (window.confirm('Are you sure you wish to remove this content image?')) {
      var names = selectedImage.contentImageNames.filter(x => x !== imgName);
      var imgs = selectedImage.contentImages.filter(x => x.name !== imgName);
      var removed = selectedImage.removedImages;
      removed.push(imgName);

      setSelectedImage({...selectedImage, contentImageNames: names, contentImages: imgs, removedImages: removed})
    }
  }

  // Handles content image additions
  const onAddContentImage = (e) => {
    e.preventDefault();

    if(selectedImage.contentImageNames.filter(imgName => imgName === e.target.files[0].name).length === 0) {
      var imgs = selectedImage.contentImages;
      imgs.push(e.target.files[0]);

      var imgNames = selectedImage.contentImageNames;
      imgNames.push(e.target.files[0].name);

      setSelectedImage({...selectedImage, contentImages: imgs, contentImageNames: imgNames})
    }
  }

  //map handeling
  const [position, setPosition] = useState([])
  function handleMapChange(newPosition) {
    setSelectedCoord({...selectedCoord, latitude: newPosition[0], longitude: newPosition[1]})
    setPosition(newPosition);
  }

  return (
    <Row>
      <Col md>
        <h5 className="py-2">Images</h5>
        {Object.keys(imageData).map((keyName, i) => (
          <ListGroup>
            <ListGroup.Item action onClick={() => onChangeSelectedImage(imageData[i])}>{imageData[i].name}</ListGroup.Item>
            {(selectedImage != null && imageData[i].id === selectedImage.id) && 
              <Container className="pb-3 border">
                <form onSubmit={onUpdateImage} className="px-3 pt-1">
                  <Form.Group controlId="imgComponentName">
                    <Form.Label htmlFor="name">Object name: </Form.Label> <br/>
                    <Form.Control type="text" id="name" required value={selectedImage.name} onChange={e => setSelectedImage({...selectedImage, name: e.target.value})}/>
                  </Form.Group>
                  <Form.Group controlId="trackedImageInfo">
                    <Form.Label>Tracked image name: {selectedImage.trackedImageName}</Form.Label><br/>
                    <Form.File id="tracked" accept='.jpg, .png' label="Change tracked image: " onChange={e => setSelectedImage({...selectedImage, image: e.target.files[0]})} />
                  </Form.Group>
                  <Form.Group controlId="description">
                    <Form.Label htmlFor="desc">Description: </Form.Label>
                    <Form.Control as='textarea' rows="3" id="desc" required value={selectedImage.text} onChange={e => setSelectedImage({...selectedImage, text: e.target.value})}/>
                  </Form.Group>
                  <Form.Group controlId="contentImages">
                    <Form.Label htmlFor="images">Content images (optional): </Form.Label>
                    <Form.File label="Add new content image" id="images" accept='.jpg, .png' onChange={e => onAddContentImage(e)}/>
                    <Form.Text className="text-muted">Add new content images one at a time they will show up below this text.</Form.Text>
                    {selectedImage.contentImageNames.map(imgName => (
                      <Form.Group controlId="contentImage">
                        <Form.Label htmlFor="contentImg" className="pr-1">{imgName}</Form.Label>
                        <Button id="contentImg" name="removeContentImg" variant="outline-danger" onClick={e => onRemoveContentImage(e, imgName)}>Remove Content Image</Button>
                      </Form.Group>
                    ))}
                  </Form.Group>
                  <Form.Group controlId="audioFileForImg">
                    <Form.Label className="pr-1">Name of the audio file: {selectedImage.audioName} </Form.Label> 
                    <Button variant="outline-danger" onClick={e => onRemoveAudio(e, selectedImage.audioName)}>Remove audiofile</Button> <br/>
                    <Form.Label htmlFor="audio"></Form.Label>
                    <Form.File label="Add/Change audiofile (optional): " id="audio" accept='.mp3' onChange={e => setSelectedImage({...selectedImage, audio: e.target.files[0]})}/>
                  </Form.Group>
                  <Row>
                    <Form.Group as={Col} sm>
                      <Button type="submit" variant="outline-primary">Save changes</Button>
                    </Form.Group>
                    <Form.Group as={Col} sm>
                      <Button id={imageData[i].id} variant="outline-danger" onClick={onRemoveImage}>Remove component "{selectedImage.name}"</Button>
                    </Form.Group>
                  </Row>
                </form>
              </Container>
            }
          </ListGroup>
        ))}
      </Col>
      <Col md>
        <h5 className="py-2">Coordinates</h5>
        {Object.keys(gpsData).map((keyName, i) => (
          <ListGroup>
            <ListGroup.Item action onClick={() => onChangeSelectedCoord(gpsData[i])}>{gpsData[i].name}</ListGroup.Item>
            {(selectedCoord != null && gpsData[i].id === selectedCoord.id) && 
            <Container className="pb-3 border">
              <form onSubmit={onUpdateCoordinates} className="px-3 pt-2">
                <Form.Group controlId="map">
                  <Amap position={position} onChange={handleMapChange}/>
                  <Form.Text className="text-muted">
                    Notice: Position of the marker changes when you click on the map!
                  </Form.Text>
                </Form.Group>
                <Form.Group controlId="coordComponentName">
                    <Form.Label htmlFor="name">Object name</Form.Label> <br/>
                    <Form.Control type="text" name="name" id="name" required value={selectedCoord.name} onChange={e => setSelectedCoord({...selectedCoord, name: e.target.value})}/>
                  </Form.Group>
                <Form.Group controlId="latitude">
                  <Form.Label htmlFor="lat">Latitude</Form.Label>
                  <Form.Control type="text" id="lat" required value={selectedCoord.latitude} />
                </Form.Group>
                <Form.Group controlId="longtitude">
                  <Form.Label htmlFor="lng">Longitude</Form.Label>
                  <Form.Control type="text" id="lng" required value={selectedCoord.longitude} />
                </Form.Group>
                <Form.Group controlId="radius">
                  <Form.Label htmlFor="rad">Radius (meters)</Form.Label>
                  <Form.Control type="number" id="rad" defaultValue={selectedCoord.radius} onChange={e => setSelectedCoord({...selectedCoord, radius: e.target.value})}/>
                </Form.Group>
                <Form.Group controlId="activationTime">
                  <Form.Label htmlFor="act">Activation (seconds)</Form.Label>
                  <Form.Control type="number" id="act" defaultValue={selectedCoord.activation} onChange={e => setSelectedCoord({...selectedCoord, activation: e.target.value})}/>
                </Form.Group>
                <Form.Group controlId="deactivationTime">
                  <Form.Label htmlFor="dact">Deactivation (seconds)</Form.Label>
                  <Form.Control type="number" id="dact" defaultValue={selectedCoord.deactivation} onChange={e => setSelectedCoord({...selectedCoord, deactivation: e.target.value})}/>
                </Form.Group>
                <Form.Group controlId="audioFileForCoord">
                  <Form.Label>Name of the audio file: {selectedCoord.audioName}</Form.Label> <br/>
                  <Form.File id="audio" accept='.mp3' label="Change audio file: " onChange={e => setSelectedCoord({...selectedCoord, audio: e.target.files[0], audioName: e.target.files[0].name})} />
                </Form.Group>
                <Row>
                <Form.Group as={Col} sm>
                  <Button type="submit" variant="outline-primary">Save changes</Button>
                </Form.Group>
                <Form.Group as={Col} sm>
                  <Button id={gpsData[i].id} variant="outline-danger" onClick={onRemoveCoordinates}>Remove Component "{selectedCoord.name}"</Button>
                </Form.Group>
                </Row>
              </form>
            </Container>
            } 
          </ListGroup>
        ))}
      </Col>
    </Row>
  )
}
