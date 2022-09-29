import { Navigate, Outlet, useLocation } from "react-router-dom";

export function getMyRange() {
    /*const user = JSON.parse(localStorage.getItem('user'));
    return user.Roll;*/
    return Ranges.Owner;
}

function includes(array){
    const myRange = getMyRange();
    for (let index = 0; index < array.length; index++) {
        if (array[index] == myRange){ return true }
    }
    return false;
}

export function AllowFunction(Permited){
    if (includes(Permited)){ 
        return true 
    }
    return false
}

export function DenyFunction(Exclude){
    if (includes(Exclude)){ 
        return false 
    }
    return true
}

export function Allow(Permited){
    if (includes(Permited.Permited)){ 
        return (<Outlet/>) 
    }
    return (<Navigate to="/Personal/Clinica" state={{from:useLocation()}} replace/>)
}

export function Deny(Exclude){
    if (includes(Exclude.Exclude)){ 
        return (<Navigate to="/Personal/Clinica" state={{from:useLocation()}} replace/>) 
    }
    return (<Outlet/>)
}

export const Ranges={ Owner:0, Manager:1,Employ:2,Invited:3 }