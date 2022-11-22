import { LockFilled, LoginOutlined, MailFilled } from '@ant-design/icons';
import { Form, Input, Button, Checkbox, message } from 'antd';
import React,{useState} from "react";
import { useNavigate} from "react-router-dom";
import { loginUserGQL } from "../Utils/FetchingInfo";
import { decodeJWT } from '../Utils/Calwulator';
import "./LogInForm.css";

export default function LogInForm(){
  const [form] = Form.useForm();
  const [isLoading,setloading]= useState(false);
  let Navigate = useNavigate();

  const onFinish = () =>{
    if(isLoading) { return; }
    setloading(true);
    
    //--------------------------------
    // Send request to server to login
    //--------------------------------
    loginUserGQL(form.getFieldValue("username"),form.getFieldValue("password")).then((result)=>{
      if (result == "errors") { 
        setloading(false);
        return;
      }

      let token = result.data.authentication.token.token;
      message.success("Bienvenido",2,()=>{
        
        // Get user info from token
        const user = decodeJWT(token);
        // Save user info in local storage (for remember user)
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('accessToken', token);
        
        setloading(false);
        Navigate("/Personal/Home");
      });
    });
  }

    return(
      <div className='contentForm'>

          <Form 
          form={form} 
          name='LogInForm' 
          className='logInForm' 
          onFinish={onFinish} 
          initialValues={{remember:true}} 
          size="large">

            <Form.Item 
            name="username" 
            rules={[{
              required:true,
              message:"¡Introduzca su nombre de usuario!"
            }]}>

              <Input 
              type="email" 
              placeholder="Correo" 
              prefix={<MailFilled />} />
            </Form.Item>

            <Form.Item 
            name="password" 
            rules={[{
              required:true,
              message:"¡Introduzca su contraseña!"
            }]}>

              <Input.Password 
              placeholder='Contraseña' 
              prefix={<LockFilled />}/>
            </Form.Item>

            <Form.Item>
              <Form.Item 
              name="remember" 
              valuePropName='checked' 
              noStyle>

                <Checkbox 
                style={{color:"white"}}>
                  Recordarme
                </Checkbox>
              </Form.Item>
              <a  href=''>¿Olvidó su contraseña?</a>
            </Form.Item>

            <Form.Item>
              <Button 
              type='primary' 
              style={{width:"100%"}} 
              icon={<LoginOutlined/>} 
              loading={isLoading} 
              shape='round' 
              htmlType='submit'>
                Iniciar Sesión
              </Button>
            </Form.Item>
          </Form>
      </div>
    )
}