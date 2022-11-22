import React, { useEffect, useState } from 'react';
import { Layout, Typography,Avatar,Row,Col, Skeleton, List, Space } from 'antd';
import "../../Utils/TextUtils.css";
import {SmileFilled,MedicineBoxFilled,EnvironmentFilled, PercentageOutlined, HeartOutlined, ContainerOutlined} from "@ant-design/icons";
import { Link, useNavigate } from 'react-router-dom';
import { RangeProvider } from '../../Utils/RangeProviders';
const { Title } = Typography;

//This component is the main page of the clinica seccions
export default function Clinica(){
    let Navigate = useNavigate();
    const buttons = [
        {
            title:"Pacientes",
            link:"/Personal/Clinica/Pacientes",
            icon:<SmileFilled/>
        },
        {
            title:"Terapeutas",
            link:"/Personal/Clinica/Terapeutas",
            icon:<MedicineBoxFilled/>
        },
        {
            title:"Terapias",
            link:"/Personal/Clinica/Terapias",
            icon:<HeartOutlined/>
        },
        {
            title:"Sucursales",
            link:"/Personal/Clinica/Sucursals",
            icon:<EnvironmentFilled/>
        },
        {
            title:"Promociones",
            link:"/Personal/Clinica/Promos",
            icon:<PercentageOutlined/>
        }
    ]

    const [rangeProvider,setRangeProvider] = useState(new RangeProvider());
    const [loading,setLoading] = useState(true);

    useEffect(() => {
        rangeProvider.loadPermisos(() => {
            setLoading(false);
        });
    },[]);

    function ButtonLink(props){
        if (loading) return null;

        //If the user has the permission for action "Listar"
        if (!rangeProvider.verifyPermiso("Listar",props.title)) return null;

        return(
            <div style={{width:"100%",padding:"8px 15px"}}>
                <Row 
                className="Cardview"
                onClick={() => {Navigate(props.to)}}>
                    <Col span={18}>
                        <Title level={3}>{props.title}</Title>
                    </Col>
                    <Col span={4}>
                        {props.icon}
                    </Col> 
                </Row>
            </div>
        );
    }

    return(<div>
        <div className="BackMenu"/>

        <Title 
        level={2} 
        style={{marginTop:"20px",marginLeft:"20px",color:"white"}}>
            Clínica
        </Title>

        <Layout 
        className='ContentLayout' 
        style={{borderTopLeftRadius:"50px",borderTopRightRadius:"50px"}}>

            {loading ?
            
            <Skeleton.Button
            active
            shape="round"
            style={{minWidth: "300px",minHeight: "100px"}}/>
            :
            <List
            style={{width:"100%"}}
            grid={{ gutter: 16, xs: 1, sm: 2, md: 2,lg: 2,xl: 3,xxl: 3 }}
            dataSource={buttons}
            renderItem={(item,index) => (
                <ButtonLink
                    key={index}
                    to={item.link}
                    title={item.title}
                    icon={item.icon}/>
            )}
            />
                
            }
        </Layout>
        </div>)
}