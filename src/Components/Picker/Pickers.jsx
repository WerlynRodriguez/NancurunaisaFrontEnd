/*import { FetchSucursal } from "../Utils/FetchingInfo";*/
import React, { useState } from 'react';
import { Button} from 'antd';
import Sucursales from '../../Personal/Clinica/Sucursal/Sucursales';
import { EnvironmentFilled } from "@ant-design/icons";

export default function PickerSucursal(props){
    const [visible, setVisible] = useState(false);

    const showModal = () => {setVisible(true); onFocus(true)};
    const handleOk = () => {setVisible(false);onFocus(false)};
    const handleCancel = () => {setVisible(false); onFocus(false)}

    const onClickSucur=(id,name)=>{
        if(typeof props.onChange === "function"){
            props.onChange(id,name)
        }
        handleOk();
    }

    const onFocus=(sta)=>{
        if (typeof props.onFocus === "function") {
            props.onFocus(sta);
        }
    }

    return(<div style={{width:"80%",display:"flex",flexDirection:"column",marginLeft:"10%",marginRight:"10%"}}>
        <Button icon={<EnvironmentFilled />} type='round' onClick={()=>{showModal()}}>
                Seleccionar Sucursal
         </Button>
        <div style={{position:"fixed",top:"0",left:"0",bottom:"0",width:"100%",height:"100%",backgroundColor:"rgba(0,0,0,0.5)",display:visible?"flex":"none",zIndex:"9"}}>
            <div style={{maxWidth:"600px",width:"100%",height:"100%",backgroundColor:"white"}}>
                <Sucursales picker={true} onClick={(id,name)=>{onClickSucur(id,name)}} onBack={()=>{handleCancel()}}/>
            </div>
        </div>
    </div>)
}