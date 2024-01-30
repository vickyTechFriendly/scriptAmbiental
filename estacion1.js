process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
require('dotenv').config();
const axios = require ('axios');

async function fetchData(sensorId) {
const fechaActual = new Date();
const fechaAnterior = 75 * 60 * 1000;
const fecha = new Date(fechaActual.getTime() - fechaAnterior);

  const inicio = fecha.toISOString().slice(0, 16);
  const fin = new Date().toISOString().slice(0, 16);
  const authorization = process.env.token;

  const url = `https://airadvanced.net/airadvanced/validacion/datos/${sensorId}/${inicio}/${fin}`;
  //console.log("la URL", url);

  try {
    const response = await axios.get(url, {
      headers: {
        'Authorization': authorization
      }
    });

    const data = response.data;
    if (data.length > 0) {
      const lastItem = data[data.length - 1];
      const lectura = lastItem.lectura;
      //console.log("de esta lectura",lectura);
      return lectura;
    } else {
      console.log("No hay datos");
      return null;
    }
  } catch (error) { 
    if (error.response) {
      console.error("Error en la respuesta de la API:", error.response.data);
    } else if (error.request) {
      console.log("Error en la petición:", error.request);
    } else {
      console.error("Error al realizar la petición:", error.message);
    }
    throw error;
  }
}

async function getHumedad() {
  return fetchData("2621");
}

async function getTemperatura() {
  return fetchData("2496");
}

async function getPresion() {
    return fetchData("2622");
}

async function getParticulasPM1() {
    return fetchData("2626");
}

async function getRuido() {
    return fetchData("2628");
}

async function getNO() {
    return fetchData("2615");
}

async function getCO() {
    return fetchData("2616");
}

async function getO3() {
    return fetchData("2617");
}

async function getNO2() {
    return fetchData("2619");
}

async function getPM25() {
    return fetchData("2623");
}

async function getVV() {
    return fetchData("2624");
}

async function getDD() {
    return fetchData("2625");
}

async function getPM10() {
    return fetchData("2627");
}

async function getSO2() {
    return fetchData("2618");
}

async function getICA() {
    return fetchData("2781");
}

const plataforma = "smart.albacete.es";
const accessToken = process.env.estacion1;

  async function sendTelemetry() {
    try { 
        const dataHumedad = await getHumedad();
        const dataTemperatura = await getTemperatura();
        const dataPresion = await getPresion();
        const dataParticulasPM1 = await getParticulasPM1();
        const dataRuido = await getRuido();
        const dataNO = await getNO();
        const dataCO = await getCO();
        const dataO3 = await getO3();
        const dataNO2 = await getNO2();
        const dataPM25 = await getPM25();
        const dataVV = await getVV();
        const dataDD = await getDD();
        const dataPM10 = await getPM10();
        const dataSO2 = await getSO2();
        const dataICA = await getICA();

        let telemetryData = {};
        
        if (dataHumedad && dataHumedad.length > 0) {
            telemetryData.HR = dataHumedad[0].valor;
        }  
        if (dataTemperatura && dataTemperatura.length > 0) {
            telemetryData.TMP = dataTemperatura[0].valor;
        }
        if (dataPresion && dataPresion.length > 0) {
            telemetryData.PRB = dataPresion[0].valor;
        }
        if (dataParticulasPM1 && dataParticulasPM1.length > 0) {
            telemetryData.PM1 = dataParticulasPM1[0].valor;
        }
        if (dataRuido && dataRuido.length > 0) {
            telemetryData.R = dataRuido[0].valor;
        }
        if (dataNO && dataNO.length > 0) {
            telemetryData.NO = dataNO[0].valor;
        }
        if (dataCO && dataCO.length > 0) {
            telemetryData.CO = dataCO[0].valor;
        }
        if (dataO3 && dataO3.length > 0) {
            telemetryData.O3 = dataO3[0].valor;
        }
        if (dataNO2 && dataNO2.length > 0) {
            telemetryData.NO2 = dataNO2[0].valor;
        }
        if (dataPM25 && dataPM25.length > 0) {
            telemetryData.PM25 = dataPM25[0].valor;
        }
        if (dataVV && dataVV.length > 0) {
            telemetryData.VV = dataVV[0].valor;
        }
        if (dataDD && dataDD.length > 0) {
            telemetryData.DD = dataDD[0].valor;
        }
        if (dataPM10 && dataPM10.length > 0) {
            telemetryData.PM10 = dataPM10[0].valor;
        }
        if (dataSO2 && dataSO2.length > 0) {
            telemetryData.SO2 = dataSO2[0].valor;
        }
        if (dataICA && dataICA.length > 0) {
            telemetryData.ICA = dataICA[0].valor;
        }

        if(Object.keys(telemetryData).length === 0) {
            console.log("No hay datos diponibles para la estación 1.");
            return;
        }
                
        //console.log("Datos ambientales estacion 1: ", telemetryData);

        await axios.post(`https://${plataforma}/api/v1/${accessToken}/telemetry`, telemetryData,{
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            console.log("Datos enviados estación 1:", telemetryData);

    } catch (error) {
        if (error.response) {
            console.error("Error en la respuesta del sendTelemetryData:", error.response.data);
        } else if (error.request) {
            console.log ("Error en la petición:", error.request);
        } else {
            console.error("Error al realizar la petición:", error.message);
        }
        throw error;
}
}

sendTelemetry()
setInterval(sendTelemetry, 300000);