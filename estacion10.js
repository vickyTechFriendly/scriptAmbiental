process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
require('dotenv').config();
const axios = require ('axios');

const fechaActual = new Date();
const fechaAnterior = 60 * 60 * 1000;
const fecha = new Date(fechaActual.getTime() - fechaAnterior);

async function fetchData(sensorId) {
  const inicio = fecha.toISOString().slice(0, 16);
  const fin = new Date().toISOString().slice(0, 16);
  const authorization = process.env.token;

  const url = `https://airadvanced.net/airadvanced/validacion/datos/${sensorId}/${inicio}/${fin}`;
  console.log(url);

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
  return fetchData("2649");
}

async function getPresion() {
    return fetchData("2650");
}

async function getParticulasPM1() {
    return fetchData("2654");
}

async function getRuido() {
    return fetchData("2656");
}

async function getNO() {
    return fetchData("2643");
}

async function getCO() {
    return fetchData("2644");
}

async function getO3() {
    return fetchData("2645");
}

async function getSO2() {
    return fetchData("2646");
}

async function getNO2() {
    return fetchData("2647");
}

async function getTemperatura() {
    return fetchData("2648");
  }

async function getPM25() {
    return fetchData("2651");
}

async function getVV() {
    return fetchData("2652");
}

async function getDD() {
    return fetchData("2653");
}

async function getPM10() {
    return fetchData("2655");
}

async function getICA() {
    return fetchData("2783");
}

const plataforma = "smart.albacete.es";
const accessToken = process.env.estacion10;
let HR;
let TMP;
let PRB;
let PM1;
let R;
let NO;
let CO;
let O3;
let NO2;
let PM25;
let VV;
let PM10;
let SO2;
let ICA;

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
        

        if (dataHumedad && dataHumedad.length > 0) {
            HR = dataHumedad[0].valor;
        } else {
            console.log("No hay datos de HR disponibles.");
            return; 
        }
        if (dataTemperatura && dataTemperatura.length > 0) {
            TMP = dataTemperatura[0].valor;
        } else {
            console.log("No hay datos de temperatura disponibles.");
            return; 
        }
        if (dataPresion && dataPresion.length > 0) {
            PRB = dataPresion[0].valor;
        } else {
            console.log("No hay datos de presión disponibles.");
            return; 
        }
        if (dataParticulasPM1 && dataParticulasPM1.length > 0) {
            PM1 = dataParticulasPM1[0].valor;
        } else {
            console.log("No hay datos de particulas PM1 disponibles.");
            return; 
        }
        if (dataRuido && dataRuido.length > 0) {
            R = dataRuido[0].valor;
        } else {
            console.log("No hay datos de ruido disponibles.");
            return; 
        }
        if (dataNO && dataNO.length > 0) {
            NO = dataNO[0].valor;
        }else {
            console.log("No hay datos de NO disponibles.");
            return; 
        }
        if (dataCO && dataCO.length > 0) {
            CO = dataCO[0].valor;
        }else {
            console.log("No hay datos de CO disponibles.");
            return;
        }
        if (dataO3 && dataO3.length > 0) {
            O3 = dataO3[0].valor;
        }else {
            console.log("No hay datos de O3 disponibles.");
            return;
        }
        if (dataNO2 && dataNO2.length > 0) {
            NO2 = dataNO2[0].valor;
        }else {
            console.log("No hay datos de NO2 disponibles.");
            return;
        }
        if (dataPM25 && dataPM25.length > 0) {
            PM25 = dataPM25[0].valor;
        }else {
            console.log("No hay datos de PM25 disponibles.");
            return;
        }
        if (dataVV && dataVV.length > 0) {
            VV = dataVV[0].valor;
        }else {
            console.log("No hay datos de VV disponibles.");
            return;
        }
        if (dataDD && dataDD.length > 0) {
            DD = dataDD[0].valor;
        }else {
            console.log("No hay datos de DD disponibles.");
            return;
        }
        if (dataPM10 && dataPM10.length > 0) {
            PM10 = dataPM10[0].valor;
        }else {
            console.log("No hay datos de PM10 disponibles.");
            return;
        }
        if (dataSO2 && dataSO2.length > 0) {
            SO2 = dataSO2[0].valor;
        }else {
            console.log("No hay datos de SO2 disponibles.");
            return;
        }
        if (dataICA && dataICA.length > 0) {
            ICA = dataICA[0].valor;
        }else {
            console.log("No hay datos de ICA disponibles.");
            return;
        }

        const telemetryData = {
            HR,
            TMP,
            PRB,
            PM1,
            R,
            NO,
            CO,
            O3,
            NO2,
            PM25,
            VV,
            DD,
            PM10,
            SO2,
            ICA,
        }
                
        //console.log("Datos de humedad obtenidos de la API: ", telemetryData);

        await axios.post(`https://${plataforma}/api/v1/${accessToken}/telemetry`, telemetryData,{
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
        console.log(`Datos enviados correctamente`);

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

sendTelemetry();