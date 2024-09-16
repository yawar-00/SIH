import axios from "axios";
import img from "../../assets/images/Lsimg.jpg"
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { message } from "antd";
const Login = () => {
    const myNav = useNavigate()
    const [loginField, setLoginField] = useState("");
    const [loginPass, setLoginPass] = useState("");
    const handleLogin = () => {
        let api = `http://localhost:3000/Registrations/?email=${loginField}`;
        axios.get(api).then((res) => {
            const email= document.getElementsByClassName("email")
            if(email[0].value==""){
                message.error("Enter valid email");
                email[0].focus()
            }
            else if (res.data.length == 0) {
                message.error("Invalid E-mail")
            }
            else {
                if (res.data[0].password == loginPass) {
                    
                    localStorage.setItem("name", res.data[0].name)
                    localStorage.setItem("email", res.data[0].email)
                    message.success('Login Successful')
                    myNav("/logined")

                }
                else{
                    message.error("Invalid Password")
                }
            }
        })
    }

    return (
        <>
            <div className='landing-main' >
                <div id="overlay" style={{ backgroundColor: "rgba(0, 0, 0, 0.38)" }}></div>
                <img className="loginSignup" src={img} />
                <div className="form">
                    <Form>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="email" placeholder="Enter email" 
                                vlaue={loginField}
                                className="email"
                                onChange={(e) => { setLoginField(e.target.value) }} 
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Password" 
                                vlaue={loginField}
                                onChange={(e) => { setLoginPass(e.target.value) }}
                            />
                        </Form.Group>

                        <center>
                            <Button className="buttonLoginSignuppage" variant="light" onClick={handleLogin}>Log In</Button>
                        </center>
                    </Form>
                </div>
            </div>

        </>
    )
}
export default Login