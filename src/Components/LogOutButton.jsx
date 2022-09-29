import "./ReddangerButton.css";
import React, { useState } from 'react';
import { Modal, Button } from 'antd';
import { useNavigate} from "react-router-dom";

export default function Logoutbutton(){
    const [visible, setVisible] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    let Navigate = useNavigate();

    const showModal = () => {
        setVisible(true);
      };
    
      const handleOk = () => {
        setConfirmLoading(true);
        setTimeout(() => {
            setVisible(false);
            setConfirmLoading(false);
            localStorage.removeItem("accessToken");
            localStorage.removeItem("user");
            Navigate("/");
        }, 1000);
      };
    
      const handleCancel = () => {
        console.log('Clicked cancel button');
        setVisible(false);
      };

    return([
        <button key="logout" onClick={showModal} className="Logout">Cerrar Sesión</button>,
        <Modal key="logoutModal" centered title="Cerrar Sesión" visible={visible} onOk={()=>handleOk} onCancel={()=>handleCancel}
            footer={[
                <Button key="back" onClick={handleCancel}>
                  Cancelar
                </Button>,
                <Button key="submit" type="primary" loading={confirmLoading} danger onClick={handleOk}>
                  Cerrar Sesión
                </Button>]}>
        <p>¿Está seguro de cerrar sesión?</p> </Modal>
        ]
    )
}