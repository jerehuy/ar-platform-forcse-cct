import React from 'react';
import { BrowserRouter as Router, Route} from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import Navigation from "./components/navigation.component";
import AddImage from "./components/add-image.component";
import AddCoordinate from "./components/add-coordinate.component";
import UpdateContent from "./components/update-content.component";
import {Container} from "react-bootstrap";

function App() {
  return (
    <Router>
      <Container className="bg-light pb-2">
        <Navigation/>
        <Route path="/image" component={AddImage}/>
        <Route path="/coordinate" component={AddCoordinate}/>
        <Route path="/update" component={UpdateContent}/>
      </Container>
    </Router>
  );
}

export default App;