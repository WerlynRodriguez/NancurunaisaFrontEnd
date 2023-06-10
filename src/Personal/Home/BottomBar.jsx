import React, { useState } from 'react';
import { Row, Col, Menu } from 'antd';
import {
    HomeOutlined,
    SettingOutlined,
    CalendarOutlined,
    HeartOutlined,
    PieChartOutlined,
    CalendarFilled,
    HeartFilled,
    HomeFilled,
    PieChartFilled,
    SettingFilled
} from '@ant-design/icons';
import { useLocation, useNavigate} from "react-router-dom";
import "./BottomBar.css";
import { getaction } from '../../Utils/ActionsProviders';

export default function BottomBar (){
    let Navigate = useNavigate();
    const local = useLocation();

    const page = getaction(local.pathname, 2);
    const pages = {"Citas":0, "Clinica":1, "Home":2, "Ajustes":4};

    const [selected, setSelected] = useState(pages[page]);

    //=========================================================================
    //This function is called when the user clicks on a button in the bottom bar
    //=========================================================================
    const handleClick = (key) =>{
        setSelected(key);
        switch(key){
            case 0:
                Navigate("/Personal/Citas");
                break;
            case 1:
                Navigate("/Personal/Clinica");
                break;
            case 2:
                Navigate("/Personal/Home");
                break;
            // case 3:
            //     Navigate("/Personal/Reportes")
            //     break;
            case 4:
                Navigate("/Personal/Ajustes");
                break;
            default:
                break;
        }
        
    }

    const items = [
        {
            key: 0,
            label: 'Citas',
            icon: <CalendarOutlined/>,
            iconS: <CalendarFilled/>
        },
        {
            key: 1,
            label: "Clinica",
            icon: <HeartOutlined/>,
            iconS: <HeartFilled/>
        },
        {
            key: 2,
            label: "Home",
            icon: <HomeOutlined/>,
            iconS: <HomeFilled/>
        },
        // {
        //     key: 3,
        //     label: "Reportes",
        //     icon: <PieChartOutlined/>,
        //     iconS: <PieChartFilled/>
        // },
        {
            key: 4,
            label: "Ajustes",
            icon: <SettingOutlined/>,
            iconS: <SettingFilled/>
        },
    ]

    return(
        <div className='bottomBar'>
            {items.map((item, index) => ( 
                <div 
                key={"NavBarOption"+index}
                style={selected === index ? 
                    {backgroundColor: "white", color: "#212121", transform: "scale(1.0)"}
                    :
                    {}
                }
                onClick={()=>{handleClick(item.key)}}>
                    {selected === index ? item.iconS : item.icon}
                    <p>{item.label}</p>
                </div>
             ))}
        </div>
    );
}