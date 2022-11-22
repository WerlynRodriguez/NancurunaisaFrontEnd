import "../../../Utils/TextUtils.css";
import { DeleteOutlined } from "@ant-design/icons";
import { Button, Card, Checkbox, Collapse, DatePicker, Divider, Form, Input, Layout, List, Menu, message, Select, Switch, Typography } from "antd";
import { useEffect, useState } from "react";
import PhoneInput from "react-phone-input-2";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Rol, User } from "../../../Models/Models";
import moment from 'moment';
import { ActionsProviders, FormActions, getaction } from "../../../Utils/ActionsProviders";
import { ChangeStatus, Create, getById, getByPag, Update } from "../../../Utils/FetchingInfo";
import { BlockRead, ButtonSubmit, FormAvName, FormPageHeader, sectionStyle, ValDoubleName } from "../../../Utils/TextUtils";

const {Title} = Typography;

export default function RolDetail(props){
    let Navigate = useNavigate();
    //What is my Url
    const local = useLocation();
    const {idRol} = useParams();
    
    var ActionsProvider

    if (idRol == 1)
        ActionsProvider = new ActionsProviders(FormActions.Read);
    else
        ActionsProvider = new ActionsProviders(getaction(local.pathname,5));

    //When the action is read or update, the form is loading the data
    const [Loading,setLoading] = useState(idRol==null? false:true)
    //When the action is add, load for update and wait response from server
    const [isLoading,setloading]= useState(false);
    const [form] = Form.useForm();

    const [rol, setRol] = useState(new Rol(null));
    const [modules, setModules] = useState([]);

    useEffect(() => {
        FetchData();
    }, []);

    //======================================================================
    //When the action is read or update, Fetch the data from server
    //======================================================================
    const FetchData = () => {
        setLoading(true);

        const ritems = `idModulo
        nombre
        activo
        operacion{
            idOperacion
            nombre
            descripcion
            activo
        }`;

        const searchQuery = `nombre: {contains:"${""}"}`;

        getByPag("modulos", ritems, 0, 10, searchQuery, "nombre: ASC").then((mresponse) => {
            if (mresponse == "errors") return;

            setModules(mresponse.items);

            const items = 
            `idRol
            nombreRol
            descripcion
            activo
            idOperacion{
                idOperacion
                idModulo
            }`;

            if (ActionsProvider.isAdd){ setLoading(false); return; }

            getById("roles","idRol",idRol,items).then((response) => {
                if (response == "errors") return;

                let rol = new Rol(response.data.roles.items[0]);
                rol.orderModules();
                setRol(rol);

                form.setFieldsValue({
                    nombreRol: rol.nombreRol,
                    descripcion: rol.descripcion
                });
            }).finally(() => { setLoading(false); } );
        });
    }

    const onFinish = () => {
        setloading(true);
        if(ActionsProvider.isAdd){
            AddRol();
        } else if(ActionsProvider.isUpdt){
            UpdateRol();
        }
    }

    const UpdateRol = () => {
        const permisos = rol.getArrayPermisos();
        const vars = `
            idRol: ${idRol}
            nombreRol: "${form.getFieldValue("nombreRol")}"
            descripcion: "${form.getFieldValue("descripcion")}"
            activo: ${rol.activo}
            operaciones: [${permisos}]
            `;
        const items = "idRol";

        Update("Rol","rolInput",vars,items).then((response) => {
            if (response == "errors") { setloading(false); return; }

            message.success("Rol actualizado correctamente",2).then(() => {
                FetchData();
            });
        });
    }

    const AddRol = () => {
        const permisos = rol.getArrayPermisos();
        const vars = `
            nombreRol: "${form.getFieldValue("nombreRol")}"
            descripcion: "${form.getFieldValue("descripcion")}"
            activo: true
            operaciones: [${permisos}]
            `;
        const items = "idRol";

        Create("Rol","rolInput",vars,items).then((response) => {
            if (response == "errors") { setloading(false); return; }

            message.success("Rol creado correctamente",2).then(() => {
                Navigate("/Personal/Ajustes/Admin/Roles");
            });
        });
    }

    const onSwitchPerm = (checked, item, module) => {
        if (checked) {
            rol.addPermiso(item.idOperacion, module.idModulo);
        } else {
            rol.removePermiso(item.idOperacion, module.idModulo);
        }
    }

    const userMenu = (
        <Menu style={{width:"200px",padding:"0px"}}>
            <Menu.Item key="2" style={{display:true?"":"none"}}>
            <Button  onClick={()=>{deleteTera()}} 
            style={{width:"100%",color:"red"}}>Eliminar</Button>
            </Menu.Item>
        </Menu>
        );

    return (<div>
        <FormPageHeader 
        ActionProv={ActionsProvider} 
        Text="Rol"/>

        <div 
        className='BackImageCollapsible' 
        style={{display:ActionsProvider.isAdd? "none":""}}/>
        
        <FormAvName
        ActionProv={ActionsProvider} 
        Loading={Loading} 
        Activo={rol.activo}
        Pic=""
        Text={rol.nombreRol}/>
        
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
                    <Title level={4}>Información Principal</Title>
                    <Form.Item 
                    name="nombreRol" 
                    label="Nombre:" 
                    rules={[{required:true,message:"¡Introduzca un nombre!"}]}>
                        <Input 
                        type="text"
                        minLength={5}
                        maxLength={30} 
                        placeholder='Nombre'/>
                    </Form.Item>

                    <Divider/>
                    <Form.Item 
                    name="descripcion" 
                    label="Descripción:">
                        <Input.TextArea
                        type="text"
                        minLength={5}
                        maxLength={100}
                        rows={4}
                        placeholder='Descripción'/>
                    </Form.Item>

                </div>

                <div style={sectionStyle}>
                    <Title level={4}>Permisos</Title>

                    <Collapse accordion>
                        {modules.map((module) => (
                            <Collapse.Panel header={module.nombre+" "+module.idModulo} key={module.idModulo}>
                                <List
                                dataSource={module.operacion}
                                grid={{
                                    gutter: 16,
                                    xs: 2,
                                    sm: 3,
                                    md: 4,
                                    lg: 4,
                                    xl: 6,
                                  }}
                                renderItem={item => (<>

                                    <h4>{item.nombre+" "+item.idOperacion}</h4>
                                    <h5>{item.descripcion}</h5>
                                    <Switch 
                                    defaultChecked={rol.hasPermiso(item.idOperacion, module.idModulo)}
                                    onChange={(checked) => {onSwitchPerm(checked,item,module)}}/>

                                </>)}/>

                            </Collapse.Panel>
                        ))}
                    </Collapse>
                </div>

                <ButtonSubmit ActionProv={ActionsProvider} isLoading={isLoading}/>
            </Form>
        </Layout>
    </div>);
}