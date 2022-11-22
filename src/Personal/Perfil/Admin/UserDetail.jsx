import { DeleteOutlined } from "@ant-design/icons";
import { Button, DatePicker, Divider, Form, Input, Layout, Menu, message, Select, Typography } from "antd";
import { lazy, useEffect, useState } from "react";
import PhoneInput from "react-phone-input-2";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Item, User } from "../../../Models/Models";
import moment from 'moment';
import "../../../Utils/TextUtils.css";
import { ActionsProviders, getaction } from "../../../Utils/ActionsProviders";
import { ChangeStatus, Create, getById, Update } from "../../../Utils/FetchingInfo";
import { BlockRead, ButtonSubmit, FormAvName, FormPageHeader, sectionStyle, ValDoubleName } from "../../../Utils/TextUtils";
const AdRols = lazy(() => import("./AdRols"));

const {Title} = Typography;

export default function UserDetail() {
    let Navigate = useNavigate();
    //What is my Url
    const local = useLocation();
    //I want to know what is the action that I have to do
    const ActionsProvider = new ActionsProviders(getaction(local.pathname,5));

    const {idUS} = useParams(); /* Params react Router fron now what is the id to want a action */

    //When the action is read or update, the form is loading the data
    const [Loading,setLoading] = useState(idUS==null? false:true);
    //When the action is add, load for update and wait response from server
    const [isLoading,setloading]= useState(false);
    const [form] = Form.useForm();

    const [user, setUser] = useState(new User(null));

    const [showPicker, setshowPicker] = useState(false);

    useEffect(() => {
        if(ActionsProvider.isAdd) return; 
        FetchData();
    }, []);

    //======================================================================
    //When the action is read or update, Fetch the data from server
    //======================================================================
    const FetchData = () => {
        setLoading(true);
        const items = 
        `idUsuario
        email
        nombres
        apellidos
        fechaNacimiento
        foto
        numCel
        sexo
        activo
        idRol{
            idRol
            nombreRol
        }
        terapeuta{
            idTerapeuta
        }`;

        getById("usuarios","idUsuario",idUS,items).then((response) => {
            if (response == "errors") return;
            if (response.data.usuarios.items.length == 0) { 
                message.error("No se encontró el usuario",2,()=>{
                    //Navigate to the previous page replace
                    Navigate("/Personal/Clinica/",{replace:true});
                });
                return;
            }

            let usuario = new User(response.data.usuarios.items[0]);
            setUser(usuario);
            form.setFieldsValue({
                nombres: usuario.nombres,
                apellidos: usuario.apellidos,
                sexo: usuario.sexo,
                fechaNacimiento: usuario.fechaNacimiento,
                numCel: usuario.numCel,
                email: usuario.email,
                idRol: usuario.idRol ? usuario.idRol.nombreRol : "null",
            });
            setLoading(false);
        })
    }

    const onFinish = () => {
        setloading(true);
        if(ActionsProvider.isAdd){
            AddUser();
        } else if(ActionsProvider.isUpdt){
            UpdateUser();
        }
    }

    const AddUser = () => {
        const vars = `
            email: "${form.getFieldValue("email")}"
            password: "${form.getFieldValue("password")}"
            nombres: "${form.getFieldValue("nombres")}"
            apellidos: "${form.getFieldValue("apellidos")}"
            numCel: "${form.getFieldValue("numCel")}"
            sexo: "${form.getFieldValue("sexo")}"
            fechaNacimiento: "${moment(form.getFieldValue("fechaNacimiento")).format("YYYY-MM-DD")}"
            foto: null
            activo: true
            roles: [${user.idRol.idRol}]`;
        const items = "idUsuario idRol{nombreRol} terapeuta{idTerapeuta}";

        Create("Usuario","usuario",vars,items).then((response) => {
            if (response == "errors") { setloading(false); return; }

            message.success("Usuario creado correctamente",2,
            () => { Navigate("/Personal/Ajustes/Admin/Usuarios"); });
            
        })
    }

    const UpdateUser = () => {
        const vars = `
            idUsuario: ${idUS}
            email: "${form.getFieldValue("email")}"
            nombres: "${form.getFieldValue("nombres")}"
            apellidos: "${form.getFieldValue("apellidos")}"
            fechaNacimiento: "${moment(form.getFieldValue("fechaNacimiento")).format("YYYY-MM-DD")}"
            numCel: "${form.getFieldValue("numCel")}"
            sexo: "${form.getFieldValue("sexo")}"
            activo: ${user.activo}
            roles: [${user.idRol.idRol}]`;
        const items = "idUsuario idRol{idRol} terapeuta{idTerapeuta}";

        Update("Usuario","usuarioInput",vars,items).then((response) => {
            if (response == "errors") { setloading(false); return; }

            let data = response.data.actualizarUsuario;
            


            message.success("Usuario actualizado correctamente",2,
            () => { 
                FetchData(); 
                setloading(false);
            });

        })
    }

    const ChangeStatusUser = () => {
        setLoading(true);
        ChangeStatus("Usuario","idUsuarios",idUS,"activo",user.activo,"idUsuario").then((response) => {
            if (response == "errors") { setLoading(false); return; }

            message.success("Usuario "+(user.activo?"deshabilitado":"habilitado") +" correctamente",2,()=>{
                FetchData();
            });
        })
    }

    //======================================================================
    //This is the menu will be displayed in the header when the action is Read or Update
    //======================================================================
    const userMenu = [];
    if (user.terapeuta) 
        userMenu.push({
            key:"item2",
            label:"Ver terapeuta",
            onClick:() => {console.log("Ver terapeuta")}
        });

    userMenu.push({
        key:"item1",
        label:(user.activo?"Deshabilitar":"Habilitar")+" usuario",
        onClick:()=>{ChangeStatusUser()}
    });

    //======================================================================
    //This is the menu Administrar Roles in mode picker
    //======================================================================
    if (showPicker)
        return (
            <AdRols 
            picker 
            onBack={()=>{setshowPicker(false)}}
            onFinish={(item)=>{
                setUser({...user,idRol:{idRol:item.id,nombreRol:item.info[0]}});
                form.setFieldsValue({idRol:item.info[0]});
                setshowPicker(false);
            }}/>
        )

    return (
    <div>
        <FormPageHeader 
        ActionProv={ActionsProvider} 
        Text="Usuarios" 
        menu={userMenu}/>

        <div 
        className='BackImageCollapsible' 
        style={{display:ActionsProvider.isAdd? "none":""}}/>
        
        <FormAvName
        ActionProv={ActionsProvider} 
        Loading={Loading}
        Activo={user.activo}
        Pic="https://source.unsplash.com/random/800x600"
        Text={user.nombres+" "+user.apellidos}/>
        
        <Layout
        className='ContentLayout' 
        style={{display:Loading ? "None":""}}>
            
            <Form 
            disabled={ActionsProvider.isRead}
            onFinish={()=>{onFinish()}} 
            onFinishFailed={(e)=>{form.scrollToField(e.errorFields[0].name)}}
            form={form} 
            size='Default'
            style={{marginTop:"25px",maxWidth:"600px",width:"100%"}}>
                
                <div style={sectionStyle}>
                    <Title level={4}>Información Personal</Title>
                    <Form.Item 
                    name="nombres" 
                    label="Nombres:" rules={[{validator: (_, value) => ValDoubleName(value,"nombre")}]}>
                        <Input 
                        type="text" 
                        maxLength={30} 
                        placeholder='Nombres'/>
                    </Form.Item>

                    <Divider/>
                    <Form.Item 
                    name="apellidos" 
                    label="Apellidos:" 
                    rules={[{validator: (_, value) => ValDoubleName(value,"apellido")}]}>
                        <Input 
                        type="text"
                        placeholder='Apellidos'/>
                    </Form.Item>

                    <Divider/>
                    <Form.Item 
                    name="sexo" 
                    label="Género:" 
                    rules={[{required:true,message:"¡Seleccione el género!"}]}>
                        <Select>
                            <Select.Option value="M">Masculino</Select.Option>
                            <Select.Option value="F">Femenino</Select.Option>
                            <Select.Option value="O">Otro</Select.Option>
                        </Select>
                    </Form.Item>

                    <Divider/>
                    <Form.Item name="fechaNacimiento" label="Fecha de nacimiento:" rules={[{
                    required:true,message:"¡Introduzca la fecha de Nacimiento!"}]}>
                        <DatePicker inputReadOnly={true} picker="date"/>
                    </Form.Item>
                </div>

                <div style={sectionStyle}>
                    <Title level={4}>Información de Contacto</Title>
                    <Form.Item name="numCel" label="Numero Telefónico:" rules={[{
                        required: true, message: 'Introduzca el número Celular!'}]}>
                        <PhoneInput disabled={ActionsProvider.isRead} placeholder="Numero de Celular"/>
                    </Form.Item>

                    <Divider/>
                    
                    <Form.Item name="email" label="Correo Electrónico:" 
                    rules={[{
                        type: 'email',message: '¡No es un correo Válido!',},
                        {required:true,message:"¡Introduzca el Correo!"}]}>
                        <Input type="email" placeholder='Correo Electrónico'/>
                    </Form.Item>
                </div>

                <div style={sectionStyle}>
                    <Title level={4}>Información Laboral</Title>
                    
                    <Form.Item 
                    name="idRol" 
                    label="Rol:"
                    rules={[{required:true,message:"¡Seleccione el rol!"}]}>
                        <Input 
                        disabled
                        type="text"
                        placeholder="Seleccione un rol"
                        suffix={
                            <Button
                            type="primary"
                            shape="round" 
                            onClick={()=>{setshowPicker(true)}}>
                                    Seleccionar Rol
                            </Button>
                        }/>
                    </Form.Item>
                </div>

                {ActionsProvider.isAdd?
                <div style={sectionStyle}>
                    <Title level={4}>Información de Acceso</Title>
                    <Form.Item name="password" label="Contraseña:" 
                    rules={[{required: true, message: 'Introduzca la contraseña!'}]}>
                        <Input.Password placeholder='Contraseña'/>
                    </Form.Item>
                </div>
                :null}

                <ButtonSubmit ActionProv={ActionsProvider} isLoading={isLoading}/>

            </Form>
        </Layout>
    </div>
    );
}