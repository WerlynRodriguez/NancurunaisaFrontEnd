import React, { useState } from 'react';
import { Layout, Typography,Avatar, Menu, Dropdown, PageHeader, Button, Collapse, Checkbox } from 'antd';
import Logout from "../../Components/LogOutButton"
import "../../Utils/TextUtils.css"
import { MoreOutlined } from '@ant-design/icons';

const { Title } = Typography;

export default function Ajustes(){
    const [IHBB,setIHBB] = useState(localStorage.getItem("Interfaz_HideBottomBar")=="true"? true:false);
    return(
        <Layout>
            <PageHeader ghost={false} title={<Title level={3}>Configuración</Title>}/>
            <Layout className='ContentLayout'>
                <Collapse defaultActiveKey={['1']} style={{width:"100%"}}>
                    <Collapse.Panel header="Cuenta" key="1">
                        <div>
                            <Button type="primary">Cambiar contraseña</Button>
                        </div>
                    </Collapse.Panel>
                    <Collapse.Panel header="Interfaz" key="2">
                        <div>
                            <Checkbox checked={IHBB} 
                            onChange={(e)=>{setIHBB(e.target.checked); localStorage.setItem('Interfaz_HideBottomBar', e.target.checked);}}>Ocultar siempre Barra de Navegación</Checkbox>
                        </div>
                    </Collapse.Panel>
                </Collapse>
                
                <Logout/>
            </Layout>
        </Layout>
        )
}