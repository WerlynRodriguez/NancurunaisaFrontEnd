import { Button, Checkbox, Collapse, DatePicker, Divider, Form, Input, InputNumber, Layout, Menu, message, Select, Space, Typography } from "antd";
import WatsButton from "../../../Components/WatsButton";
import { BlockRead, ButtonSubmit, FormAvName, FormPageHeader, sectionStyle, ValDoubleName } from "../../../Utils/TextUtils";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getaction, ActionsProviders } from "../../../Utils/ActionsProviders";
import { useEffect, useState } from "react";
import moment from 'moment';/*What Day is? */
import { DeleteOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { AFP, AFPStrings, AnamAStrings, APNP, APNPStrings, APP, APPStrings } from "../../../Utils/Anamnesis";
import { ChangeStatus, Create, getById, Update } from "../../../Utils/FetchingInfo";
import { Paciente } from "../../../Models/Models";
import { RangeProvider } from "../../../Utils/RangeProviders";

const {Title} = Typography

export default function PacSDetail(){
    let Navigate = useNavigate();
    const local = useLocation();/* What is my url */
    const ActionsProvider = new ActionsProviders(getaction(local.pathname,4));/*Actions crud*/
    const {idPA} = useParams(); /* Params react Router fron now what is the id to want a action */

    const [Loading,setLoading] = useState(idPA==null? false:true);/*Fetching paciente info */
    const [isLoading,setloading]= useState(false);/*For Add paciente */
    const [form] = Form.useForm();

    const [Pac,setPac] = useState(new Paciente(null));

    useEffect(() => {
        if (ActionsProvider.isAdd) { return; }
        PacGet();
    },[])

    const PacGet = () =>{
        setLoading(true);
        const items = 
        `idPaciente
        nombres
        apellidos
        sexo
        nacionalidad
        profesionOficio
        horasTrabajo
        numCel
        fechaNacimiento
        escolaridad
        estadoCivil
        direccion
        activo`;

        const rangeProviders = new RangeProvider();
        rangeProviders.loadPermisos(() => {
            if (!rangeProviders.verifyPermiso("Ver","Pacientes")) Navigate("/Personal/Clinica");

            getById("paciente","idPaciente",idPA,items).then((response) => {
                if (response == "errors") return;

                let paciente = new Paciente(response.data.paciente.items[0]);
                setPac(paciente);

                form.setFieldsValue({
                    nombres: paciente.nombres,
                    apellidos: paciente.apellidos,
                    sexo: paciente.sexo,
                    nacionalidad: paciente.nacionalidad,
                    profesionOficio: paciente.profesionOficio,
                    horasTrabajo: paciente.horasTrabajo,
                    numCel: paciente.numCel,
                    fechaNacimiento: paciente.fechaNacimiento,
                    escolaridad: paciente.escolaridad,
                    estadoCivil: paciente.estadoCivil,
                    direccion: paciente.direccion,
                    activo: paciente.activo,
                });
                setLoading(false);
                setloading(false);
            });
        });
    }

    const onFinish=()=>{
        setloading(true);
        if (ActionsProvider.isAdd) {
            PacAdd();
        }else{
            PacUpdate();
        }
    }

    const PacAdd = () => {
        const vars = Pac.toString(form.getFieldsValue());
        Create("Paciente","pacienteInput",vars,"idPaciente").then((response) => {
            if (response == "errors") { setloading(false); return; }

            message.success("Paciente agregado",1,() => {
                Navigate("/Personal/Clinica/Pacientes");
            });
        });
    }

    const PacUpdate = () => {
        const vars = Pac.toString(form.getFieldsValue());

        Update("Paciente","pacienteInput",vars,"idPaciente").then((response) => {
            if (response == "errors") { setloading(false); return; }

            message.success("Paciente actualizado",1,() => {
                PacGet();
            });
        });
    }

    const userMenu = [
        {key:"item1",label:(Pac.activo?"Deshabilitar":"Habilitar"),
        onClick:() => { ChangeST(); }},
    ];

    const ChangeST = () => {
        setloading(true);
        ChangeStatus("Paciente","idPacientes",idPA,"activo",Pac.activo,"idPaciente").then((response) => {
            if (response == "errors") { setloading(false); return; }

            message.success("Paciente actualizado",1,() => {
                PacGet();
            });
        });
    }

    return(<div>

        <FormPageHeader 
        ActionProv={ActionsProvider} 
        Text="Paciente" 
        menu={userMenu}/>

        <div 
        className='BackImageCollapsible' 
        style={{display:ActionsProvider.isAdd? "none":""}}/>

        <FormAvName 
        ActionProv={ActionsProvider} 
        Loading={Loading} 
        Avatar={""} 
        Activo={Pac.activo}
        Text={Pac.nombres+" "+Pac.apellidos}/>

        <Layout 
        className='ContentLayout' 
        style={{display:Loading ? "None":""}}>
            <div style={{zIndex:"6",display:ActionsProvider.isAdd? "none":"flex"}}>
            <WatsButton number={"+"+Pac.numCel}/>
            </div>

            <Form 
            onFinish={()=>{onFinish()}} 
            onFinishFailed={(e)=>{form.scrollToField(e.errorFields[0].name)}} 
            form={form}
            disabled={ActionsProvider.isRead}
            size='Default' 
            style={{marginTop:"25px",maxWidth:"600px",width:"100%"}}>

                <div style={sectionStyle}>
                    <Title level={4}>Información Personal</Title>

                    <Form.Item 
                    name="nombres" 
                    label="Nombres:" 
                    rules={[{validator: (_, value) => ValDoubleName(value,"nombre")}]}>
                        <Input 
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
                        type="text"
                        maxLength={30}
                        placeholder='Apellidos'/>
                    </Form.Item>

                    <Divider/>
                    <Form.Item 
                    label="Nacionalidad:" 
                    name="nacionalidad"
                    rules={[
                        {required:true,message:"¡Introduzca la Nacionalidad!"},
                        {min:5,message:"¡Introduzca una Nacionalidad válida!"},
                    ]}>
                        <Input 
                        type="text"
                        maxLength={30}
                        placeholder='Nacionalidad'/>
                    </Form.Item>

                    <Divider/>
                    <Form.Item 
                    label="Fecha de nacimiento:" 
                    name="fechaNacimiento"
                    rules={[{required:true,message:"¡Introduzca la fecha de Nacimiento!"}]}>
                        <DatePicker
                        inputReadOnly={true}
                        picker="date"/>
                    </Form.Item>

                    <Divider/>
                    <Form.Item 
                    label="Género:" 
                    name="sexo"
                    rules={[{required:true,message:"¡Seleccione el género!"}]}>
                        <Select>
                            <Select.Option value="M">Masculino</Select.Option>
                            <Select.Option value="F">Femenino</Select.Option>
                        </Select>
                    </Form.Item>
                </div>

                <div style={sectionStyle}>
                    <Title level={4}>Información de Contacto</Title>

                    <Form.Item 
                    name="numCel"
                    label="Numero Telefónico:" 
                    rules={[{required: true, message: 'Introduzca el número Celular!'}]}>
                        <PhoneInput/>
                    </Form.Item>

                    <Divider/>
                    <Form.Item
                    name="direccion"
                    label="Dirección:"
                    rules={[
                        {required: true, message: 'Introduzca la dirección!'},
                        {min:10,message:"¡Introduzca una dirección con más de 10 caracteres!"}
                    ]}>
                        <Input.TextArea
                        showCount
                        maxLength={150}
                        autoSize={{
                            minRows: 2,
                            maxRows: 6,
                        }}
                        placeholder='Dirección'/>
                    </Form.Item>
                </div>

                <div style={sectionStyle}>
                    <Title level={4}>Anamnesis A</Title>

                    <Form.Item
                    name="profesionOficio"
                    label="Profesión u Oficio:"
                    rules={[
                        {required: true, message: 'Introduzca la profesión u oficio!'},
                        {min:5,message:"¡Introduzca una profesión u oficio válida!"}
                    ]}>
                        <Input
                        type="text"
                        maxLength={30}
                        placeholder='Profesión u Oficio'/>
                    </Form.Item>

                    <Divider/>
                    <Form.Item
                    name="horasTrabajo"
                    label="Horas de trabajo:"
                    rules={[{required: true, message: 'Introduzca las horas de trabajo!'}]}>
                        <InputNumber
                        min={0}
                        max={24}
                        placeholder='Horas de trabajo'/>
                    </Form.Item>

                    <Divider/>
                    <Form.Item
                    name="escolaridad"
                    label="Escolaridad:"
                    rules={[
                        {required: true, message: 'Introduzca la escolaridad!'},
                        {min:5,message:"¡Introduzca una escolaridad válida!"}
                    ]}>
                        <Input
                        type="text"
                        maxLength={30}
                        placeholder='Escolaridad'/>
                    </Form.Item>

                    <Divider/>
                    <Form.Item
                    name="estadoCivil"
                    label="Estado Civil:"
                    rules={[
                        {required: true, message: 'Introduzca el estado civil!'},
                        {min:5,message:"¡Introduzca un estado civil válido!"}
                    ]}>
                        <Input
                        type="text"
                        maxLength={30}
                        placeholder='Estado Civil'/>
                    </Form.Item>
                </div>

                <ButtonSubmit ActionProv={ActionsProvider} isLoading={isLoading}/>

            </Form>
        </Layout>
    </div>)
}