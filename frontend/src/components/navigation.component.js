//import { Link } from 'react-router-dom'; Tämä korvattu react-router-bootstrapillä
import React, { useState } from 'react';
import { Navbar, Nav, Form, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import axios from 'axios';

export default function Navigation({onChangePath}) {

  // Path to resource folder can be changed without submitting
  const [destination, setDestination] = useState("");
  // Path to resource folder can be changed only with submiting use this path
  const [permaDestination, setPermaDestination] = useState("none");

  const onSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/path/update', {path: destination})
      .then((res) => {
        console.log(res);
        setPermaDestination(destination);
        onChangePath(destination);
      },(err) => {
        console.log(err);
      })
  }

  return (
    <Navbar sticky="top" bg="primary" variant="dark" collapseOnSelect className="rounded-bottom">

      <Navbar.Toggle aria-controls="navigation" />
      <Navbar.Collapse id="navigation">
        
        <Nav className="mr-auto">

          <LinkContainer to="/image">
            <Nav.Link>Add image</Nav.Link>
          </LinkContainer>

          <LinkContainer to="/coordinate">
            <Nav.Link>Add coordinate</Nav.Link>
          </LinkContainer>

          <LinkContainer to="/update">
            <Nav.Link>Update content</Nav.Link>
          </LinkContainer>

        </Nav>
        <form onSubmit={onSubmit} className="was-validated form-inline">

          <Form.Group controlId="resourcePath">
            <Form.Label className="pr-1">Unity Resource Folder Path: </Form.Label> <br/>
            <Form.Control required type="text" onChange={e => setDestination(e.target.value)}/>
          </Form.Group>
          
          <Button type="submit" variant="success">Submit</Button>

          <Form.Group className="pl-2">
            <Form.Control readOnly size="sm" value={permaDestination}/>
          </Form.Group>

        </form>

        

      </Navbar.Collapse>
    </Navbar>
  )
}