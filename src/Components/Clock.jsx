import "./Clock.css";
import {Col,Row} from 'antd';
import { useState } from "react";
import day from "../resources/sunIcon.svg";
import night from "../resources/moonIcon.svg";
import moment from 'moment';

function RangeDate(min,max,today){
    var hourmin = min.split(":");
    var hourmax = max.split(":");

    if (Number(hourmin[0]) <= today.getHours() && Number(hourmax[0]) >= today.getHours()){
        if (Number(hourmin[0]) == today.getHours() || Number(hourmax[0]) == today.getHours()){
            if (Number(hourmin[1]) <= today.getMinutes() && Number(hourmax[1]) <= today.getMinutes()){
                return true;
            }else return false;
        } else return true;
    }
    else return false;
}

export default function ClockShow(props){
    var isday = false;
    var display = "Fuera del horario laboral";
    var sucur = "";
    var color = "red";
    var today = new Date();

    if (RangeDate("06:00","18:00",today)) {
        isday = true;   
    }


    if (RangeDate(props.entrada,props.salida,today)){
        if (/*Si esta con paciente*/ false){
            display = "En una cita";
            sucur = "Dirección: "+props.sucursal;
            color = "green";
        }else{
            display="Dentro del horario laboral";
            sucur = "Sucursal: " + props.sucursal;
            color="blue";
        }
    }

    return(
        <Row className="clockPerfil" style={{marginTop:"10px",display:props.visible? "":"none"}}>
            <Col span={5} className="DayNight" style={{backgroundImage:`url(${isday?day:night})`}} />
            <Col span={18} style={{paddingTop:"5%", textAlign:"center"}}>
                <h1> {display} </h1>
                <h5> {sucur} </h5>
            </Col>
            <Col span={1} style={{height:"100%",backgroundColor:color,borderBottomRightRadius:"25px",borderTopRightRadius:"25px"}}/>
        </Row>
    )
}