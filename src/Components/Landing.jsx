import React, { useEffect} from 'react';
import videoBg from '../assets/video2.mp4';
import img1 from "../assets/images/img2.jpeg"
import { useNavigate } from 'react-router-dom';
const Landing = () => {
  const myNav = useNavigate();
  const handleBox =(a)=>{
      if(localStorage.getItem("email")==null){
              myNav("/login")
      }
      else{
        if(a==1){
          window.open('https://en.wikipedia.org/wiki/Culture_of_India', '_blank');
        }
        else if(a==2){
          window.open('https://en.wikipedia.org/wiki/Crafts_of_India', '_blank');
        }
        else if(a==3){
          window.open('https://en.wikipedia.org/wiki/Indian_cuisine', '_blank');
        }
        else if(a==4){
          myNav('/logined/maps')
        }
      }
  }
  return (
      
    <>
      <div className='landing-main' >
        <div id="overlay"></div>
        <video src={videoBg} autoPlay loop muted />
        <div className="content">
          <h1 style={{marginBottom:"25px"}}>Welcome to the Heart of India's Rich Cultural Heritage</h1>
          <p>India, a land where history whispers through ancient monuments, where traditions are woven into the very fabric of daily life, and where diversity thrives in its most vibrant form. From the majestic peaks of the Himalayas to the sun-kissed beaches of the southern coasts, India’s cultural heritage is a tapestry of art, architecture, music, dance, and rituals that span centuries.</p>
        </div>
      </div>
      <div>
        <div className="components">
          <div className="box">
            <div className="innerbox b1" onClick={()=>{handleBox(1)}}>
            </div>
            <center><h5>History</h5></center>
          </div>
          <div className="box">
            <div className="innerbox b2"  onClick={()=>{handleBox(2)}}>
            </div>
            <center><h5>Art & Craft</h5></center>
          </div>
          <div className="box">
            <div className="innerbox b3"  onClick={()=>{handleBox(3)}}>
            </div>
            <center><h5>Cuisine</h5></center>
          </div>
          <div className="box">
            <div className="innerbox b4"  onClick={()=>{handleBox(4)}}>
            </div>
            <center><h5>Explore India</h5></center>
          </div>
        </div>
        <img src={img1} style={{ marginTop: "-20px" }} width={"100%"} height="700px" alt="" />
      </div>
    </>
  );
}

export default Landing;
