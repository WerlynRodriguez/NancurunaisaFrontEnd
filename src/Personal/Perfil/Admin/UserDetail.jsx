import { DeleteOutlined } from "@ant-design/icons";
import { Button, DatePicker, Divider, Form, Input, Layout, Menu, message, Select, Typography } from "antd";
import { useEffect, useState } from "react";
import PhoneInput from "react-phone-input-2";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { User } from "../../../Models/Models";
import moment from 'moment';
import { ActionsProviders, getaction } from "../../../Utils/ActionsProviders";
import { ChangeStatus, Create, getById, Update } from "../../../Utils/FetchingInfo";
import { BlockRead, ButtonSubmit, FormAvName, FormPageHeader, sectionStyle, ValDoubleName } from "../../../Utils/TextUtils";

const {Title} = Typography;

export default function UserDetail() {
    let Navigate = useNavigate();
    //What is my Url
    const local = useLocation();
    //I want to know what is the action that I have to do
    const ActionsProvider = new ActionsProviders(getaction(local.pathname,5));

    const {idUS} = useParams(); /* Params react Router fron now what is the id to want a action */

    //When the action is read or update, the form is loading the data
    const [Loading,setLoading] = useState(idUS==null? false:true)
    //When the action is add, load for update and wait response from server
    const [isLoading,setloading]= useState(false);
    const [form] = Form.useForm();

    const [user, setUser] = useState([]);

    useEffect(() => {
        if(ActionsProvider.isAdd){ return; }
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
        activo`;

        getById("usuarios","idUsuario",idUS,items).then((response) => {
            if (response == "errors") return;

            setUser(response.items[0]);
            form.setFieldsValue({
                nombres: response.items[0].nombres,
                apellidos: response.items[0].apellidos,
                sexo: response.items[0].sexo,
                fechaNacimiento: moment(response.items[0].fechaNacimiento),
                numCel: response.items[0].numCel,
                email: response.items[0].email,
            });

            setLoading(false);
        });
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
            activo: true`;

        const items = "idUsuario";

        Create("Usuario","usuario",vars,items).then((response) => {
            if (response["crearUsuario"] != null) {
                message.success("Usuario creado correctamente");
                Navigate("/Personal/Ajustes/Admin/Usuarios");
            } else {
                message.error("Error al crear el usuario");
                setloading(false);
            }
        }).catch((error) => {
            message.error("Error al crear el usuario");
            setloading(false);
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
            foto: null
            activo: true`;
        const items = "idUsuario";

        Update("Usuario","usuarioInput",vars,items).then((response) => {
            if (response["actualizarUsuario"] != null) {
                message.success("Usuario actualizado correctamente",2).then(() => {
                    Navigate("/Personal/Ajustes/Admin/Usuarios");
                });
            } else {
                message.error("Error al actualizar el usuario");
                setloading(false);
            }
        }).catch((error) => {
            message.error("Error al actualizar el usuario");
            setloading(false);
        })
    }

    const ChangeStatusUser = () => {
        setLoading(true);
        ChangeStatus("Usuario","idUsuarios",idUS,"activo",user.activo,"idUsuario").then((response) => {
            if (response.actualizarEstadoUsuario != null) {
                message.success("Usuario "+(user.activo?"deshabilitado":"habilitado") +" correctamente",2).then(() => {
                    FetchData();
                });
            } else {
                message.error("Error al actualizar el usuario");
                setLoading(false);
            }
        }).catch((error) => {
            message.error("Error al actualizar el usuario");
            setLoading(false);
        })
    }

    //======================================================================
    //This is the menu will be displayed in the header when the action is Read or Update
    //======================================================================
    const userMenu = (
        <Menu 
        style={{width:"200px",borderRadius:"20px"}}
        //theme="dark"
        items={[
            {key:"item1",label:(user.activo?"Deshabilitar":"Habilitar")+" usuario",onClick:()=>{ChangeStatusUser()}},
        ]}/>
    );

    return (<div>
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
                    label="Nombres:" rules={[{validator: (_, value) => ValDoubleName(value,"nombres")}]}>
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
    </div>);
}