import { LoginOutlined } from '@ant-design/icons';
import { Form, Input, Button, Checkbox, message } from 'antd';
import React,{useState} from "react";
import { useNavigate} from "react-router-dom";
import { loginUser } from "../Utils/FetchingInfo";
import { decodeJWT } from '../Utils/Calwulator';
import "./LogInForm.css";

const LogInForm = () =>{
  const [form] = Form.useForm();
  const [isLoading,setloading]= useState(false);
  let Navigate = useNavigate();

  async function getUserField(){
    return form.getFieldValue("username");
  }

  async function getPassField(){
    return form.getFieldValue("password");
  }

  const onFinish = async e =>{
    if(!isLoading){
      setloading(true);
      const email = await getUserField();
      const password = await getPassField();
      loginUser({email,password}).then((result)=>{
        message.success("Bienvenido",1).then((value) =>{
        localStorage.setItem('accessToken', result.token);

        const user = decodeJWT(result.token);
        localStorage.setItem('user', JSON.stringify(user));
        
        setloading(false);
        Navigate("/Personal/Home");});
      }).catch((error)=>{
        message.error("La contraseña o correo son incorrectos",3);
        setloading(false);
      })
    }
    
  }

    return(
      <div className='contentForm'>
          <Form form={form} name='LogInForm' className='logInForm' onFinish={onFinish} initialValues={{remember:true}} size="large">
            <Form.Item name="username" rules={[{
              required:true,
              message:"¡Introduzca su nombre de usuario!"
            }]}>
              <Input placeholder='Usuario'/>
            </Form.Item>
            <Form.Item name="password" rules={[{
              required:true,
              message:"¡Introduzca su contraseña!"
            }]}>
              <Input.Password placeholder='Contraseña'/>
            </Form.Item>
            <Form.Item>
              <Form.Item name="remember" valuePropName='checked' noStyle>
                <Checkbox style={{color:"white"}}>Recordarme</Checkbox>
              </Form.Item>
              <a  href=''>¿Olvidó su contraseña?</a>
            </Form.Item>
            <Form.Item>
              <Button type='primary' style={{width:"100%"}} icon={<LoginOutlined/>} loading={isLoading} shape='round' htmlType='submit'>Iniciar Sesión</Button>
            </Form.Item>
          </Form>
      </div>
    )
}

export default LogInForm