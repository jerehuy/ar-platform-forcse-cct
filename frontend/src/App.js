import React, { useState } from "react";
import { BrowserRouter as Router, Route} from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import Navigation from "./components/navigation.component";
import AddImage from "./components/add-image.component";
import AddCoordinate from "./components/add-coordinate.component";
import UpdateContent from "./components/update-content.component";
import {Container} from "react-bootstrap";


function App() {
  const [path, setPath] = useState(null);

  const handleChangePath = (newPath) => {
    setPath(newPath);
  }
  return (
    <Router>
      <Container className="bg-light pb-1 rounded-bottom"> 
        <Navigation onChangePath={handleChangePath}/>
        <Route 
          path="/image"
          render={(props) => (
            <AddImage {...props} path={path} />
          )}
        />
        <Route 
          path="/coordinate"
          render={(props) => (
            <AddCoordinate {...props} path={path} />
          )}
        />
        <Route 
          path="/update"
          render={(props) => (
            <UpdateContent {...props} path={path} />
          )}
        />
      </Container>
    </Router>
  );
}

export default App;