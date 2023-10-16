process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
require('dotenv').config();
const axios = require ('axios');

const fechaActual = new Date();
const fechaAnterior =  60*60*1000;
const fecha = new Date(fechaActual.getTime() - fechaAnterior); 


async function getDataBySensorId(sensorId) {
    try {
        let inicio = fecha.toISOString().slice(0, 16);
        let fin = new Date().toISOString().slice(0, 16);
        let authorization = process.env.token;

        const url = `https://airadvanced.net/airadvanced/validacion/datos/${sensorId}/${inicio}/${fin}`;
        console.log(url);

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
            console.log(`No hay datos para el sensor con ID ${sensorId}`);
            return null;
        }
    } catch (error) {
        if (error.response) {
            console.error(`Error en la respuesta de la API para el sensor con ID ${sensorId}:`, error.response.data);
        } else if (error.request) {
            console.log(`Error en la petición para el sensor con ID ${sensorId}:`, error.request);
        } else {
            console.error(`Error al realizar la petición para el sensor con ID ${sensorId}:`, error.message);
        }
        throw error;
    }
}

const sensorIds = ["2621", "2622", "2626", "2628", "2615", "2616", "2617", "2619", "2620", "2623", "2624", "2625", "2627", "2618", "2781"];

async function obtenerDatosDeSensores() {
    for (const sensorId of sensorIds) {
        const data = await getDataBySensorId(sensorId);
        if (data) {
            console.log(`Datos del sensor con ID ${sensorId}:`, data);
        }
    }
}

obtenerDatosDeSensores();




/* 
const plataforma = "smart.albacete.es";
const dispositivos = [
    {
      accessToken: process.env.estacion1,
      humedad: 0,
      temperatura: 0,
    }
  ]; 

  async function sendTelemetry(dispositivo) {
    try { 
        const dataHumedad = await getHumedad();
        const dataTemperatura = await getTemperatura();
        let valorHumedad;
        let valorTemperatura;

        if (dataHumedad && dataHumedad.length > 0) {
            valorHumedad = dataHumedad[0].valor;
        } else {
            console.log("No hay datos de humedad disponibles.");
            return; 
        }
        if (dataTemperatura && dataTemperatura.length > 0) {
            valorTemperatura = dataTemperatura[0].valor;
        } else {
            console.log("No hay datos de temperatura disponibles.");
            return; // Evita continuar con la solicitud
        }



        const telemetryData = {
            humedad: valorHumedad,
            temperatura: valorTemperatura,
        };
                
        //console.log("Datos de humedad obtenidos de la API: ", telemetryData);

        await axios.post(`https://${plataforma}/api/v1/${dispositivo.accessToken}/telemetry`, telemetryData,{
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

dispositivos.forEach(async dispositivo => {
    await sendTelemetry(dispositivo);
}
); */