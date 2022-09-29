import { Avatar, Space } from "antd";

function get6text(text) {
  if (text.length > 6) {
    return text.substring(0, 6) + "...";
  } else {
    return text;
  }
}

function convertLetterToNumber(letter) {
    return letter.charCodeAt(0) - 65;
}


export default function selectedItem(props){

  const onClick = () => {
    if (typeof props.onClick === 'function') {
        props.onClick(props.index);
    }
  }

  return (<Space style={{marginRight:"5px"}}>
    <div onClick={()=>{onClick()}} style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
        <Avatar size="large" src={props.avatar? props.avatar:null}>
            {props.avatar? null:props.text[0]}
        </Avatar>
        {get6text(props.text)}
    </div>
  </Space>)
}