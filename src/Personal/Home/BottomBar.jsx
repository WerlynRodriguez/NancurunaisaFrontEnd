import React, { useState } from 'react';
import { Row, Col } from 'antd';
import {
    HomeOutlined,
    SettingOutlined,
    CalendarOutlined,
    HeartOutlined,
    EyeInvisibleOutlined,
    EyeOutlined,
    PieChartOutlined
} from '@ant-design/icons';
import "./BottomBar.css";
import { useNavigate} from "react-router-dom";

function BottomBar (){
    let Navigate = useNavigate();
    const Unselect = "unselected";
    const Selected = "selected";
    const colapsedNav = "colNav"
    const [actualIndex,setActualIndex] = useState(2);
    const [actualMul,setActualMul] = useState(2);
    const [menu,setmenu] = useState([
        {mul:6,sel:false},{mul:3,sel:false},{mul:2,sel:true},
        {mul:1.5,sel:false},{mul:1.2,sel:false}
    ]);
    const [iscollapsed,setCollapsed] = useState(localStorage.getItem("Interfaz_HideBottomBar")=="true"? true:false);


    const handleClick = (index) =>{
        if(index != actualIndex){
            const aux = menu;

            aux[index].sel = true;
            aux[actualIndex].sel = false;

            setActualIndex(index);
            setActualMul(aux[index].mul);
            setmenu(aux);

            switch(index){
                case 0:
                    Navigate("/Personal/Citas");
                    break;
                case 1:
                    Navigate("/Personal/Clinica");
                    break;
                case 2:
                    Navigate("/Personal/Home");
                    break;
                case 3:
                    Navigate("/Personal/Reportes")
                    break;
                case 4:
                    Navigate("/Personal/Ajustes");
                    break;
                default:
                    break;
            }
        }
    }

    return(
        <Row className={iscollapsed?colapsedNav:'nav'}>
            <div style={{marginLeft:`calc((100%/${actualMul}) - 40px)`,display:iscollapsed?"none":""}} className='indicator'/>
            <Col onClick={() => {setCollapsed(!iscollapsed)}} span={iscollapsed? 24:2} className={iscollapsed? "selectedHide":Unselect}>{iscollapsed?<EyeOutlined/>:<EyeInvisibleOutlined/>} <div>Menú</div> </Col>
            <Col style={{display:iscollapsed?"none":""}} onClick={() => handleClick(0)} className={menu[0].sel ? Selected : Unselect} span={4}>
                <CalendarOutlined />
                <div>Citas</div>                
            </Col>
            <Col style={{display:iscollapsed?"none":""}} onClick={() => handleClick(1)} className={menu[1].sel ? Selected : Unselect} span={4}>
                <HeartOutlined />
                <div >Clinica</div>
            </Col>
            <Col style={{display:iscollapsed?"none":""}} onClick={() => handleClick(2)} className={menu[2].sel ? Selected : Unselect} span={4}>
                <HomeOutlined/>
                <div >Inicio</div>
            </Col>
            <Col style={{display:iscollapsed?"none":""}} onClick={() => handleClick(3)} className={menu[3].sel ? Selected : Unselect} span={4}>
                <PieChartOutlined />
                <div >Reportes</div>
            </Col>
            <Col style={{display:iscollapsed?"none":""}} onClick={() => handleClick(4)} className={menu[4].sel ? Selected : Unselect} span={4}>
                <SettingOutlined />
                <div >Ajustes</div>
            </Col>
            <Col style={{display:iscollapsed?"none":""}} span={2}/>
        </Row>
    );
}

export default BottomBar