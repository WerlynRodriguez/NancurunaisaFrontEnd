import { AntDesignOutlined, FieldTimeOutlined, UserOutlined } from "@ant-design/icons";
import {Avatar, Space, Badge, Card, Typography, Divider} from "antd";
import React from 'react';
import { toAmPm } from "../../Utils/Calwulator";

export default function ItemViewCita(props){
    const ClickHandler = (id) =>{
        if (typeof props.onClick === 'function') {
            props.onClick(id);
        }
    }
    return (
        <Card className="ItemTera" hoverable size="small" onClick={()=>{ClickHandler(props.id)}}
        title={<div>
            <Badge status={props.status}/><FieldTimeOutlined/>
            {toAmPm(props.hora)}
            <div style={{float:"right"}}><Avatar.Group maxCount={2} maxPopoverTrigger="click" 
            maxStyle={{color: 'white',backgroundColor: '#592085'}}>
                    <Avatar style={{backgroundColor: '#f56a00'}}>M</Avatar>
                    <Avatar style={{backgroundColor: '#f56a00'}}>W</Avatar>
                    <Avatar style={{backgroundColor: '#87d068'}} icon={<UserOutlined/>}/>
                    <Avatar style={{backgroundColor: '#1890ff'}} icon={<AntDesignOutlined/>}/>
            </Avatar.Group></div>
            </div>}>
            <div>
                <Space split={<Divider type="vertical" />}>
                <Typography.Text>Cita</Typography.Text>
            </Space>
            </div>
            
            <div>
                <Typography.Paragraph>
                    {props.hab!="-1"? ("Sucursal: "+ props.dir):props.dir}
                </Typography.Paragraph>
            </div>
        </Card>)
}
/*<Row onClick={()=>{}} className="ItemTera">
        <Col className="ColCardIcon" span={16}> <Badge/> 16 Mayo </Col>
        <Col span={4}/>
        <Col span={4}>{props.text}</Col>
    </Row> */