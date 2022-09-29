import { Button, Checkbox, Collapse, DatePicker, Divider, Form, Input, InputNumber, Layout, Menu, message, Select, Space, Typography } from "antd";
import WatsButton from "../../../Components/WatsButton";
import { BlockRead, ButtonSubmit, FormAvName, FormPageHeader, sectionStyle, ValDoubleName } from "../../../Utils/TextUtils";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getaction, TerataFormActionProvider } from "../../../Utils/ActionsProviders";
import { useEffect, useState } from "react";
import { CreatePac, DeletePac, GetByIdPac, UpdatePac } from "../../../Utils/FetchingInfo";
import moment from 'moment';/*What Day is? */
import { DeleteOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { AFP, AFPStrings, AnamAStrings, APNP, APNPStrings, APP, APPStrings } from "../../../Utils/Anamnesis";

const {Title} = Typography

export default function PacSDetail(){
    let Navigate = useNavigate();
    const local = useLocation();/* What is my url */
    const ActionsProvider = new TerataFormActionProvider(getaction(local.pathname));/*Actions crud*/
    const {idPA} = useParams(); /* Params react Router fron now what is the id to want a action */

    const [Loading,setLoading] = useState(idPA==null? false:true);/*Fetching terapeuta info */
    const [isLoading,setloading]= useState(false);/*For Add teratas */
    const [form] = Form.useForm();
    const [SelectedAFP,setSelectedAFP] = useState([0,8]);
    const [SelectedAPNP, setSelectedAPNP] = useState([3]);
    const [SelectedAPP,setSelectedAPP] = useState([1]);
    const [isWorking,setisWorking] = useState(false);

    const [Pac,setPac] = useState([]);/* All terapeuta info after fetching */

    if (!ActionsProvider.isAdd) {
        useEffect(() => {PacGet()},[])
    }

    const PacGet = () =>{
        GetByIdPac(idPA).then((result)=>{
            setLoading(false);
            setPac(result);
            //setisWorking();
            form.resetFields();
        }).catch((err)=>{
            setLoading(false);
            message.error(err);
        })
    }

    const onFinish=()=>{
        setloading(true);
        if (ActionsProvider.isAdd) {
            var data = {
                "nombres": form.getFieldValue("Nombres"),
                "apellidos": form.getFieldValue("Apellidos"),
                "sexo": form.getFieldValue("Gender"),
                "edad": 47,
                "nacionalidad": form.getFieldValue("Country"),
                "profesion_oficio": "Systems Administrator I",
                "horas_trabajo": 6,
                "numCel": form.getFieldValue("Phone"),
                "fecha_nacimiento": moment(form.getFieldValue("Birth")).format("YYYY-MM-DD"),
                "amnanesis": []
            }
            CreatePac(data).then((result)=>{
                message.success("Paciente Añadido",1).then(()=>{
                setloading(false);
                Navigate(-1);})
            }).catch((err)=>{
                setloading(false);
                message.error(err);
            })
        }else{
            var data = {'id':idPA,"fname": form.getFieldValue("Nombres")}
            UpdatePac(data).then((result)=>{
                if (result['status'] === 'ok'){
                    message.success("Paciente Modificado",1).then(()=>{
                    setloading(false);
                    Navigate(-1);
                  })
                }else{message.error("No se pudo Modificar",2);setloading(false);}
              })
        }
    }

    const deletePac =()=>{
        var data = {'id':idPA}
            DeletePac(data).then((result)=>{
            if (result['status'] === 'ok'){
                message.success("Paciente Eliminado",1).then(()=>{
                setloading(false);
                Navigate(-1);
                })
            }else{message.error("No se pudo Eliminar",2);setloading(false);}
            })
    }

    const userMenu = (
    <Menu style={{width:"200px",borderRadius:"20px"}}>
        <Menu.Item key="3">{Pac.Active == true? "Desactivar":"Activar"}</Menu.Item>
        <Menu.Divider />
        <Menu.Item key="4">
        <Button type='primary' onClick={()=>{deletePac()}} danger  icon={<DeleteOutlined/>}
        style={{width:"100%",borderBottomLeftRadius:"20px",borderBottomRightRadius:"20px"}}>Eliminar</Button>
        </Menu.Item>
    </Menu>
    );

    const formItemLayout = {labelCol: {span: 24 },wrapperCol: {span: 24}};


    return(<div>
        <BlockRead Show={ActionsProvider.isRead}/>
        <FormPageHeader ActionProv={ActionsProvider} Text="Paciente" menu={userMenu}/>
        <div className='BackImageCollapsible' style={{display:ActionsProvider.isAdd? "none":""}}/>

        <FormAvName ActionProv={ActionsProvider} Loading={Loading} Avatar={""} Text={Pac.nombres+" "+Pac.apellidos}/>

        <Layout className='ContentLayout' style={{display:Loading ? "None":""}}>
            <div style={{zIndex:"6",display:ActionsProvider.isAdd? "none":"flex"}}>
            <WatsButton number="+50581248928"/>
            </div>

            <Form onFinish={()=>{onFinish()}} onFinishFailed={(e)=>{form.scrollToField(e.errorFields[0].name)}} 
            initialValues={{Nombres:Pac.nombres, Apellidos:Pac.apellidos,Phone:"505"+Pac.numCel,
            Country:Pac.nacionalidad, Gender:Pac.sexo,Birth:moment("1990/01/01", "YYYY/MM/DD"),
            AFPValues:["Nuez", "Cerveza"],APPValues:["Amigdalitis"],
            APNPValues:[{"Des":"Cocaina","C":2,"F":"D"}]}} 
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
                    <Form.Item label="Nacionalidad:" name="Country" rules={[{
                    required:true,message:"¡Introduzca la Nacionalidad!"}]}>
                        <Input placeholder='Nacionalidad'/>
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
                        <PhoneInput/>
                    </Form.Item>
                </div>

                <div style={sectionStyle}>
                    <Title level={4}>Anamnesis A</Title>

                    <Collapse accordion>
                        <Collapse.Panel header={AnamAStrings[0]} key={0}>
                        <Form.List name="AFPValues">
                                {(fields, { add, remove }, { errors }) => (<>{fields.map((field, index) => (
                                    <Form.Item {...formItemLayout}
                                    label={AFPStrings[SelectedAFP[index]]}  key={field.key}>
                                        
                                        <Form.Item {...field} rules={[{required:true,message:"¡Especifique!"}]} noStyle>
                                            <Input placeholder="Descripción" style={{ width: '100%' }} />
                                        </Form.Item>
                                        <Divider/>
                                    </Form.Item>))}
                                    
                                    <Form.Item label="AFP:">
                                        <Select mode="multiple" style={{ width: '100%' }} value={SelectedAFP} 
                                        placeholder="AFP" showSearch={false}
                                        onSelect={()=>{add()}}
                                        onDeselect={(value)=>{remove(SelectedAFP.indexOf(value))}} 
                                        onChange={(value)=>{setSelectedAFP(value)}}>
                                            {AFP}
                                        </Select>
                                        <Form.ErrorList errors={errors} />
                                    </Form.Item>
                                    </>)}
                        </Form.List>
                        </Collapse.Panel>
                        <Collapse.Panel header={AnamAStrings[1]} key={1}>
                        <Form.List name="APNPValues">
                            {(fields, { add, remove }, { errors }) => (
                            <>
                                {fields.map((field,index) => (
                                <Form.Item label={APNPStrings[SelectedAPNP[index]]} key={[field.key,"1"]}>
                                    <Form.Item noStyle key={[field.key,"2"]} name={[field.name, 'Des']}
                                    rules={[{ required: true, message: '¡Describe el Padecimiento!' }]}>
                                        <Input.TextArea autoSize style={{width:"100%"}} placeholder="Descripción"/>
                                    </Form.Item>

                                    <Form.Item noStyle key={[field.key,"3"]} name={[field.name, 'C']}
                                    rules={[{ required: true, message: '¡Indica su Cantidad!' }]}>
                                        <InputNumber max={99} min={1} style={{width:"50%"}} placeholder="Cantidad"/>
                                    </Form.Item>
                                    <Form.Item noStyle key={[field.key,"4"]} name={[field.name, 'F']}
                                    rules={[{ required: true, message: '¡Indica su Frecuencia!' }]}>
                                        <Select style={{width:"50%"}}>
                                            <Select.Option key={0} value="M">Minutos</Select.Option>,
                                            <Select.Option key={1} value="H">Hora</Select.Option>,
                                            <Select.Option key={2} value="D">Dia</Select.Option>,
                                            <Select.Option key={3} value="M">Mes</Select.Option>,
                                        </Select>
                                    </Form.Item>
                                </Form.Item>))}
                                
                                <Form.Item label="APNP:">
                                    <Select mode="multiple" style={{ width: '100%' }} value={SelectedAPNP} 
                                    placeholder="APNP" showSearch={false}
                                    onSelect={()=>{add()}}
                                    onDeselect={(value)=>{remove(SelectedAPNP.indexOf(value))}} 
                                    onChange={(value)=>{setSelectedAPNP(value)}}>
                                        {APNP}
                                    </Select>
                                    <Form.ErrorList errors={errors} />
                                </Form.Item>
                            </>
                            )}
                        </Form.List>
                        </Collapse.Panel>
                        <Collapse.Panel header={AnamAStrings[2]} key={2}>
                        <Form.List name="APPValues">
                                {(fields, { add, remove }, { errors }) => (<>{fields.map((field, index) => (
                                    <Form.Item {...formItemLayout}
                                    label={APPStrings[SelectedAPP[index]]} key={field.key}>
                                        
                                        <Form.Item {...field} rules={[{required:true,message:"Especifique"}]} noStyle>
                                            <Input.TextArea autoSize rows={2} maxLength={500} placeholder="Descripción" style={{ width: '100%' }} />
                                        </Form.Item>
                                        <Divider/>
                                    </Form.Item>))}
                                    
                                    <Form.Item label="APP:">
                                        <Select mode="multiple" style={{ width: '100%' }} value={SelectedAPP} 
                                        placeholder="APP" showSearch={false}
                                        onSelect={()=>{add()}}
                                        onDeselect={(value)=>{remove(SelectedAPP.indexOf(value))}} 
                                        onChange={(value)=>{setSelectedAPP(value)}}>
                                            {APP}
                                        </Select>
                                        <Form.ErrorList errors={errors} />
                                    </Form.Item>
                                    </>)}
                        </Form.List>
                        </Collapse.Panel>
                        <Collapse.Panel header={AnamAStrings[3]} key={3}>
                            <Form.Item name="HLisWorking">
                               <Checkbox checked={isWorking} onChange={()=>{setisWorking(!isWorking)}}>Trabajo</Checkbox> 
                            </Form.Item>
                            <Form.Item name="HLLugar" label="Lugar" rules={[{required:isWorking,message:"¡Especifique!"}]}>
                                <Input disabled={!isWorking} placeholder="Lugar" style={{ width: '100%' }}/>
                            </Form.Item>
                            <Form.Item name="HLAños" label="Años" rules={[{required:isWorking,message:"¡Especifique!"}]}>
                                <InputNumber disabled={!isWorking} type="number" maxLength="3" max="100" placeholder="Años del trabajo Actual" style={{ width: '100%' }}/>
                            </Form.Item>
                            
                        </Collapse.Panel>
                    </Collapse>
                </div>

                <ButtonSubmit ActionProv={ActionsProvider} isLoading={isLoading}/>

            </Form>
        </Layout>
    </div>)
}