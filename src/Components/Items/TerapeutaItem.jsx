import "./TeraTaItem.css";
import {Row,Col,Avatar, Badge, Checkbox, Space} from "antd";
import React, { useState } from 'react';
import { CheckCircleFilled } from "@ant-design/icons";
import useLongPress from "../../Utils/LongPressEvent";

export default function TeraTaItem(props){
    const selected = props.selected;

    const onLongPress = () => {
        if (typeof props.onLongPress === 'function') {
            props.onLongPress(props.id,props.name,selected);
        }
    };

    const onClick = () => {
        if (typeof props.onClick === 'function') {
            props.onClick(props.id,props.name,selected);
        }
    }

    const defaultOptions = {
        shouldPreventDefault: true,
        delay: 500,
    };
    const longPressEvent = useLongPress(onLongPress, onClick, defaultOptions);

    return (<div style={{width:"100%",display:"flex",flexDirection:"row"}}>
    <div style={{width:"10%",display:props.mulSelMode?"flex":"none",flexDirection:"column",justifyContent:"center",alignItems:"center"}}>
        <Checkbox checked={selected} onChange={()=>{onClick()}}/>
    </div>
    <Row {...longPressEvent} className="ItemTera">
        <Col className="ColCardIcon" span={6}>
            <Avatar size="large" src={props.avatar? props.avatar:null}>{props.avatar? null:props.text[0]}</Avatar>
        </Col>
        <Col span={2}/>
        <Col span={16}>
        {props.text}
        </Col>
    </Row>
    </div>);
}//onClick={()=>{ClickHandler(props.id,props.text)}}