//import { Link } from 'react-router-dom'; Tämä korvattu react-router-bootstrapillä
import React, { useState } from 'react';
import { Navbar, Nav, Form, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';


export default function Navigation(props) {

  // Path to resource folder can be changed without submitting
  const [destination, setDestination] = useState("");
  // Path to resource folder can be changed only with submiting use this path
  const [permaDestination, setPermaDestination] = useState("none");

  const onSubmit = (e) => {
    e.preventDefault();
    setPermaDestination(destination);
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
            <Form.Label className="pr-2">Unity Resource Folder Path: </Form.Label>
            <Form.Control required type="text" onChange={e => setDestination(e.target.value)}/>
          </Form.Group>
          <Button type="submit" variant="success">Submit</Button>
        </form>
        <Navbar.Text className="pl-2">{permaDestination}</Navbar.Text>
      </Navbar.Collapse>
    </Navbar>
  )
}