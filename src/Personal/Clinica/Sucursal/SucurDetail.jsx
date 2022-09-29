import { Button, Collapse, Divider, Form, Input, Layout, List, Menu, message, Space, Table, Typography } from "antd";
import { EditOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import React, {useState,useEffect} from 'react';
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { TerataFormActionProvider, getaction } from "../../../Utils/ActionsProviders";
import { CreateHab, CreateSucur, DeleteSucur, GetByIdSucur, UpdateHab, UpdateSucursal } from "../../../Utils/FetchingInfo";
import { BlockRead, ButtonSubmit, FormAvName, FormPageHeader, sectionStyle } from "../../../Utils/TextUtils";
import { BottomSheet } from "react-spring-bottom-sheet";
import { Habitacion, Sucursal } from "../../../Models/Models";
import ItemView from "../../../Components/Items/TerapeutaItem";

const { TextArea } = Input;
const {Title} = Typography;
const {Panel} = Collapse;

export default function SucurDetail(){
    let Navigate = useNavigate();
    const local = useLocation();/* What is my url */
    const ActionsProvider = new TerataFormActionProvider(getaction(local.pathname));/*Actions crud*/
    const {idSU} = useParams(); /* Params react Router fron now what is the id to want a action */

    const [Loading,setLoading] = useState(idSU==null? false:true);/*Fetching terapeuta info */
    const [isLoading,setloading]= useState(false);/*For Add teratas */
    const [form] = Form.useForm();

    const [Sucur,setSucursal] = useState([]);/* All terapeuta info after fetching */
    const [Cuartos,setCuartos] = useState([]);

    const [sheet,setSheet] = useState(false);/*For Bottom Sheet */
    const [indexC,setIndexC] = useState(-1);/*For Bottom Sheet */

    /* * * * * * * * * * * * * * * * * * *  */
    /*This Functions are Only in Action UPDATE */
    /* * * * * * * * * * * * * * * * * * *  */
    if (!ActionsProvider.isAdd) {
        useEffect(() => {SucurGet()},[])
    }
        
    const SucurGet = () =>{
        setLoading(true);
        GetByIdSucur(idSU).then((result)=>{
            setLoading(false);
            setSucursal(new Sucursal(result.idSucursal,result.nombreSucursal,result.direccion,false));
            /*cuartoss.map((item)=>{
                data.push({idHabitacion:item.idHabitacion,nombreHabitacion:item.nombreHabitacion})
            });*/
            setCuartos(result.habitacion);
            form.resetFields();
        }).catch((err)=>{
            setLoading(false);
            message.error(err);
        })
    }

    const onFinish=()=>{
        setloading(true);
        if (ActionsProvider.isAdd) {
            
            var data = 
            {
                "nombreSucursal": form.getFieldValue("Nombre"),
                "direccion": form.getFieldValue("Dir"),
                "habitacion": [],
                "masajista": []
            }
            CreateSucur(data).then((result)=>{
                message.success("Sucursal Añadida",1).then(()=>{
                setloading(false);
                Navigate(-1);
                })
            }).catch((error)=>{
                message.error("Error al añadir sucursal",1).then(()=>{
                setloading(false);
                })
            })
        }else{
            var data = {'id':idSU,"name": form.getFieldValue("Nombre")}
            UpdateSucursal(data).then((result)=>{
                if (result['status'] === 'ok'){
                  message.success("Sucursal Modificada",1).then(()=>{
                    setloading(false);
                    Navigate(-1);
                  })
                }else{message.error("No se pudo Modificar",2);setloading(false);}
              })
        }
    }

    const deleteSucur =()=>{
        var data = {'id':idSU}
            DeleteSucur(data).then((result)=>{
            if (result['status'] === 'ok'){
                message.success("Sucursal Eliminada",1).then(()=>{
                setloading(false);
                Navigate(-1);
                })
            }else{message.error("No se pudo Eliminar",2);setloading(false);}
            })
    }

    const MiniFormCubiculo = () =>{
        const add = indexC == -1? true:false;
        const [nombre,setNombre] = useState("");

        return(<div style={{width:'100%',padding:"20px"}}>
            <Input defaultValue={add?"":Cuartos[indexC].nombreHabitacion} onChange={(e)=>{setNombre(e.target.value)}} placeholder="Nombre el cubiculo"/>
            <Button type="primary" shape="round" loading={isLoading} icon={!add?<EditOutlined/>:<PlusOutlined/>} style={{marginTop:"20px"}}
            onClick={()=>{
                if (nombre == "" || nombre == null){
                    message.error("El nombre del cubiculo no puede estar vacio");
                    return;
                }
                if (add) {
                    setloading(true);
                    var data = {
                        "idSucursal":idSU,
                        "nombreHabitacion":nombre,
                        "cita":[]};
                    CreateHab(data).then((result)=>{
                        setCuartos([...Cuartos,data]);
                        message.success("Cubiculo Añadido",1).then(()=>{
                        setloading(false);
                        setSheet(false);
                        })
                    }).catch((error)=>{
                        message.error("Error al añadir cubiculo",1).then(()=>{
                        setloading(false);
                        })
                    })
                } else {
                    setLoading(true);
                    var data = {
                        "idHabitacion":Cuartos[indexC].idHabitacion,
                        "idSucursal":idSU,"nombreHabitacion":nombre
                    };
                    UpdateHab(Cuartos[indexC].idHabitacion,data).then((result)=>{
                        setCuartos([...Cuartos.slice(0,indexC),data,...Cuartos.slice(indexC+1)]);
                        message.success("Cubiculo Modificado",1).then(()=>{
                            setLoading(false);
                            setSheet(false);
                            })
                    }).catch((error)=>{
                        message.error("Error al modificar cubiculo",1).then(()=>{
                        setLoading(false);
                        })
                    });
                }
            }
            }>{add?"Añadir":"Editar"}</Button>
        </div>)
    }


    const userMenu = (
    <Menu style={{width:"200px",borderRadius:"20px"}}>
        <Menu.Item key="1">Item 1</Menu.Item>
        <Menu.Item key="2">Item 2</Menu.Item>
        <Menu.Item key="3">{Sucur.Active == true? "Desactivar":"Activar"}</Menu.Item>
        <Menu.Divider />
        <Menu.Item key="4">
        <Button type='primary' onClick={()=>{deleteSucur()}} danger 
        style={{width:"100%",borderBottomLeftRadius:"20px",borderBottomRightRadius:"20px"}}>Eliminar</Button>
        </Menu.Item>
    </Menu>
    );

    return (<div>
        <BlockRead Show={ActionsProvider.isRead}/>
        <FormPageHeader ActionProv={ActionsProvider} Text="Sucursal" menu={userMenu}/>
        <div className='BackImageCollapsible' style={{display:ActionsProvider.isAdd? "none":""}}/>
        <FormAvName ActionProv={ActionsProvider} Loading={Loading} Avatar={""} Text={Sucur.nombreSucursal}/>

        <Layout className='ContentLayout' style={{display:Loading ? "None":""}}>
            <Form onFinish={()=>{onFinish()}} onFinishFailed={(e)=>{form.scrollToField(e.errorFields[0].name)}} 
            initialValues={{Nombre:Sucur.nombreSucursal, Dir:Sucur.direccion}} 
            form={form} size='Default' style={{marginTop:"25px",maxWidth:"600px",width:"100%"}}>

                <div style={sectionStyle}>
                    <Title level={4}>Descripción</Title>
                    <Form.Item name="Nombre" label="Nombre:" rules={[{
                        required:true,message:"¡Introduzca el Nombre!"}]}>
                        <Input type="text" maxLength={30} placeholder='Nombre'/>
                    </Form.Item>
                    <Divider/>
                    <Form.Item name="Dir" label="Dirección:" rules={[{
                        required:true,message:"¡Introduzca la Dirección!"}]}>
                        <TextArea rows={4} maxLength={230} placeholder="Dirección"/>
                    </Form.Item>
                </div>
                
                <ButtonSubmit ActionProv={ActionsProvider} isLoading={isLoading}/>
            </Form>
            <Collapse bordered={false} style={{display:ActionsProvider.isAdd?"none":"",width:"100%",maxWidth:"600px"}}>
                <Panel header="Habitaciones" key="1" >
                    <List dataSource={Cuartos} renderItem={(cubi,index)=>(
                        <ItemView id={cubi.idHabitacion} avatar={""} onClick={(id,name,selected)=>{setIndexC(index);setSheet(true)}}
                        onLongPress={(id,name,selected)=>{}} mulSelMode={false}
                        text={cubi.nombreHabitacion} selected={false}/>
                        )}/>
                    <Button type="primary" shape="round" icon={<PlusOutlined/>}
                    onClick={()=>{setIndexC(-1);setSheet(true)}} style={{marginTop:"20px"}}>
                        Añadir Cubiculos
                    </Button>
                </Panel>
            </Collapse>
        </Layout>
        <BottomSheet open={sheet} onDismiss={()=>{setSheet(false)}} snapPoints={({ minHeight, maxHeight }) => [300, 650]}>
            {MiniFormCubiculo()}
        </BottomSheet>
    </div>)
}
/*"habitacion": [
                    {
                    "idHabitacion": 0,
                    "idSucursal": 0,
                    "nombreHabitacion": "string",
                    "cita": []
                    }
                ], */