import { Typography } from "antd";
import React, { useState, useEffect } from "react";
const { Title } = Typography;

export default function TitleNum(props){
    const {title,num} = props;
    return (
        <div style={{textAlign:"left",width:"180px"}}>
            <div>{title}</div>
            <div style={{width:"100%",border:"1px solid #e8e8e8",backgroundColor:"#e8e8e8"}}/>
            <div style={{backgroundColor:"#F5F5F5",padding:"1px",marginTop:"10px"}}><Title level={3}>{num}</Title></div>
        </div>
    )
}