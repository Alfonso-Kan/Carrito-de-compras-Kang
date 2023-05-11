const cards = document.getElementById('cards')
const items = document.getElementById('items')
const footer = document.getElementById('footer')
const templateCard = document.getElementById('template-card').content//para acceder a los elementos
const templateFooter = document.getElementById('template-footer').content
const templateCarrito = document.getElementById('template-carrito').content
const fragment = document.createDocumentFragment()//el fragment es como una memoria volatil, no genera reflow
let carrito = {}

document.addEventListener('DOMContentLoaded', () => {//La accion se ralia cuando el documento html ha sido completamente cargado y parseado
    fetchData()
    if(localStorage.getItem('carrito')){//Respaldamos el carrito de compras en el LocalStorage cuando se refresque el sitio web
      carrito = JSON.parse(localStorage.getItem('carrito'))
      pintarCarrito()
    }//cuando hacemos le fetch data preguntamos si existe, reemplazamos el carrito y transformamos un texto plano a una colección de objetos
})
cards.addEventListener('click', e => { //e es usado para capturar el elemento que queremos modificar
  addCarrito(e)
})
items.addEventListener('click', e => {
  btnAccion(e)
})

const fetchData = async () => {
    try {
      const res = await fetch('api.json')
      const data = await res.json()
    //   console.log(data)
       pintarCards(data)
    } catch (error) {
        console.log(error)
    }
}

const pintarCards = data => {
  // console.log(data)
   data.forEach(producto => {//utilizamos forEach porque el caarrito está en json
    // console.log(producto)
      templateCard.querySelector('h5').textContent = producto.title
      templateCard.querySelector('p').textContent = producto.precio
      templateCard.querySelector('img').setAttribute('src', producto.thumbnailUrl)
      templateCard.querySelector('.btn-dark').dataset.id = producto.id //Establece el dataId de manera dinamica
    //CLONACION
    const clone = templateCard.cloneNode(true) //Para clonar
    fragment.appendChild(clone)
   })
   cards.appendChild(fragment)
}

const addCarrito = e => {
  // console.log(e.target)
  if (e.target.classList.contains('btn-dark')){
    setCarrito(e.target.parentElement)
  }
  e.stopPropagation()
}

const setCarrito = objeto => {
  //  console.log(objeto)
   const producto = {
    id: objeto.querySelector('.btn-dark').dataset.id,
    title: objeto.querySelector('h5').textContent,
    precio: objeto.querySelector('p').textContent,
    cantidad: 1
   }
    
   if(carrito.hasOwnProperty(producto.id)) {
    producto.cantidad = carrito[producto.id].cantidad + 1
   }

   carrito[producto.id] = {...producto}
   pintarCarrito()
}

const pintarCarrito = () => {
  // console.log(carrito)
  items.innerHTML = ''//Esto limpia el HTML y hace que no se repita un elemento anteriormente seleccionado
  Object.values(carrito).forEach(producto => {
    templateCarrito.querySelector('th').textContent = producto.id
    templateCarrito.querySelectorAll('td')[0].textContent = producto.title
    templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad
    templateCarrito.querySelector('.btn-info').dataset.id = producto.id
    templateCarrito.querySelector('.btn-danger').dataset.id = producto.id
    templateCarrito.querySelector('span').textContent = producto.cantidad * producto.precio

    const clone = templateCarrito.cloneNode(true)
    fragment.appendChild(clone)
  })
  items.appendChild(fragment)

  pintarfooter()

  localStorage.setItem('carrito', JSON.stringify(carrito))//pasa de un string plano y cuanod lo tenemos del local storage queremos recuperar
}

const pintarfooter = () => {
  footer.innerHTML = '' //reiniciar dejar en 0 para que no se sobreescriba la información
  if(Object.keys(carrito).length === 0) {
    footer.innerHTML = `
    <th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>
    `
    return //Si no le ponemos el return sigue haciendo la operación de abajo y en el carrito no se vacia como queremos
  }

  const nCantidad = Object.values(carrito).reduce((acc, {cantidad}) => acc + cantidad, 0)
  const nPrecio = Object.values(carrito).reduce((acc, {cantidad, precio}) => acc + cantidad * precio, 0)
  // console.log(nPrecio)

  templateFooter.querySelectorAll('td')[0].textContent = nCantidad
  templateFooter.querySelector('span').textContent = nPrecio

  const clone = templateFooter.cloneNode(true)
  fragment.appendChild(clone)
  footer.appendChild(fragment)

  const btnVaciar = document.getElementById('vaciar-carrito')
  btnVaciar.addEventListener('click', () => {
    carrito = {}
    pintarCarrito()
  })
}
  const btnAccion = e => {
  //  console.log(e.target)
   //ACCION DE AUMENTAR
   if(e.target.classList.contains('btn-info')){
     console.log(carrito[e.target.dataset.id])
     const producto = carrito[e.target.dataset.id]
     producto.cantidad++
     carrito[e.target.dataset.id] = {...producto}
     pintarCarrito()
   }

   if(e.target.classList.contains('btn-danger')){
      const producto = carrito[e.target.dataset.id]
      producto.cantidad--
     if(producto.cantidad === 0) {
      delete carrito[e.target.dataset.id]
     }
     pintarCarrito()
   }
   e.stopPropagation
  }

//minuto 1:11:42

// INVESTIGAR:
// Element.setAttribute
//ctrl + f para reemplazar palabras
//Object.values
//dataset y target