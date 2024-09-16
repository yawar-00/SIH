import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';

import { Link, useNavigate } from 'react-router-dom';


const LandingNavbar = () => {
  const myNav = useNavigate();
  return (
    <>
      <Navbar className='navbara ' expand="lg" data-bs-theme="dark">
        <Container fluid>
          <Navbar.Brand as={Link} to="/home" className='navbrand'>Echoes of India</Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav className="me-auto my-2 my-lg-0 navs"
              style={{ maxHeight: '175px' }}
              navbarScroll>
              <Nav.Link as={Link} to="/home" className='navLinks'>Our expertise</Nav.Link>
              <Nav.Link as={Link} to="#features" className='navLinks'>Features</Nav.Link>
              <Nav.Link as={Link} to="#pricing" className='navLinks'>Partnerships</Nav.Link>
              <Nav.Link as={Link} to="#" className='navLinks'>About us</Nav.Link>
            </Nav>
            <Link className='navbrand' to="/login" style={{ marginRight: "25px", textDecoration: "none" }}>Log In</Link>
            <Button className='navbrand signup-button' onClick={() => { myNav("/signup") }} variant="light">Sign Up</Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>

    </>


  )
}
export default LandingNavbar