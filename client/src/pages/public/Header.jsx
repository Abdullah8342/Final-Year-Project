import { Link } from 'react-router-dom'

export const Header = () => {
  return (
    <>
      <div>
        <h1 className="logo">FixNow</h1>
      </div>
      <div>
        <ul className="nav-links">
          <li><a href="/">Home</a></li>
          <li><a href="/aboutus">About Us</a></li>
          <li><a href="/contactus">Contact Us</a></li>
        </ul>

      </div>
      <div className="button">
        <Link to="/login"><button className="btn">Login</button></Link>
        <Link to="/register"><button className="btn">Sign Up</button></Link>
      </div>
    </>
  )
}
