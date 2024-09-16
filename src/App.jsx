import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import Landing from './Components/Landing';
import LandingLayout from './Components/Landings/LandingLayout';
import Login from './Components/Landings/Login';
import Signup from './Components/Landings/Signup';
import Layout from './Components/Layout';
import MapComponent from './Components/MapComponent';

const App = () => {
    return (
        <>
            <BrowserRouter>
            
                <Routes>
                    <Route path='/' element={<LandingLayout/>}>
                        <Route index element={<Landing/>}/>
                        <Route path='/home' element={<Landing/>}/>
                        <Route path='/login' element={<Login/>}/>
                        <Route path='/signup' element={<Signup/>}/>

                    </Route>
                    <Route path='/logined' element={<Layout/>}>
                        <Route index element={<Landing/>}/>
                        <Route path='/logined/home' element={<Landing/>}/>
                        <Route path='/logined/maps' element={<MapComponent/>}/>

                    </Route>
                   
                </Routes>
            </BrowserRouter>
           
        </>
    );
};

export default App;
