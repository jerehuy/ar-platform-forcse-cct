import React from 'react';
import { BrowserRouter as Router, Route} from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import Navigation from "./components/navigation.component";
import AddImage from "./components/add-image.component";
import AddCoordinate from "./components/add-coordinate.component";
import UpdateContent from "./components/update-content.component";

function App() {
  return (
    <Router>
      <div className="container"> 
        <Navigation/>
        <Route path="/image" component={AddImage}/>
        <Route path="/coordinate" component={AddCoordinate}/>
        <Route path="/update" component={UpdateContent}/>
      </div>
    </Router>
  );
}

export default App;