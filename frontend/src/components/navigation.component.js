import { Link } from 'react-router-dom';
import React, { useState } from "react";

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
    <nav className="navbar navbar-dark bg-primary navbar-expand-sm rounded-bottom sticky-top">
        <ul className="navbar-nav">
          <li className="navbar-item active">
            <Link to="/image" className="nav-link">Add image</Link>
          </li>
          <li className="navbar-item active">
            <Link to="/coordinate" className="nav-link">Add coordinate</Link>
          </li>
          <li className="navbar-item active">
            <Link to="/update" className="nav-link">Update content</Link>
          </li>
        </ul>
        <form onSubmit={onSubmit} className="was-validated form-inline float-right">
          <div className="form-group">
            <label htmlFor="path" className="pr-1">Unity Resource Folder Path: </label>
            <input id="path" type="text" required className="form-control" onChange={e => setDestination(e.target.value)}/>
          </div>
          <button type="submit" className="btn btn-success">Submit</button>
          <div className="navbar-text pl-2">{permaDestination}</div>
        </form>
    </nav>
  )
}