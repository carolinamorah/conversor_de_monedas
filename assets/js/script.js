const resultado = document.getElementById("monedaConvertida");
const boton = document.querySelector(".btn");


boton.addEventListener("click", () => {
    const pesos = document.getElementById("inputCLP").value;
    const selectMoneda = document.getElementById("tipoMoneda").value;

    if (pesos !== "") {
        getCurrency(pesos, selectMoneda);
    } else {
        alert("Ingrese monto en pesos");
    }
})

// consultar a la API devolver los valores y cargar el gráfico
let lineChart;

async function getCurrency(peso, tipoMoneda){
    try{
        const resp = await fetch(`https://mindicador.cl/api/${tipoMoneda}`);
        const monedas = await resp.json();
        console.log(monedas)

        resultado.innerHTML = `$${(peso / parseFloat(monedas.serie[0].valor)).toFixed(
            4
        ).replaceAll('.', ',')} ${monedas.nombre}`;

        let dias = monedas.serie.map((e) => e.fecha.slice(8, 10));
        console.log(dias);

        let valores = monedas.serie.map((e) => e.valor);
        console.log(valores);


        // obtenemos el elemento del DOM donde irá el gráfico y formateamos mes y año actual
        let myChart = document.getElementById("myChart");
        let mesActual = new Intl.DateTimeFormat('es-ES', { month: 'long'}).format(new Date());
        let currentYear = new Date().getFullYear();
    

        // creamos la configuración del gráfico
        let configuracion = {
            labels: dias.slice(0, 10).reverse(),
            datasets: [
                {
                    data: valores.slice(0, 10).reverse(),
                    label: `Histórico últimos 10 días de ${mesActual} de ${currentYear}`,
                    borderColor: "rgb(75, 192, 192)",
                    fill: {
                        target: 'origin',
                        above: 'rgba(152,205,186,0.36318277310924374)',     
                    },
                }
            ]
        };
        

        if (lineChart) {
            lineChart.destroy();
        }
        
        lineChart = new Chart(myChart, {
            type: "line",
            data: configuracion
        });

    } catch(e) {
        alert(e.message);
    }
}




