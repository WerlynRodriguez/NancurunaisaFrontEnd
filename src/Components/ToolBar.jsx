import { BarsOutlined, CloseOutlined, PlusOutlined } from "@ant-design/icons";
import { useState } from "react";
import "../Utils/TextUtils.css";

export default function ToolBar(props){
    const [collapsed, setCollapsed] = useState(true);
    const {tools} = props;

    if (!tools) return null;

    return (
        <div className={collapsed?"ToolBarCol":"ToolBar"}>
            <button 
            className='BottomRoundButton' 
            onClick={()=>{setCollapsed((v)=>setCollapsed(!v))}}>
                {collapsed ? <BarsOutlined />:<CloseOutlined />}
            </button>
            
            {tools.map((tool, index) => (

                <button
                key={index}
                className='TBbuttons'
                style={{marginBottom:"20px"}}
                onClick={()=>{tool.onClick()}}>
                    {tool.icon}
                </button>
            ))}
        </div>
    )
}