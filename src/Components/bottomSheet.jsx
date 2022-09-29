import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Modal, Typography } from 'antd';
import React, {useState,useEffect} from 'react';

export default class BottomSheet extends React.Component{
    constructor(){
        super();
        this.state = {
            visible: false,
            title: "",
        }
        this.showModal = this.showModal.bind(this);
    }

    showModal = (title) => {
        console.log("showModal");
        this.setState({
            visible:true
        }) 
    }
    handleOk = () => {
        this.setState({
            visible: false,
        });
    }
    handleCancel = () => {
        this.setState({
            visible: false,
        });
    }
    render(){
        if (this.state.visible) {
            return(
                <div style={{position:"fixed",top:"0",left:"0",height:"100%",width:"100%",alignItems:"flex-end",justifyContent:"center",
                backgroundColor:"rgba(0,0,0,0.5)",display:"flex",zIndex:"9",transition:"opacity 1s linear"}}>
                    anal?
                </div>
            ) 
        }else{
            return (<button onClick={()=>{this.showModal("mierda")}}/>);
        }
        
    }
}

/*<div style={{backgroundColor:"white",width:"100%",maxWidth:"600px",height:"80%",paddingLeft:"20px",paddingRight:"20px",paddingTop:"20px",
                transform:hide? "translateY(100%)":"translateY(0%)",transition:"transform 0.4s ease-in-out",
                borderTopLeftRadius:"25px",borderTopRightRadius:"25px"}}>
                    <Button type="ghost" icon={<CloseOutlined/>} style={{float:"right"}} shape="round" 
                    onClick={this.handleCancel}>Cancelar</Button>
                    <Typography.Title level={4} >{this.state.title}</Typography.Title>
                    <div style={{overflow:"auto"}}>
                        {this.props.children}
                    </div>
                </div> */


/*export default class BottomSheet extends React.Component{
    constructor(){
        this.state = {
            visible: false,
            title: ""}
    }
}*/
    /*const [hide,sethide] = useState(false);

    const onCancel = () =>{
        if (typeof props.onCancel === 'function') {
            sethide(true);
            setTimeout(()=>{props.onCancel();sethide(false);},400);
        }
    }

    return(
        <div style={{position:"fixed",top:"0",left:"0",height:"100%",width:"100%",alignItems:"flex-end",justifyContent:"center",
        backgroundColor:hide?"rgba(0,0,0,0)":"rgba(0,0,0,0.5)",display:props.visible?"flex":"none",zIndex:"9",transition:"opacity 1s linear"}}>
            <div style={{backgroundColor:"white",width:"100%",maxWidth:"600px",height:"80%",paddingLeft:"20px",paddingRight:"20px",paddingTop:"20px",
            transform:hide? "translateY(100%)":"translateY(0%)",transition:"transform 0.4s ease-in-out",
            borderTopLeftRadius:"25px",borderTopRightRadius:"25px"}}>
                <Button type="ghost" icon={<CloseOutlined/>} style={{float:"right"}} shape="round" onClick={()=>{onCancel()}}>Cancelar</Button>
                <Typography.Title level={4} >{props.title}</Typography.Title>
                <div style={{overflow:"auto"}}>
                    {props.children}
                </div>
            </div>
        </div>
    )*/

