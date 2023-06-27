import { ActionsProviders } from "../../../Utils/ActionsProviders";
import {
  BlockRead,
  ButtonSubmit,
  FormPageHeader,
  sectionStyle,
} from "../../../Utils/TextUtils";
import React, { useState, useEffect } from "react";
import {
  Button,
  Divider,
  Form,
  Input,
  InputNumber,
  Layout,
  Menu,
  message,
  Skeleton,
  Typography,
} from "antd";
import { useNavigate } from "react-router-dom";
import { Factura } from "../../../Models/Models";
import {
  Create,
  getById,
  getTotalFactura as getTotalFacturaById,
} from "../../../Utils/FetchingInfo";
const { Title } = Typography;

export default function FacturaDet(props) {
  let Navigate = useNavigate();
  let idFac = 0;
  const { idCita, idFactura, action } = props;
  const [factura, setFactura] = useState(idFactura);
  const [isLoading, setloading] = useState(false);

  const [Loading, setLoading] = useState(idFactura ? true : false);
  const ActionsProvider = new ActionsProviders(action); /*Actions crud*/

  const [Factu, setFactu] = useState(new Factura(null));
  const [descuentoString, setDescuentoString] = useState("");

  const [total1, setTotal] = useState("0");
  console.log("state " + total1);
  const [form] = Form.useForm();
  // var totalFactura = 0;
  const [totalFactura, setTotalFactura] = useState(0);

  useEffect(() => {
    if (ActionsProvider.isAdd) {
      gettotalFactura();
      return;
    }
    FactGet(idFactura);
  }, []);

  const FactGet = () => {
    const items = `
        idFactura
        idCita
        descuento
        subTotal
        total
        activo
        `;
    getById("facturas", "idFactura", idFactura ? idFactura : idFac, items).then(
      (res) => {
        if (res == "errors") return;

        const auxFact = new Factura(res.data.facturas.items[0]);
        form.setFieldsValue({
          subTotal: auxFact.subTotal,
          total: auxFact.total,
          descuento: auxFact.descuento,
        });
        setFactu(auxFact);
        setLoading(false);
      }
    );
  };
  const gettotalFactura = () => {
    getTotalFacturaById(idCita).then((res) => {
      if (res == "errors") return;
      form.setFieldsValue({
        subTotal: res.data.totalFactura,
        total: res.data.totalFactura,
      });
      setTotalFactura(res.data.totalFactura);
    });
  };

  const onBack = () => {
    if (typeof props.onBack === "function") {
      props.onBack();
    }
  };

  const onFinish = () => {
    setloading(true);
    if (ActionsProvider.isAdd) {
      AddFactu();
      setloading(false);
    } else {
      setloading(false);
    }
  };

  const AddFactu = () => {
    const vars = Factu.toString(form.getFieldsValue(), idCita);
    console.log(vars);

    Create("Factura", "facturaInput", vars, "idFactura").then((res) => {
      if (res == "errors") {
        setloading(false);
        return;
      }

      message.success("Facturado", 2, () => {
        props.onAddFactura();
        FactGet(res.data.createFactura.idFactura);
      });
    });
  };

  const userMenu = [
    {
      key: "item1",
      label: "GenerarPDF",
      onClick: () => {
        message.info("GenerarPDF");
      },
    },
  ];

  return (
    <div style={{ backgroundColor: "#5a33ae" }}>
      <FormPageHeader
        ActionProv={ActionsProvider}
        Text="Factura"
        menu={userMenu}
        onBack={() => {
          onBack();
        }}
      />

      {Loading ? (
        <Skeleton.Button
          active={true}
          size="large"
          shape="square"
          block
          style={{ width: "100%", height: "400px" }}
        />
      ) : null}
      <Layout className="ContentLayout">
        <Form
          onFinish={() => {
            onFinish();
          }}
          onFinishFailed={(e) => {
            form.scrollToField(e.errorFields[0].name);
          }}
          form={form}
          size="Default"
          disabled={ActionsProvider.isRead}
          style={{
            display: Loading ? "none" : "",
            marginTop: "25px",
            maxWidth: "600px",
            width: "100%",
          }}
        >
          <div style={sectionStyle}>
            <Title level={4}>Descripción</Title>

            <Form.Item name="subTotal" label="Sub total:">
              <InputNumber
                style={{ width: "100%" }}
                type="number"
                min={0}
                maxLength={6}
                disabled
                // value={Factu.subTotal}
                prefix="$"
                placeholder="Subtotal"
              />
            </Form.Item>

            <Divider />
            <Form.Item
              name="descuento"
              label="Descuento:"
              extra={descuentoString}
              rules={[{ required: true, message: "¡Ingrese el Descuento!" }]}
            >
              <InputNumber
                style={{ width: "100%" }}
                type="number"
                prefix="$"
                maxLength={6}
                placeholder="Descuento"
                defaultValue={0}
                max={totalFactura}
                onChange={(value) => {
                  Factu.descuento = value;
                  setDescuentoString(
                    "Porcentaje: " +
                      parseFloat((value * 100) / totalFactura).toFixed(2) +
                      "%"
                  );
                  const newTotal = totalFactura - value; // Calculate the new total value
                  form.setFieldsValue({ total: newTotal }); // Update the value of the total field in the form
                }}
              />
            </Form.Item>

            <Divider />
            <Form.Item name="total" label="Total:">
              <InputNumber
                style={{ width: "100%" }}
                type="number"
                prefix="$"
                disabled
                maxLength={6}
                placeholder="Total"
              />
            </Form.Item>
          </div>
          <ButtonSubmit ActionProv={ActionsProvider} isLoading={isLoading} />
        </Form>
      </Layout>
    </div>
  );
}
