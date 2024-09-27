let añadir = document.getElementById('Añadir');
let modificar = document.getElementById('Modificar');
let eliminar = document.getElementById('Eliminar');
let modalAñadir = document.getElementById('dialog--1')
let button = document.getElementById('submit')
let eliminarProducto = document.getElementById('dialog--2')
let buttonEliminar = document.getElementById('delete')
let modificarproducto = document.getElementById('dialog--3')
let buttonModificar = document.getElementById('modified')

añadir.addEventListener('click',()=>{
    modalAñadir.showModal();
})
button.addEventListener('click',()=>{
    modalAñadir.querySelector('form').addEventListener('submit', async(e)=>{
        e.preventDefault()
        console.log(modalAñadir.querySelector('form').elements)

        const nombre = document.getElementById('NombreProducto').value
        const descripcion = modalAñadir.querySelector('form').querySelector('select').value
        const litros = document.querySelector('#Litros').value
        
        try {
            const response = await fetch('/inventario/create', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            })
            const data = await response.json()
            location.href = data.ruta
        } catch (error) {
            console.log(error)
        }
    })
})
eliminar.addEventListener('click',()=>{
    eliminarProducto.showModal();
})
buttonEliminar.addEventListener('click',()=>{
    eliminarProducto.close();
})

modificar.addEventListener('click',()=>{
    modificarproducto.showModal();
})
buttonModificar.addEventListener('click',()=>{
    modificarproducto.close();
})