document.querySelector('#Dolar').oninput = async () => {
    const response = await fetch("https://ve.dolarapi.com/v1/dolares/oficial")
    const data = await response.json()
    let dolar = data.promedio
    document.querySelector('#Bolivares').value = (dolar * document.querySelector('#Dolar').value).toFixed(2)
}

document.querySelector('#Bolivares').oninput = async () => {

    const response = await fetch("https://ve.dolarapi.com/v1/dolares/oficial")
    const data = await response.json()
    let dolar = data.promedio

    document.querySelector('#Dolar').value = (document.querySelector('#Bolivares').value / dolar).toFixed(2)
}