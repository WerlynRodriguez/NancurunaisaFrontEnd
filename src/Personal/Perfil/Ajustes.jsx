import React, { useState } from 'react';
import { Layout, Typography,Avatar, Menu, Dropdown, PageHeader, Button, Collapse, Checkbox } from 'antd';
import Logout from "../../Components/LogOutButton"
import "../../Utils/TextUtils.css"
import { DatabaseFilled, FormatPainterFilled, NotificationFilled, ReadFilled, SmileFilled, SnippetsFilled } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

function ButtonConfig(props){
    const { text, icon} = props;
    return(
        <Button type="default" size="large" style={{textAlign:"start",height:60}} icon={icon}>{text}</Button>
    )
}

export default function Ajustes(){
    let Navigate = useNavigate();
    const [IHBB,setIHBB] = useState(localStorage.getItem("Interfaz_HideBottomBar")=="true"? true:false);
    function getItem(label, key, icon, children, type) {
        return {key,icon,children,label,type};
      }
      
    //All the items that will be displayed in the menu
    const items = [
    getItem("Notificaciones", "opNot",<NotificationFilled/>),
    getItem('Administrar', 'opAdm', <DatabaseFilled />, [
        getItem('Usuarios', "opAdmU", <SmileFilled />),
        getItem('Roles', "opAdmR", <SnippetsFilled />),
    ]),
    getItem('Personalizar', 'opPer', <FormatPainterFilled />,),
    getItem('Ayuda', 'opAyu', <ReadFilled />),
    ];

    function handleMenuClick(e) {
        switch(e.key){
            case "opNot": console.log("Notificaciones"); break;
            case "opAdmU": Navigate("/Personal/Ajustes/Admin/Usuarios"); break;
            case "opAdmR": Navigate("/Personal/Ajustes/Admin/Roles"); break;
        default: console.log("Error"); break;
        }
    }

    return(
        <Layout>
            <PageHeader ghost={false} title={<Title level={3}>Configuración</Title>}/>
            <Layout className='ContentLayout'>
                <div style={{display:"flex",flexDirection:"column",maxWidth:600,width:"100%",backgroundColor:"white"}}>
                    <div style={{display:"flex",flexDirection:"row",paddingTop:15,paddingBottom:15}}>
                        <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",width:"100px",height:"100px"}}>
                            <DatabaseFilled style={{color:"black",fontSize:"50px"}}/>
                        </div>
                        <div style={{display:"flex",flexDirection:"column",justifyContent:"center",width:"80%",marginLeft:25}}>
                            <Title level={4}>Nombre de Usuario</Title>
                            <Typography>Rango de usuario</Typography>
                        </div>
                    </div>
                    <Menu mode="inline" defaultSelectedKeys={['1']} onClick={(e)=>{handleMenuClick(e)}} items={items}/>
                    
                    <Checkbox checked={IHBB} onChange={(e)=>{
                        setIHBB(e.target.checked); localStorage.setItem('Interfaz_HideBottomBar', e.target.checked);
                    }}>Ocultar siempre Barra de Navegación</Checkbox>
                </div>
                
                <Logout/>
            </Layout>
        </Layout>
        )
}