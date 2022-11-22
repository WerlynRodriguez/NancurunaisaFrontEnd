import { AntDesignOutlined, FieldTimeOutlined, UserOutlined } from "@ant-design/icons";
import {Avatar, Space, Badge, Card, Typography, Divider, Row, Col, Tooltip} from "antd";
import React from 'react';
import moment from 'moment';
import { Estados } from "../../Models/Models";
import { toAmPm } from "../../Utils/Calwulator";
import "./TeraTaItem.css";
import "../Clock.css";

import day from "../../resources/sunIcon.svg";
import night from "../../resources/moonIcon.svg";

function RangeDate(min,max,today){
    var hourmin = min.split(":");
    var hourmax = max.split(":");
    var hourtoday = today.split(":");

    if (Number(hourmin[0]) <= hourtoday[0] && Number(hourmax[0]) >= hourtoday[0]){
        if (Number(hourmin[0]) == hourtoday[0] || Number(hourmax[0]) == hourtoday[0]){
            if (Number(hourmin[1]) <= hourtoday[1] && Number(hourmax[1]) <= hourtoday[1]){
                return true;
            }
            else 
                return false;
        } 
        else 
            return true;
    }
    else 
        return false;
}

export default function ItemViewCita(props){
    const {id, idStatus, hora, hab, onClick} = props;
    const myEstado = Estados[`${idStatus}`];

    //Day or Night
    var isday = RangeDate("06:00","18:00",moment(hora).format("HH:mm"));

    const ClickHandler = () =>{
        if (typeof onClick === 'function') {
            onClick(id);
        }
    }

    return (
        <div style={{width:"100%",padding:"6px 15px"}}>
            <Row
            className="ItemTera"
            onClick={() => ClickHandler()}>

                <Col 
                span={4} 
                className="DayNight" 
                style={{backgroundImage:`url(${isday ? day : night})`}} />

                <Col
                span={10}>
                    <Typography.Title
                    level={3}
                    style={{marginBottom:"0px"}}>
                        {toAmPm(hora)}
                    </Typography.Title>
                </Col>
                <Col
                span={8}>
                    {hab ? 
                        <>
                        {hab.idSucursalNavigation.nombreSucursal} <br/>
                        {hab.nombreHabitacion}
                        </>
                    : 
                    "A domicilio"}
                </Col>

                {/* Dot indicates status of terapeuta */}
                <Col 
                span={2}
                style={{display:"flex",alignItems:"center",justifyContent:"center"}}>
                    <Tooltip placement="topRight" title={myEstado.text}>
                        <div style={{width:"10px",height:"40px",backgroundColor:myEstado.color,borderRadius:"25px"}} />
                    </Tooltip>
                </Col>

            </Row>
        </div>
    )
}