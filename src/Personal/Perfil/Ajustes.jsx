import React, { useEffect, useState } from "react";
import {
  Layout,
  Typography,
  Avatar,
  Menu,
  Dropdown,
  PageHeader,
  Button,
  Collapse,
  Checkbox,
  message,
  Skeleton,
} from "antd";
import Logout from "../../Components/LogOutButton";
import "../../Utils/TextUtils.css";
import {
  DatabaseFilled,
  FormatPainterFilled,
  NotificationFilled,
  QuestionCircleFilled,
  ReadFilled,
  SmileFilled,
  SnippetsFilled,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { getById } from "../../Utils/FetchingInfo";
import { User } from "../../Models/Models";
import TRABAJO3 from "../../resources/Ayuda/trabajo3.pdf";

const { Title } = Typography;

export default function Ajustes() {
  let Navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(new User(null));

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    setLoading(true);

    const item = `nombres
        apellidos
        idRol{
            idRol
            nombreRol
        }`;
    const id = JSON.parse(localStorage.getItem("user")).UserId;

    getById("usuarios", "idUsuario", id, item).then((response) => {
      const aux = new User(response.data.usuarios.items[0]);

      let auxItems = [];
      auxItems.push(
        getItem("Notificaciones", "opNot", <NotificationFilled />, [
          getItem(
            "Permitir Notificaciones",
            "opNotPer",
            <QuestionCircleFilled />
          ),
        ])
      );

      if (aux.idRol.idRol === 1) {
        auxItems.push(
          getItem("Administrar", "opAdm", <DatabaseFilled />, [
            getItem("Usuarios", "opAdmU", <SmileFilled />),
            getItem("Roles", "opAdmR", <SnippetsFilled />),
          ])
        );
      }

      auxItems.push(getItem("Personalizar", "opPer", <FormatPainterFilled />));
      auxItems.push(getItem("Ayuda", "opAyu", <ReadFilled />));
      setItems(auxItems);

      setUser(aux);
      setLoading(false);
    });
  };

  function getItem(label, key, icon, children, type) {
    return { key, icon, children, label, type };
  }

  //All the items that will be displayed in the menu
  const [items, setItems] = useState([]);

  function handleMenuClick(e) {
    switch (e.key) {
      case "opNotPer":
        Notification.requestPermission().then(function (result) {
          if (result == "granted") {
            new Notification("Notificaciones Activadas", {
              body: "Ahora recibirás notificaciones de la aplicación",
              icon: "/src/dibujo.svg",
            });
          } else {
            message.error("No se permitieron las notificaciones");
          }
        });
        break;
      case "opAdmU":
        Navigate("/Personal/Ajustes/Admin/Usuarios");
        break;
      //case "opAdmU": Navigate("/Personal/Clinica/Terapeutas"); break;
      case "opAdmR":
        Navigate("/Personal/Ajustes/Admin/Roles");
        break;

      case "opAyu":
        window.open(TRABAJO3);
        break;

      default:
        console.log("Error");
        break;
    }
  }

  return (
    <Layout>
      <PageHeader
        ghost={false}
        title={<Title level={3}>Configuración</Title>}
      />

      <Layout className="ContentLayout">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            borderRadius: "25px",
            paddingBottom: "20px",
            maxWidth: 600,
            width: "100%",
            backgroundColor: "white",
          }}
        >
          {loading ? (
            <>
              <Skeleton.Button
                active
                shape="square"
                style={{
                  display: loading ? "" : "none",
                  margin: "10px 0px",
                  width: "100%",
                  minHeight: "120px",
                  boxSizing: "content-box",
                }}
              />
              <Skeleton.Button
                active
                shape="round"
                style={{
                  display: loading ? "" : "none",
                  margin: "10px 10px",
                  width: "auto",
                  minHeight: "20px",
                }}
              />
            </>
          ) : (
            <>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  paddingTop: 15,
                  paddingBottom: 15,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100px",
                    height: "100px",
                  }}
                >
                  <DatabaseFilled
                    style={{ color: "black", fontSize: "50px" }}
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    width: "80%",
                    marginLeft: 25,
                  }}
                >
                  <Title level={4}>{user.nombres + " " + user.apellidos}</Title>
                  <Typography>{user.idRol.nombreRol}</Typography>
                </div>
              </div>
              <Menu
                mode="inline"
                defaultSelectedKeys={["1"]}
                onClick={(e) => {
                  handleMenuClick(e);
                }}
                items={items}
              />
            </>
          )}
        </div>

        <Logout />
      </Layout>
    </Layout>
  );
}
