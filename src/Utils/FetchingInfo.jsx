import { message } from "antd";
import { getDateToday } from "./Calwulator";
// const url = "http://172.23.173.158:5037/api/"
const url = "http://localhost:5037/api/"
// Maykol 
// const endPointGQL = "http://192.168.1.117:5037/graphql/"
const endPointGQL = "http://localhost:5037/graphql/"
// Werlyn
//const endPointGQL = "http://192.168.1.28:5000/graphql/"

function errorHandler(res){
  if (res.errors) {
    message.error(res.errors[0].message,3);
    console.log(res.errors[0].message);
    return "errors";
  };
  return res;
}

export async function fetchGphql(query){
  const res = await fetch(endPointGQL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: query})
  }).catch((error) => {
    const newError = new Error(error);
    console.log(newError);

    // If the error is a network error
    if(newError.message.split(":")[1] === " Failed to fetch")
      message.error("Error al conectar con el servidor",3);
    else
      message.error(newError.message,3);
    return "errors";
  });

  if(res == "errors") return "errors";

  const json = await res.json();
  return errorHandler(json);
}

/*LOGIN*/
export async function loginUserGQL(email,password) {
  const res = await fetchGphql(`
  mutation{
          authentication(email:"${email}",password:"${password}"){
            token {
              token
            }
          }
        }
  `);

  return res;
};

/*Reportes*/
export async function getReportSucursales(date,type){
  const res = await fetch(url+"Informe?date="+date+"&type="+type);
  const result = await res.json();
  return result;
}

//======================================================================
// Pagination + Search + Filter
//======================================================================
export async function getByPag(table,items,page,perPage,search,order){
  const query = `
  {
    ${table}(skip:${page},take:${perPage},${search?"where:{"+search+"}":""},${order?"order:{"+order+"}":""}){
      items{
        ${items}
      }
      totalCount
    }
  }`;
  const res = await fetchGphql(query);
  return res.data[table];
}

export async function getByPagCitas(items,mes,anio,filters){
  const lastDate = mes == 12 ? (anio+1)+"-01-01" : anio+"-"+(mes+1)+"-01";
  const query = `
  {
    citas(where: {
      fechaHora:{
        gte:"${anio}-${mes}-01"
        lt:"${lastDate}"
      }, ${filters ? filters : ""}
    },order:{fechaHora:ASC}) {
      ${items}
      }
    }
  }
  `;
  const res = await fetchGphql(query);
  if (res == "errors") return "errors";

  //Order Citas by days
  let citasByDay = {};
  let indexDay = "1";

  res.data.citas.forEach(cita => {
    //Cast to Number
    const day = cita.fechaHora.split("T")[0].split("-")[2];
    
    if(indexDay != day){
      indexDay = day;
      citasByDay[`${Number(indexDay)}`] = [];
    }

    citasByDay[`${Number(indexDay)}`].push(cita);
  });

  return citasByDay;
}

//======================================================================
//Get all data from table from ID
//======================================================================
export async function getById(table,idName,id,items){
  const query = `
  {
    ${table}(skip: 0, take: 1, where: {
      ${idName}:{eq:${id}}
    }) {
      items{
        ${items}
      }
    }
  }
  `;
  const res = await fetchGphql(query);
  return res;
}

export async function getByIdCita(idCita,items){
  const query = `
  {
    citas(where: {
      idCita:{eq:${idCita}}
    }) {
      ${items}
    }
  }
  `;
  const res = await fetchGphql(query);
  return res;
}
//======================================================================
//CREATING
//======================================================================
export async function Create(fun,table,vars,items){
  const query = `
  mutation{
    crear${fun}(
      ${table}:{
        ${vars}
      }
    ){
      ${items}
    }
  }`;
  const res = await fetchGphql(query);
  return res;
}
//======================================================================
// UPDATING
//======================================================================
export async function Update(table,inputName,vars,items){
  const query = `
  mutation {
    actualizar${table}(
      ${inputName}: {
        ${vars}
      }
    ) {
      ${items}
    }
  }`;
  const res = await fetchGphql(query);
  return res;
}

//======================================================================
// Change status
//======================================================================
export async function ChangeStatus(table,idName,id,statusName,status,items){
  const query = `
  mutation {
    actualizarEstado${table}(${idName}: ${id}, ${statusName}: ${!status}) {
      ${items}
    }
  }`;
  const res = await fetchGphql(query);
  return res;
}

//======================================================================
// Change citas
//======================================================================
export async function ChangeStatusCita(table,idName,id,statusName,status,items){
  const query = `
  mutation {
    actualizarEstado${table}(${idName}: ${id}, ${statusName}: ${status}) {
      ${items}
    }
  }`;
  const res = await fetchGphql(query);
  return res;
}

/*Deleting */
export async function FecthUSDNIORate(){
  const res = await fetch("https://v6.exchangerate-api.com/v6/2b03c3bbce449407cb6d52c1/pair/USD/NIO");
  const result = await res.json();
  localStorage.setItem('convertRate', result.conversion_rate);
  localStorage.setItem('latestRateUpdated', getDateToday());
  return result.conversion_rate;
}

//======================================================================
// Calculate Factura
//======================================================================

/*Get Total*/
export async function getTotalFactura(idCita) {
  const res = await fetchGphql(`
  {
    totalFactura(idCita: ${idCita})
  } 
  `);

  return res;
};
