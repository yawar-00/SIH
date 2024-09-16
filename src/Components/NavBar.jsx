import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import { useEffect } from "react";

import { Link, useNavigate } from 'react-router-dom';


const NavBar = () => {
    const myNav=useNavigate()
    useEffect(()=>{
        if(localStorage.getItem("email")==null){
                myNav("/")
               
        }
    },[])
    const logout =()=>{
        localStorage.clear()
        myNav("/")
    }
    
  return (
    <>
      <Navbar className='navbara ' expand="lg" data-bs-theme="dark">
        <Container fluid>
          <Navbar.Brand as={Link} to="/logined/home" className='navbrand'>Echoes of India</Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav className="me-auto my-2 my-lg-0 navs"
              style={{ maxHeight: '175px' }}
              navbarScroll>
              <Nav.Link as={Link} to="/logined/home" className='navLinks'>Our expertise</Nav.Link>
              <Nav.Link as={Link} to="/logined/home" className='navLinks'>Features</Nav.Link>
              <Nav.Link as={Link} to="/logined/home" className='navLinks'>Partnerships</Nav.Link>
              <Nav.Link as={Link} to="/logined/home" className='navLinks'>About us</Nav.Link>
            </Nav>
            <Button className='navbrand logout-button' onClick={logout} variant="light">Log Out</Button>

          </Navbar.Collapse>
        </Container>
      </Navbar>

    </>


  )
}
export default NavBar