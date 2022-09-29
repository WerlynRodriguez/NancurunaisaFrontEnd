import { Button, Typography } from "antd";

export default function miniPicker(props){
    const {title,icon,button,visible} = props;
    return(
        <div style={{display:visible?"":"none",width:"180px",backgroundColor:"#212121",borderRadius:"25px",height:"200px",padding:"10px",textAlign:"center"}}>
            <div style={{width:"100%",height:"40%"}}>
                {icon}
            </div>
            <div style={{width:"100%",height:"40%"}}>
                <Typography.Title level={5} style={{color:"white"}}>
                    {title}
                </Typography.Title>
            </div>
            <div style={{width:"100%",height:"20%"}}>
                <Button style={{width:"100%",borderRadius:"25px"}} onClick={()=>{props.onClick()}}>
                    {button}
                </Button>
            </div>
        </div>
    )
}