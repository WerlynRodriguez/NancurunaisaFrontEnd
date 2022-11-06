import { message } from "antd";
import { getDateToday } from "./Calwulator";
const url = "http://172.23.173.158:5037/api/"
const endPointGQL = "http://172.23.173.158:5037/graphql/"

function errorHandler(res){
  if (res.errors) {
    message.error(res.errors[0].message);
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
  // const res = await fetch(endPointGQL, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({
  //     query: `
  //     mutation{
  //       authentication(email:"${email}",password:"${password}"){
  //         token {
  //           token
  //         }
  //       }
  //     }
  //     `
  //   })
  // })

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
    ${table}(skip:${page},take:${perPage},where:{${search}},order:{${order}}){
      items{
        ${items}
      }
      totalCount
    }
  }`;
  const res = await fetchGphql(query);
  return res.data[table];
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
  return res.data[table];
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
  return res.data;
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
  return res.data;
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
  if (res.errors) {
    console.log(query);
    message.error(res.errors[0].message);
    return "errors";
  };
  return res.data;
}

export async function UpdateTera(data,id){
  const res = await fetch(url+"Terapia/"+id,{
    method:"PUT",
    headers: {
      Accept: 'application/form-data',
      'Content-Type': 'application/json',
    },body: JSON.stringify(data),
  })
  return res;
}//Authorization: "Bearer "+localStorage.getItem('accessToken')

/*Deleting */
export async function FecthUSDNIORate(){
  const res = await fetch("https://v6.exchangerate-api.com/v6/2b03c3bbce449407cb6d52c1/pair/USD/NIO");
  const result = await res.json();
  localStorage.setItem('convertRate', result.conversion_rate);
  localStorage.setItem('latestRateUpdated', getDateToday());
  return result.conversion_rate;
}