import { ArrowLeftOutlined, ControlOutlined, EditOutlined, MoreOutlined, PlusOutlined } from "@ant-design/icons";
import { Avatar, Button, Dropdown, Form, Image, Layout, PageHeader, Skeleton, Typography } from "antd";
import { useNavigate } from "react-router-dom";
const {Title} = Typography;

export const sectionStyle={border:"2px solid rgb(89,32,133)",marginTop:"15px",boxShadow:"2px 2px 12px #c5c5c5",backgroundColor:"white",
borderRadius:"20px",padding:"5px"}/*Purple Border of Form */

export const DropdownFilterMenu = (props) => (
  <Dropdown key="more" overlay={props.menu} placement="bottomRight" trigger={['click']}>
    <Button style={{backgroundColor:"rgba(0,0,0,0.5)"}} shape="circle" type='ghost' size='large'><ControlOutlined style={{fontSize: 20,color:"white"}} /></Button>
  </Dropdown>)

export const DropdownMenu = (props) => (
    <Dropdown key="more" overlay={props.menu} placement="bottomRight" trigger={['click']}>
      <Button style={{backgroundColor:"rgba(0,0,0,0.5)"}} shape="circle" type='ghost' size='large'><MoreOutlined style={{fontSize: 20,color:"white"}} /></Button>
    </Dropdown>)

export const getFirstWord=(text)=>{const aux = text.split(" "); return aux[0];}

export const ValDoubleName=(value,text)=>{
  if (!value) return Promise.reject(new Error("¡Introduzca los "+text+"!"));
  const aux = value.includes(" ")? value.split(" "):null;
  if (aux==null) return Promise.reject(new Error("¡Introduzca almenos dos "+text+"!"));
  if (aux[1]=="") return Promise.reject(new Error("¡Introduzca almenos dos "+text+"!"));
  if (aux.length>3) return Promise.reject(new Error("¡No mas de 3 "+text+"!"));
  return Promise.resolve();
}

/*********** */
/* This Elements are from commnly forms, used in my UI, so i decided put here for recycle */
export function FormPageHeader(props){
  const {onBack,normal} = props;
    const ActionsProvider = props.ActionProv;
    let Navigate = useNavigate();

    return (<PageHeader onBack={()=>{onBack?onBack():Navigate(-1)}} style={{zIndex:normal==true?"":"6"}} backIcon={ !ActionsProvider.isAdd?
        <Button style={{backgroundColor:"rgba(0,0,0,0.5)"}} shape="circle" type='ghost' size='large'>
            <ArrowLeftOutlined style={{fontSize: 15,color:"white"}}/>
        </Button>:<ArrowLeftOutlined style={{fontSize: 15}}/>}
        title={<Title style={{color:ActionsProvider.isAdd?"":"white"}} level={3}>{ActionsProvider.isAdd? "Añadir "+props.Text:props.Text}</Title>} 
        extra={[ActionsProvider.isUpdt? <DropdownMenu key={1} menu={props.menu} />:null]}/>)
}

export function BlockRead(props){
    return(<div style={{position:"fixed",top:"0",left:"0",bottom:"0",width:"100%",height:"100%",display:props.Show?"flex":"none",zIndex:"5"}}></div>)
}

/*Display a beatiful avatar with a name */
export function FormAvName(props){
    const ActionsProvider = props.ActionProv;
    const Loading = props.Loading;
    const avatar = props.Avatar;

    return(
        <Layout className='CollapsibleHeaderOff' style={{display:ActionsProvider.isAdd? "none":"flex"}}>
        <div style={{position:"absolute",top:"150px",zIndex:"6"}}>
          <Skeleton.Avatar active={Loading} style={{display:Loading ? "":"None",width:"120px",height:"120px"}}/>
          <Avatar style={{width:"120px",height:"120px",display:Loading || avatar? "None":""}}/>
          <Image src={avatar} style={{display:Loading || !avatar? "None":"" ,width:"120px",height:"120px",borderRadius:"50%",border:"5px solid white"}}/>
        </div>
        <div style={{marginTop:"70px"}}>
          <Skeleton.Input active={Loading} size="large" style={{display:Loading ? "":"None"}}/>
          <Title level={2} style={{display:Loading ? "None":""}}>{props.Text}</Title>
        </div>
      </Layout>
    )
}

//Button of forms submitt
export function ButtonSubmit(props){
  const ActionsProvider = props.ActionProv;
  return(
    <Form.Item>
      <Button icon={ActionsProvider.isUpdt?<EditOutlined/>:<PlusOutlined/>} type='primary' style={{width:"100%",marginTop:"20px"}} size='large' loading={props.isLoading} shape='round' htmlType='submit'>
      {ActionsProvider.isUpdt? "Actualizar":"Añadir"}</Button>
    </Form.Item>
  )
}

//Map list of selected items
export function MapSelectedItems(props){
  return(
    <div style={{display:props.data.length==0?"none":"flex",flexDirection:"column"}}>
        <Typography.Text>Seleccionados: {props.data.length}</Typography.Text>
        <div style={{display:"inline"}}>
            {props.data.map((item,index)=>(props.item(item,index)))}
        </div>
    </div>
  )
}