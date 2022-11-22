import React, {useState,useEffect} from 'react';
import { ActionsProviders,FormActions,getaction} from '../../../Utils/ActionsProviders';
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

import { FormPageHeader, sectionStyle, BlockRead, FormAvName, ValDoubleName, ButtonSubmit, getFirstWord, MapSelectedItems } from '../../../Utils/TextUtils';
import SelectedItem from "../../../Components/Items/SelectedItem";
import ImgCrop from 'antd-img-crop';
import { Item, Terapeuta} from '../../../Models/Models';
import { getById, Update } from '../../../Utils/FetchingInfo';
import Sucursales from '../Sucursal/Sucursales';
import Terapias from '../Terapia/Terapias';

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

  const [terata, setTerata] = useState(new Terapeuta(null));

  //=============================================
  // 0: Picker Sucursal, 1: Picker Terapia
  const [showPicker, setshowPicker] = useState(-1);

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
    }
    idTerapia {
      idTerapia
      nombreTerapia
    }`;

    getById("terapeutas","idTerapeuta",idTA,items).then((response) => {
      if (response == "errors") return;
      
      let infoTerapeuta = new Terapeuta(response.data.terapeutas.items[0]);
      setTerata(infoTerapeuta);
      
      form.setFieldsValue({
        nombres: infoTerapeuta.nombres,
        apellidos: infoTerapeuta.apellidos,
        fechaNacimiento: infoTerapeuta.fechaNacimiento,
        sexo: infoTerapeuta.sexo,
        numCel: infoTerapeuta.numCel,
        email: infoTerapeuta.email,
        horaEntrada: infoTerapeuta.horaEntrada,
        horaSalida: infoTerapeuta.horaSalida,
        idSucursal: infoTerapeuta.idSucursal.nombreSucursal,
        diaLibre: infoTerapeuta.getDiasLibres(),
      });

      setLoading(false);
    });
  }

  const userMenu = [
    {key:"item1", label:"Ver Usuario", 
    onClick:()=>{Navigate("/Personal/Ajustes/Admin/Usuario/"+FormActions.Update+"/"+terata.idUsuario)}},
  ];

  const onFinish = () =>{
    setloading(true);
    if (ActionsProvider.isAdd) {
  
    } else {
      TerataUpdate();
    }
  }

  const TerataUpdate = () => {
    const vars = terata.toString(form.getFieldsValue());
    
    Update("Terapeuta","terapeutaInput",vars,"idTerapeuta").then((response) => {
      if (response == "errors") { setloading(false); return; }

      message.success("Terapeuta actualizada",1,() => {
          Navigate("/Personal/Clinica/Terapeutas");
      });
    });
  }

  //======================================================================
  //This is the menu Administrar Roles in mode picker
  //======================================================================
  if (showPicker != -1) {
    switch (showPicker) {
      case 0:
        return <Sucursales
              picker 
              onBack={()=>{setshowPicker(-1)}}
              onFinish={(item)=>{
                  terata.idSucursal.idSucursal = item.id;
                  form.setFieldsValue({idSucursal:item.info[0]});
                  setshowPicker(-1);
              }}/>
      case 1:
        return <Terapias
              picker
              multi
              dataPicked={terata.idTerapia}
              onBack={()=>{setshowPicker(-1)}}
              onFinish={(item) => {
                terata.idTerapia = item;
                setshowPicker(-1);
              }}/>
      default:
        break;
    }
  }

  return(<div>

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
    Pic={terata.fotoPerfil} 
    Text={terata.nombres+" "+terata.apellidos}/>
    
    <Layout 
    className='ContentLayout' 
    style={{display:Loading ? "None":""}}>

      <div style={{zIndex:"6",display:ActionsProvider.isAdd? "none":"flex"}}>
        <WatsButton number="+50581248928"/>
      </div>

      <Clock 
      visible={!ActionsProvider.isAdd} 
      entrada={terata.horaEntrada} 
      salida={terata.horaSalida}
      sucursal={terata.idSucursal ? terata.idSucursal.nombreSucursal : "No asignado"}/>        
      
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

        <Divider/>
        <Form.Item 
        name="horaEntrada" 
        label="Horario Entrada">
          <Input 
          type="time" 
          style={{width:"40%"}}/>
        </Form.Item>

        <Divider/>
        <Form.Item 
        name="horaSalida" 
        label="Horario Salida">
          <Input 
          type="time" 
          style={{width:"40%"}}/>
        </Form.Item>

        <Divider/>
        <Form.Item 
        name="diaLibre" 
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
        </Form.Item>
        
        <Divider/>
        <Form.Item 
        name="idSucursal" 
        label="Sucursal:"
        rules={[{required:true,message:"¡Seleccione una sucursal!"}]}>
            <Input 
            disabled
            type="text"
            placeholder="Seleccione una sucursal"
            suffix={
                <Button
                type="primary"
                shape="round" 
                onClick={()=>{setshowPicker(0)}}>
                        Seleccionar Sucursal
                </Button>
            }/>
        </Form.Item>
      </div>

      <div style={sectionStyle}>
        <Title level={4}>Especialidades</Title>

        <MapSelectedItems
        data={terata.idTerapia} 
        itemRender={(item,index)=>(

          <SelectedItem
          key={index}
          index={index}
          item={item} 
          onClick={(id,index)=>{}} 
          />)}
        />

        <br/>
        <Button
        type="primary"
        shape="round" 
        onClick={()=>{setshowPicker(1)}}>
                Seleccionar Terapias
        </Button>
      </div>

      <ButtonSubmit 
      ActionProv={ActionsProvider} 
      isLoading={isLoading}/>
        
      </Form>

    </Layout>
    </div>)
}