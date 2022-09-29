import React, {useState,useEffect} from 'react';
import { Button, InputNumber} from "antd";
import {
    CaretUpFilled,
    CaretDownFilled
  } from '@ant-design/icons';

export default function TimePicker (props){
    const styleTopArrow = {width:"90%",height:"25%",borderTopRightRadius:"25px",borderTopLeftRadius:"25px",borderBottomLeftRadius:"0px",borderBottomRightRadius:"0px"};
    const styleBottomArrow = {width:"90%",height:"25%",borderTopRightRadius:"0px",borderTopLeftRadius:"0px",borderBottomLeftRadius:"25px",borderBottomRightRadius:"25px"};
    const [value,setValue] = useState(props.defaultValue);
    const Max = Number(props.max);
    const Min = Number(props.min);
    const Step = Number(props.Step);
    const [blockMin,setblockMin] = useState(false);
    const [blockMax,setblockMax] = useState(false);

    const handleUp=()=>{if (value<Max) {handleChange(value+Step);}}
    const validate=(newchange)=>{
        if (newchange==Max || newchange+Step>Max) {setblockMax(true);}else{setblockMax(false);}
        if (newchange==Min || newchange-Step<Min) {setblockMin(true);}else{setblockMin(false);}
    }
    const handleChange=(newchange)=>{
        if (newchange!=null){setValue(newchange);activate(newchange);validate(newchange);}
    }

    const activate=(valor)=>{if(typeof props.onChange === 'function'){props.onChange(valor)}}

    const handleDown=()=>{if (value>Min) {handleChange(value-Step);}}

    return (<div style={{height:"100%"}}>
    <Button type="primary" disabled={blockMax} onClick={()=>{handleUp()}} style={styleTopArrow} icon={<CaretUpFilled/>}/>
    <InputNumber value={value} onChange={(value)=>{handleChange(value)}} className='InputTimerPick' type="number" min={Min} max={Max} style={{width:"90%",height:"50%",fontSize:"500%"}}/>
    <Button type="primary" disabled={blockMin} onClick={()=>{handleDown()}} style={styleBottomArrow} icon={<CaretDownFilled/>}/>
    </div>)
}