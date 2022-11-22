import { ArrowLeftOutlined, ControlOutlined, EditOutlined, MoreOutlined, PlusOutlined } from "@ant-design/icons";
import { Avatar, Badge, Button, Dropdown, Form, Image, Layout, Menu, PageHeader, Skeleton, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import "./TextUtils.css";
const {Title} = Typography;

export const sectionStyle={
  border:"2px solid rgb(89,32,133)",
  marginTop:"15px",
  boxShadow:"2px 2px 12px #c5c5c5",
  backgroundColor:"white",
  borderRadius:"20px",
  padding:"5px"}/*Purple Border of Form */

export const DropdownFilterMenu = (props) => (
  <Dropdown 
  key="more" 
  overlay={props.menu} 
  placement="bottomRight" 
  trigger={['click']}>

    <Button 
    style={{backgroundColor:"rgba(0,0,0,0.5)"}} 
    shape="circle" 
    type='ghost' 
    size='large'>

      <ControlOutlined 
      style={{fontSize: 20,color:"white"}}/>

    </Button>
  </Dropdown>)

export const DropdownMenu = (props) => props.active ? (
    <Dropdown 
    key="more" 
    overlay={props.menu} 
    placement="bottomRight"
    trigger={['click']}>

      <Button 
      style={{backgroundColor:"rgba(0,0,0,0.5)"}} 
      shape="circle" 
      type='ghost' 
      size='large'>

        <MoreOutlined 
        style={{fontSize: 20,color:"white"}} />
        
      </Button>
    </Dropdown>) : null;

export const getFirstWord=(text)=>{const aux = text.split(" "); return aux[0];}

export const ValDoubleName=(value,text)=>{
  if (!value) 
  return Promise.reject(new Error("¡Introduzca un "+text+"!"));

  const aux = value.includes(" ") ? value.split(" ") : null;
  const pos = ["primer","segundo","tercer"];

  if (aux == null){
    if (value.length < 3) 
      return Promise.reject(new Error("¡El primer "+text+" es muy corto!"));
    else if (value.length > 15) 
      return Promise.reject(new Error("¡El primer "+text+" es muy largo!"));
    else 
      return Promise.resolve();

  } else if (aux.length > 3) 
    return Promise.reject(new Error("¡Demasiados "+text+"s!"));

  else {
    for (let i = 0; i < aux.length; i++) {
      if (aux[i].length < 3) 
        return Promise.reject(new Error("¡El "+pos[i]+" "+text+" es muy corto!"));
      else if (aux[i].length > 15) 
        return Promise.reject(new Error("¡El "+pos[i]+" "+text+" es muy largo!"));
    }
    return Promise.resolve();
  }
}

/*********** */
/* This Elements are from commnly forms, used in my UI, so i decided put here for recycle */
export function FormPageHeader(props){
  const {onBack,normal,Activo} = props;
    const ActionsProvider = props.ActionProv;
    let Navigate = useNavigate();

    const userMenu = ( 
      <Menu
      style={{width:"200px",borderRadius:"15px"}}
      items={!props.menu? [] : props.menu.map((item) => {
        return {key: item.key, label: item.label, onClick: () => {item.onClick()}}
      })}
      />
    );

    return (
    <PageHeader 
    onBack={()=>{onBack ? onBack() : Navigate(-1)}} 
    style={{zIndex:normal==true?"":"6"}} 
    backIcon={ !ActionsProvider.isAdd?
        
        <Button 
        style={{backgroundColor:"rgba(0,0,0,0.5)"}} 
        shape="circle" 
        type='ghost' 
        size='large'>

            <ArrowLeftOutlined 
            style={{fontSize: 15,color:"white"}}/>

        </Button>
        :
        <ArrowLeftOutlined 
        style={{fontSize: 15}}/>}

    title={
        <Title 
        style={{color:ActionsProvider.isAdd?"":"white"}} 
        level={3}>
            {ActionsProvider.isAdd? "Añadir "+props.Text:props.Text}
        </Title>
    }
    extra={[
      <DropdownMenu
      active={ActionsProvider.isUpdt} 
      key={1} 
      menu={userMenu} />
    ]}/>
    )
}

export function BlockRead(props){
    return(
    <div 
    style={{position:"fixed",top:"0",left:"0",bottom:"0",width:"100%",
    height:"100%",display:props.Show?"flex":"none",zIndex:"5"}}>

    </div>
  )
}

/*Display a beatiful avatar with a name */
export function FormAvName(props){
    const ActionsProvider = props.ActionProv;
    const {Loading, Pic, Text, SubTitle, Activo} = props;

    return(
        <Layout 
        className='CollapsibleHeaderOff' 
        style={{display:ActionsProvider.isAdd? "none":"flex"}}>
          
        <div style={{position:"absolute",top:"150px",zIndex:"6"}}>

          <Skeleton.Avatar 
          active={Loading} 
          style={{display:Loading ? "":"None",width:"120px",height:"120px"}}/>
          
          <Badge
          size="large"
          color={Activo?"green":"red"}
          count={Activo?"Activo":"Inactivo"}
          offset={[-60,120]}
          style={{display:Loading?"none":"flex"}}>
            <Avatar
            size="large"
            style={{width:"120px",height:"120px",fontSize:"50px",display:Loading?"none":"flex",
            alignItems:"center",border:"3px solid white",boxShadow:"0px 0px 15px #000000"}}
            src={Pic}>
              {Pic? null:Text? Text[0]:null}
            </Avatar>
          </Badge>

        </div>

        <div 
        style={{marginTop:"70px",textAlign:"center"}}>

          <Skeleton.Input 
          active={Loading} 
          size="large" 
          style={{display:Loading ? "":"None"}}/>

          <Title 
          level={2} 
          style={{display:Loading ? "None":""}}>
            {Text}
          </Title>

          <Title 
          level={5} 
          style={{display:Loading ? "None":""}}>
            {SubTitle}
          </Title>
        </div>
      </Layout>
    )
}

//Button of forms submitt
export function ButtonSubmit(props){
  const ActionsProvider = props.ActionProv;
  if (ActionsProvider.isRead) return null;
  return(
      <Form.Item>
        <Button 
        icon={ActionsProvider.isUpdt?
          <EditOutlined/>
          :
          <PlusOutlined/>} 
        type='primary' style={{width:"100%",marginTop:"20px"}} 
        size='large' 
        loading={props.isLoading} 
        shape='round' 
        htmlType='submit'>
          {ActionsProvider.isUpdt? "Actualizar":"Añadir"}
        </Button>
    </Form.Item>
  )
}

//Map list of selected items
export function MapSelectedItems(props){
  const {data, itemRender} = props;
  if (!data) return null;

  return(
    <div 
    style={{display:"inline",overflowX:"scroll",overflowY:"hidden",whiteSpace:"nowrap",padding:"5px"}}>

        {data.map((item,index)=>
          (itemRender(item,index))
        )}
    </div>
  )
}