import "./ReddangerButton.css";
import React, { useState } from 'react';
import { Modal, Button } from 'antd';
import { useNavigate} from "react-router-dom";

export default function Logoutbutton(){
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    let Navigate = useNavigate();

    const showModal = () => {
        setOpen(true);
      };
    
      const handleOk = () => {
        setConfirmLoading(true);
        setTimeout(() => {
            setOpen(false);
            setConfirmLoading(false);
            localStorage.removeItem("accessToken");
            localStorage.removeItem("user");
            Navigate("/");
        }, 1000);
      };
    
      const handleCancel = () => {
        setOpen(false);
      };

    return(<>
        <button 
        key="logout" 
        onClick={showModal} 
        className="Logout">
          Cerrar Sesión
        </button>

        <Modal 
        key="logoutModal" 
        centered 
        title="Cerrar Sesión" 
        open={open} 
        onOk={handleOk} 
        onCancel={handleCancel}
            footer={[
                <Button 
                key="back" 
                onClick={handleCancel}>
                  Cancelar
                </Button>,
                
                <Button 
                key="submit" 
                type="primary" 
                loading={confirmLoading} 
                danger 
                onClick={handleOk}>
                  Cerrar Sesión
                </Button>]}>
        <p>¿Está seguro de cerrar sesión?</p> 
        </Modal>
      </>)
}