import React, {useState,useEffect} from 'react';
import { ActionsProviders,getaction} from '../../../Utils/ActionsProviders';
import {Typography, Skeleton, Layout, Select, Form, Image, Button, Dropdown, Avatar} from 'antd';
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
import { Terapeuta } from '../../../Models/Models';
import { getById } from '../../../Utils/FetchingInfo';

const { Title } = Typography;
const { Option } = Select;

/*Formulario de lectura, Edicion, Adicion */
export default function TerapeutaDetail(){
  let Navigate = useNavigate();
  const local = useLocation();/* What is my url */
  const ActionsProvider = new ActionsProviders(getaction(local.pathname,4));/*Actions crud*/
  const {idTA} = useParams(); /* Params react Router fron now what is the id to want a action */

  const [Loading,setLoading] = useState(idTA==null? false:true);/*Fetching terapeuta info */
  const [isLoading,setloading]= useState(false);/*For Add teratas */
  var isInModal = false;
  const [form] = Form.useForm();

  var infoTerapeuta = new Terapeuta(null);

  const [EntradaHora,setEntradaHora] = useState("09:00");
  const [SalidaHora,setSalidaHora]= useState("18:00");
  const [fotoPerfil,setFotoPerfil] = useState({imageFile:null,imageSrc:null});
  const [ActSucur,setActSucur] = useState("Rafaela Herrera");

  const OptionDayFree = [
    <Option key={1} value={1}>Lunes</Option>,
    <Option key={2} value={2}>Martes</Option>,
    <Option key={3} value={3}>Miercoles</Option>,
    <Option key={4} value={4}>Jueves</Option>,
    <Option key={5} value={5}>Viernes</Option>,
    <Option key={6} value={6}>Sabado</Option>,
    <Option key={7} value={7}>Domingo</Option>
  ]

  //================================================================
  // If i want to edit or read a terapeuta i need to fetch the info
  //================================================================
  useEffect(() => {
    if (ActionsProvider.isAdd) return;
    FetchData();
  },[])
      
  const FetchData = () =>{
    setLoading(true);

    const items = 
    `idTerapeuta
    horaEntrada
    horaSalida
    idSucursalNavigation{
      idSucursal
      nombreSucursal
    }
    idUsuarioNavigation{
      idUsuario
      nombres
      apellidos
      fechaNacimiento
      sexo
      numCel
      email
      foto
      activo
      idRol{
        idRol
        nombreRol
      }
    }
    diaLibre{
      idDia
    }`;

    getById("terapeutas","idTerapeuta",idTA,items).then((response) => {
      if (response == "errors") return;

      infoTerapeuta = new Terapeuta(response.items[0]);
      
      form.setFieldsValue({
        nombres: infoTerapeuta.nombres,
        apellidos: infoTerapeuta.apellidos,
        fechaNacimiento: moment(infoTerapeuta.fechaNacimiento),
        sexo: infoTerapeuta.sexo,
        numCel: infoTerapeuta.numCel,
        email: infoTerapeuta.email,
        horaEntrada: moment(infoTerapeuta.horaEntrada).format("HH:mm"),
        horaSalida: moment(infoTerapeuta.horaSalida).format("HH:mm"),
      });

      setLoading(false);
    });
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

  return(<div>
    <BlockRead 
    Show={false}/>

    <FormPageHeader 
    ActionProv={ActionsProvider} 
    Text="Terapeuta" 
    menu={userMenu}/>

    <div 
    className='BackImageCollapsible' 
    style={{display:ActionsProvider.isAdd? "none":""}}/>

    <FormAvName 
    ActionProv={ActionsProvider} 
    Loading={Loading} 
    Pic={Terapeuta.fotoPerfil} 
    Text={Terapeuta.nombres+" "+Terapeuta.apellidos}/>
    
    <Layout 
    className='ContentLayout' 
    style={{display:Loading ? "None":""}}>

      <div style={{zIndex:"6",display:ActionsProvider.isAdd? "none":"flex"}}>
        <WatsButton number="+50581248928"/>
      </div>

      <Clock 
      visible={!ActionsProvider.isAdd} 
      entrada={EntradaHora} 
      salida={SalidaHora} 
      sucursal={ActSucur}/>        
      
      <Form 
      onFinish={()=>{onFinish()}} 
      onFinishFailed={(e)=>{form.scrollToField(e.errorFields[0].name)}} 
      form={form}
      size='Default' 
      style={{marginTop:"25px",maxWidth:"600px",width:"100%"}}>

        <div style={sectionStyle}>

          <Title level={4}>Información Personal</Title>

          <Form.Item 
          name="nombres" 
          label="Nombres:">
            <Input 
            disabled
            type="text"
            maxLength={30} 
            placeholder='Nombres'/>
          </Form.Item>

          <Divider/>

          <Form.Item 
          name="apellidos" 
          label="Apellidos:" 
          rules={[{validator: (_, value) => ValDoubleName(value,"apellidos")}]}>
            <Input
            disabled
            type='text' 
            maxLength={30}
            placeholder='Apellidos'/>
          </Form.Item>

          <Divider/>

          <Form.Item 
          name="fechaNacimiento"
          label="Fecha de nacimiento:"  
          rules={[{required:true,message:"¡Introduzca la fecha de Nacimiento!"}]}>
            <DatePicker 
            disabled
            inputReadOnly={true}
            picker="date"/>
          </Form.Item>

          <Divider/>

          <Form.Item 
          name="sexo" 
          label="Género:"
          rules={[{required:true,message:"¡Seleccione el género!"}]}>
            <Select disabled>
              <Option value="M">Masculino</Option>
              <Option value="F">Femenino</Option>
              <Option value="O">Otro</Option>
            </Select>
          </Form.Item>
        </div>
        
      <div style={sectionStyle}>

        <Title level={4}>Información de Contacto</Title>

        <Form.Item 
        name="numCel" 
        label="Numero Telefónico:" 
        rules={[{required: true, message: 'Introduzca el número Celular!'}]}>
          <PhoneInput
          disabled
          country={"ni"}/>
        </Form.Item>

        <Divider/>

        <Form.Item 
        name="email" 
        label="Correo Electrónico:"
        rules={[{type: 'email',message: '¡No es un correo Válido!',},
                {required:true,message:"¡Introduzca el Correo!"}]}>
          <Input
          disabled
          type="email"/>
        </Form.Item>
      </div>
        
      <div style={sectionStyle}>

        <Title level={4}>Información Laboral</Title>

        <Form.Item 
        name="idRol" 
        label="Rol:" 
        rules={[{required:true,message:"¡Seleccione el Rol!"}]}>
          <Select disabled>
            <Option value="1">Popietario</Option>
            <Option value="2">Manager</Option>
            <Option value="3">Terapeuta</Option>
            <Option value="4">Invitado</Option>
          </Select>
        </Form.Item>

        <Divider/>

        <Form.Item 
        name="horaEntrada" 
        label="Horario Entrada">
          <Input 
          type="time" 
          style={{width:"40%"}}/>
        </Form.Item>

        <Form.Item 
        name="horaSalida" 
        label="Horario Salida">
          <Input 
          type="time" 
          style={{width:"40%"}}/>
        </Form.Item>

        <Divider/>

        {/* <Form.Item 
        label="Sucursal:">
          {ActSucur}
          <PickerSucursal 
          onFocus={(sta)=>{isInModal=sta}} 
          onChange={(id,name)=>{setActSucur(name)}}/>
        </Form.Item> */}
        
        <Divider/>

        {/* <Form.Item 
        name="FreeDay" 
        label="Dia Libre:"
        rules={[{required:true,message:"¡Seleccione un dia!"}]}>
          <Select 
          mode="multiple" 
          allowClear 
          showSearch={false} 
          style={{ width: '100%' }} 
          placeholder="Dias libre">
            {OptionDayFree}
          </Select>
        </Form.Item> */}
        
        </div>

        <ButtonSubmit 
        ActionProv={ActionsProvider} 
        isLoading={isLoading}/>
        
      </Form>
    </Layout>
    </div>)
}