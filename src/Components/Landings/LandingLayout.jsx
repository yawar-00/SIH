import { Outlet } from "react-router-dom";
import LandingNavbar from "./LandingNavbar";

const LandingLayout=()=>{
    return(
        <>
            <LandingNavbar/>
            <Outlet/>
        </>
    );
}
export default LandingLayout