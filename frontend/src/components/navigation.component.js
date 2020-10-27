import React, {Component} from 'react';
import { Link } from 'react-router-dom';

export default class Navigation extends Component {

  render() {
    return (
      <nav className="navbar navbar-dark bg-primary navbar-expand-lg">
        <div className="navbar-collapse">
          <ul className="navbar-nav mr-auto">
            <li className="navbar-item active">
              <Link to="/image" className="nav-link">Add image</Link>
            </li>
            <li className="navbar-item active">
              <Link to="/coordinate" className="nav-link">Add coordinate</Link>
            </li>
          </ul>
        </div>
      </nav>
    )
  }
}