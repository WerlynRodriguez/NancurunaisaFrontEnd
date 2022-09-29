import React, {useState,useEffect} from 'react';
import {GetByIdTeraTa, CreateTeraTa, DeleteLogicTeraTa, UpdateTeraTa} from '../../../Utils/FetchingInfo';
import { TerataFormActionProvider,getaction} from '../../../Utils/ActionsProviders';
import {Typography, Skeleton,Layout,Select,Form,Image, Button, Dropdown, Avatar} from 'antd';
import {Input,DatePicker,Divider, Upload,message,Menu} from 'antd';
import "../../../Utils/TextUtils.css";

import moment from 'moment';/*What Day is? */
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import PickerSucursal from '../../../Components/Picker/Pickers';
import WatsButton from '../../../Components/WatsButton';
import Clock from '../../../Components/Clock';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

import { FormPageHeader, sectionStyle, BlockRead, FormAvName, ValDoubleName, ButtonSubmit, getFirstWord } from '../../../Utils/TextUtils';
import ImgCrop from 'antd-img-crop';

const { Title } = Typography;
const { Option } = Select;

/*Formulario de lectura, Edicion, Adicion */
export default function TerapeutaDetail(){
  let Navigate = useNavigate();
  const local = useLocation();/* What is my url */
  const ActionsProvider = new TerataFormActionProvider(getaction(local.pathname));/*Actions crud*/
  const {idTA} = useParams(); /* Params react Router fron now what is the id to want a action */

  const [Loading,setLoading] = useState(idTA==null? false:true);/*Fetching terapeuta info */
  const [isLoading,setloading]= useState(false);/*For Add teratas */
  var isInModal = false;
  const [form] = Form.useForm();

  const [Terapeuta,setTerapeuta] = useState([]);/* All terapeuta info after fetching */
  const [EntradaHora,setEntradaHora] = useState("09:00");
  const [SalidaHora,setSalidaHora]= useState("18:00");
  const [fotoPerfil,setFotoPerfil] = useState({imageFile:null,imageSrc:null});
  const [ActSucur,setActSucur] = useState("Rafaela Herrera");

  const url = "http://172.23.173.158:5037/Images/";

  const OptionDayFree = [
    <Option key={1} value={1}>Lunes</Option>,
    <Option key={2} value={2}>Martes</Option>,
    <Option key={3} value={3}>Miercoles</Option>,
    <Option key={4} value={4}>Jueves</Option>,
    <Option key={5} value={5}>Viernes</Option>,
    <Option key={6} value={6}>Sabado</Option>,
    <Option key={7} value={7}>Domingo</Option>
]

const dataTeraTa = () =>{
  return {
    "idMasajista": idTA,
    "idSucursal": 1,
    "nombres": form.getFieldValue("Nombres"),
    "apellidos": form.getFieldValue("Apellidos"),
    "fechaNacimiento": "2022-06-02T05:43:13.627",
    "correo": form.getFieldValue("Mail"),
    "password": "123456",
    "foto": null,
    "roll": "1",
    "numCel": form.getFieldValue("Phone"),
    "activo": true,
    "sexo": "M",
    "horaEntrada": EntradaHora,
    "horaSalida": SalidaHora,
    "fotoPerfil": fotoPerfil.imageSrc,
    "idSucursalNavigation": null,
    "idCita": [],
    "idDia": []
  }
}

  /* * * * * * * * * * * * * * * * * * *  */
  /*This Functions are Only in Action UPDATE */
  /* * * * * * * * * * * * * * * * * * *  */

  if (!ActionsProvider.isAdd) {
    useEffect(() => {TeraTaGet()},[])
  }
      
  const TeraTaGet = () =>{
    GetByIdTeraTa(idTA).then((result)=>{
      setLoading(false);
      setTerapeuta(result);
      setEntradaHora(moment(result.horaEntrada).format("HH:mm"));
      setSalidaHora(moment(result.horaSalida).format("HH:mm"));
      setFotoPerfil(result.fotoPerfil);
      setActSucur(result.idSucursal);
      form.resetFields();
        }
      )
  }

  const DeAcTerata =(DeAc)=>{
    var data = dataTeraTa();
    data.activo = DeAc;
    UpdateTeraTa(idTA,data).then((result)=>{
      console.log(result);
      if (result.ok){
        message.success("Terapeuta Modificado",1).then(()=>{
          setloading(false);
          Navigate(-1);
        })
      }else{message.error("No se pudo Modificar",2);setloading(false);}
    })
  }

  const userMenu = (
      <Menu style={{width:"200px",borderRadius:"20px"}}>
        <Menu.Item key="1">
          <Button type='primary' onClick={()=>{DeAcTerata(Terapeuta.activo)}} danger 
          style={{width:"100%",borderBottomLeftRadius:"20px",borderBottomRightRadius:"20px"}}>
            {Terapeuta.activo == true? "Desactivar":"Activar"}
            </Button>
        </Menu.Item>
      </Menu>
    );

  /* * * * * * * * * * * * * * * * * * *  */
  /*This Functions are Only in Action ADD */
  /* * * * * * * * * * * * * * * * * * *  */
  const onFinish = () =>{
    if(isLoading || isInModal) {return;}
    setloading(true);
    if (ActionsProvider.isAdd) {
      var data = dataTeraTa();
      CreateTeraTa(data).then((result)=>{
        console.log(result);
      /*if (result['status'] === 'ok') {
        message.success("Terapeuta Añadido",1).then(()=>{
          setloading(false);
          Navigate(-1);
        })
      }else{message.error("No se pudo añadir",2);setloading(false);}*/
    })
    }else{
      var data = dataTeraTa();
      UpdateTeraTa(idTA,data).then((result)=>{
        console.log(result);
        if (result.ok){
          message.success("Terapeuta Modificado",1).then(()=>{
            setloading(false);
            Navigate(-1);
          })
        }else{message.error("No se pudo Modificar",2);setloading(false);}
      })
    }
  }

  const showPreview = (e) => {
    if(e.target.files && e.target.files[0]){
      let imageFile = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {setFotoPerfil({imageFile,imageSrc:e.target.result});}
      reader.readAsDataURL(imageFile);
    }
  }

    return(<div>
      <BlockRead Show={ActionsProvider.isRead}/>
      <FormPageHeader ActionProv={ActionsProvider} Text="Terapeuta" menu={userMenu}/>
      <div className='BackImageCollapsible' style={{display:ActionsProvider.isAdd? "none":""}}/>

      <FormAvName ActionProv={ActionsProvider} Loading={Loading} Avatar={Terapeuta.fotoPerfil} Text={Terapeuta.nombres+" "+Terapeuta.apellidos}/>
      
      <Layout className='ContentLayout' style={{display:Loading ? "None":""}}>
        <div style={{zIndex:"6",display:ActionsProvider.isAdd? "none":"flex"}}>
          <WatsButton number="+50581248928"/>
        </div>
        <Clock visible={!ActionsProvider.isAdd} entrada={EntradaHora} salida={SalidaHora} sucursal={ActSucur}/>        
        
        <Form onFinish={()=>{onFinish()}} onFinishFailed={(e)=>{form.scrollToField(e.errorFields[0].name)}} 
        initialValues={{Nombres:Terapeuta.nombres, Apellidos:Terapeuta.apellidos,Phone:Terapeuta.numCel, 
        roll:Terapeuta.roll,HE:EntradaHora,HS:SalidaHora,Mail:Terapeuta.correo, Gender:Terapeuta.sexo,
        Birth:Terapeuta.fechaNacimiento? moment(Terapeuta.fechaNacimiento, "YYYY/MM/DD"): moment("1990/01/01","YYYY/MM/DD"), FreeDay:[6,7]}} 
        form={form} size='Default' style={{marginTop:"25px",maxWidth:"600px",width:"100%"}}>

          <div style={sectionStyle}>
            <Title level={4}>Información Personal</Title>
            <Form.Item name="Nombres" label="Nombres:" rules={[
              {validator: (_, value) => ValDoubleName(value,"nombres")}]}>
              <Input type="text" maxLength={30} placeholder='Nombres'/>
            </Form.Item>
            <Divider/>
            <Form.Item name="Apellidos" label="Apellidos:" rules={[
              {validator: (_, value) => ValDoubleName(value,"apellidos")}]}>
              <Input placeholder='Apellidos'/>
            </Form.Item>
            <Divider/>
            <Form.Item label="Fecha de nacimiento:" name="Birth" rules={[{
              required:true,message:"¡Introduzca la fecha de Nacimiento!"}]}>
              <DatePicker inputReadOnly={true} picker="date"/>
            </Form.Item>
            <Divider/>
            <Form.Item label="Género:" name="Gender" rules={[{required:true,message:"¡Seleccione el género!"}]}>
              <Select>
                <Option value="M">Masculino</Option>
                <Option value="F">Femenino</Option>
                <Option value="O">Otro</Option>
              </Select>
            </Form.Item>
          </div>
          
        <div style={sectionStyle}>
          <Title level={4}>Información de Contacto</Title>
          <Form.Item name="Phone" label="Numero Telefónico:" rules={[{
            required: true, message: 'Introduzca el número Celular!'}]}>
            <PhoneInput country={"ni"}/>
          </Form.Item>
          <Divider/>
          <Form.Item name="Mail" label="Correo Electrónico:"rules={[{
            type: 'email',message: '¡No es un correo Válido!',},{required:true,message:"¡Introduzca el Correo!"}]}>
            <Input type="email"></Input>
          </Form.Item>
        </div>
          
        <div style={sectionStyle}>
          <Title level={4}>Información Laboral</Title>
          <Form.Item name="roll" label="Rol:" rules={[{required:true,message:"¡Seleccione el Rol!"}]}>
            <Select>
              <Option value="1">Popietario</Option>
              <Option value="2">Manager</Option>
              <Option value="3">Terapeuta</Option>
              <Option value="4">Invitado</Option>
            </Select>
          </Form.Item>
          <Form.Item name="HE" label="Horario Entrada">
            <Input type="time" style={{width:"40%"}}/>
          </Form.Item>
          <Form.Item name="HS" label="Horario Salida">
            <Input type="time" style={{width:"40%"}}/>
          </Form.Item>

          <Divider/>
          <Form.Item label="Sucursal:">
            {ActSucur}
            <PickerSucursal onFocus={(sta)=>{isInModal=sta}} onChange={(id,name)=>{setActSucur(name)}}/>
          </Form.Item>
          
          <Divider/>
          <Form.Item label="Dia Libre:" name="FreeDay" rules={[{required:true,message:"¡Seleccione un dia!"}]}>
            <Select mode="multiple" allowClear showSearch={false} style={{ width: '100%' }} placeholder="Dias libre">
              {OptionDayFree}
            </Select>
          </Form.Item>
          </div>

          <div style={sectionStyle}>
            <Title level={4}>Perfil</Title>
            <Avatar src={fotoPerfil? url+fotoPerfil.imageSrc:null} style={{width:"100px",height:"100px"}}/>
            <input type="file" accept='image/*' onChange={(e)=>{showPreview(e)}}/>
          </div>

          <ButtonSubmit ActionProv={ActionsProvider} isLoading={isLoading}/>
          
        </Form>
      </Layout>
      </div>)
}

//<ImgCrop>