import { Link } from 'react-router-dom';

export default function Navigation(props) {

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
    </nav>
  )
}