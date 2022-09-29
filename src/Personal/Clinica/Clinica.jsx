import React from 'react';
import { Layout, Typography,Avatar,Row,Col } from 'antd';
import "../../Utils/TextUtils.css";
import {SmileFilled,MedicineBoxFilled,EnvironmentFilled, PercentageOutlined, HeartOutlined, ContainerOutlined} from "@ant-design/icons";
import { Link } from 'react-router-dom';
import { DenyFunction, Ranges } from '../../Utils/RangeProviders';
const { Title } = Typography;

function ButtonLink(props){
    return(<Link to={props.to}>
        <Row className='Cardview'>
            <Col className='ColCardTitle' span={18}>
                <Title level={3}>{props.title}</Title>
            </Col>
            <Col className='ColCardIcon' span={4}>
                {props.icon}
            </Col> 
        </Row>
    </Link>)
}

export default function Clinica(){
    return(<div>
        <div className="BackMenu"/>
        <Title level={2} style={{marginTop:"20px",marginLeft:"20px",color:"white"}}>Clínica</Title>

        <Layout className='ContentLayout' style={{borderTopLeftRadius:"50px",borderTopRightRadius:"50px",backgroundColor:"white"}}>
            <ButtonLink to='/Personal/Clinica/Pacientes' title="Pacientes" icon={<SmileFilled style={{color:"#5a33ae",fontSize:"40px"}}/>}/>
            
            <ButtonLink to ="/Personal/Clinica/Terapeutas" title="Terapeutas" icon={<MedicineBoxFilled style={{color:"#5a33ae",fontSize:"40px"}}/>}/>

            <ButtonLink to='/Personal/Clinica/Terapias' title='Terapias' icon={<HeartOutlined style={{color:"#5a33ae",fontSize:"40px"}}/>}/>
            
            <ButtonLink to='/Personal/Clinica/Sucursales' title='Sucursales' icon={<EnvironmentFilled style={{color:"#5a33ae",fontSize:"40px"}}/>}/>

            <ButtonLink to="/Personal/Clinica/Promos" title="Promociones" icon={<PercentageOutlined style={{color:"#5a33ae",fontSize:"40px"}}/>}/>
        </Layout>
        </div>)
}