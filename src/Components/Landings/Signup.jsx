import axios from "axios";
import img from "../../assets/images/Lsimg.jpg"
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { FaEyeSlash,FaEye  } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { message } from "antd";

const Signup=()=>{
    const myNav= useNavigate()
    const [ptype , setPtype]=useState("password");
    const [picon , setPicon]=useState(<FaEyeSlash />);
    const handleShow=()=>{
        if(picon.type.name=="FaEyeSlash"){
            setPtype("text")
            setPicon(<FaEye />)
        }
        else{
            setPtype("password")
            setPicon(<FaEyeSlash />)
        }
    }
    const [ptype2 , setPtype2]=useState("password");
    const [picon2 , setPicon2]=useState(<FaEyeSlash />);
    const handleShow2=()=>{
        console.log();
        
        if(picon2.type.name=="FaEyeSlash"){
            setPtype2("text")
            setPicon2(<FaEye />)
        }
        else{
            setPtype2("password")
            setPicon2(<FaEyeSlash />)
        }
    }
    const [input,setInput]=useState({})
    const handleInput=(e)=>{
        let name = e.target.name;
        let value = e.target.value;
        setInput((values) => ({ ...values, [name]: value }))
    }
    let e_list = [];
    const load = () => {
        let api = "http://localhost:3000/Registrations";
        axios.get(api).then((res) => {
            res.data.map((k) => {
                e_list = e_list.concat(k.email);
            });
        });
    };
    useEffect(()=>{load()})
    const handleRegistration=()=>{
        const field = document.getElementsByClassName("inputfield") 
        if(input.name==""){
            message.error("Enter Name");
            field[0].focus(); 
        }
        
        else if(!((/^[a-z A-Z]+$/).test(input.name))){
            message.error("Enter valid Name");
            field[0].focus(); 
        }
        else if(!((input.email).includes("@gmail.com"))){
            message.error("Enter valid Email");
            field[1].focus(); 
        }
        else if(e_list.includes(input.email)){
            message.error("Email already in use") 
            field[1].focus()
        }
        else if(isNaN(input.mob)){
            message.error("Enter Vaild mob number") 
            field[2].focus()
        }
        else if((input.mob).length!=10){
            message.error("Enter Vaild mob number") 
            field[2].focus()
        }
        else if(input.pass.length<8){
            message.error("password must be of atleast 8 characters");
            field[3].focus(); 
        }
        else if(!((input.pass).match(/[!@#$<>]/))){
            message.error("password must include special characters");
            field[3].focus(); 
        }
        else if(!(input.pass===field[4].value)){
            message.error("Confirm password must be same");
            field[4].focus(); 
        }       
        else{ 
            let api ="http://localhost:3000/Registrations"
            axios.post(api,input).then((res)=>{
                message.success("Registration Successfull")
                myNav("/login")
            })
        }
       
    }
    return(
        <>
          <div className='landing-main' >
                <div id="overlay" style={{ backgroundColor: "rgba(0, 0, 0, 0.38)" }}></div>
                <img className="loginSignup" src={img} />
                <div className="form">
                    <Form>
                    <Form.Group className="mb-3" controlId="formBasicName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" placeholder="Enter name" 
                                 name='name'
                                 vlaue={input.name}
                                 onChange={handleInput}
                                 className="inputfield"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="email" placeholder="Enter email" 
                                 className="inputfield"
                                 name='email'
                                 vlaue={input.email}
                                 onChange={handleInput}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicMob">
                            <Form.Label>Mobile No.</Form.Label> 
                            <Form.Control type="text" placeholder="Enter mobile no." 
                                 name='mob'
                                 className="inputfield"
                                 vlaue={input.mob}
                                 onChange={handleInput}
                            />
                            
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <div className="icon" onClick={handleShow}>{picon}</div>
                            <Form.Control type={ptype}  placeholder="Password" 
                                 name='pass'
                                 className="inputfield"
                                 vlaue={input.pass}
                                 onChange={handleInput}
                            />
                            
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicCPassword">
                            <Form.Label>Confirm Password</Form.Label>
                            <div className="icon" onClick={handleShow2}>{picon2}</div>
                            <Form.Control type={ptype2} placeholder="Password" 
                                 className="inputfield"
                            />
                        </Form.Group>

                        <center>
                            <Button className="buttonLoginSignuppage" variant="light" onClick={handleRegistration}>Sign Up</Button>
                        </center>

                    </Form>
                </div>
            </div>


        </>
    )
}
export default Signup