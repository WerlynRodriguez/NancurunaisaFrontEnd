import { Avatar, Space } from "antd";

function get6text(text) {
  if (text.length > 6) {
    return text.substring(0, 6) + "...";
  } else {
    return text;
  }
}

export default function selectedItem(props){
  const {index,item,onClick} = props;

  return (
  <Space 
  style={{marginRight:"5px"}}>

    <div 
    onClick={()=>{onClick(item.id,index)}} 
    style={{display:"flex",flexDirection:"column",alignItems:"center"}}>

        <Avatar 
        size="large" 
        src={item.pic? item.pic:null}>
            {item.pic? null:item.info[0][0]}
        </Avatar>

        {get6text(item.info[0])}
    </div>
  </Space>)
}