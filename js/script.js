//Si el localStorage tiene datos, se lo parsea y se lo almacena en el array de carrito, sino se declara como array vacio.-
let carrito = localStorage.getItem("productos") ? JSON.parse(localStorage.getItem("productos")) : [];
const stock = [];
const productos = [];

//Selectores jQuery
let listaProductos = $("#listaProductos"); //div que contiene a los elementos agregados al carrito!
let modalContainer = $(".modal-container"); //Modal del carrito
let productosCarrito = $(".productos-carrito"); //Dentro de este div se almacenan los productos.-
let menu = $(".menu");
let ul = $(".menu ul");
let carritoContador = $(".carritoContador");
const body = $("body").children();
const carritoContainer = $(".modal-carrito");
let finalCompra = $(".btn-outline-primary");



//fetch para traer productos del archivo json.-

fetch('data/stock.json')
.then(response => response.json())
.then(data => {
    for(const obj of data) {
        productos.push(obj);
        const seccionCarrito = $("#seccion-productos"); //div contenedir de los productos listados en pantalla
        seccionCarrito.append(`
        <div class="card my-2 card-set" style="width: 15rem;">
            <div class="img-container"><img src="${obj.img}" class="card-img-top" alt="${obj.nombre}"></div>
            <div class="card-body">
                <h5 class="card-title">${obj.nombre}</h5>
                <p class="card-text">$ ${Intl.NumberFormat('de-DE').format(obj.precio)}</p>
                <a id="${obj.id}" class="btn btn-primary">Agregar Al Carrito</a>
            </div>
        </div>
    `);
    }
    $(".btn-primary").on("click", agregarCarrito);
})

let popup = $("#popUpContainer");
const popUP = () => {
    popup.animate({
        top: 110
    },300)
    .delay(1200)
    popup.animate({
        top: -100
    },100)
}

////////////////////////////////////////
//------------Funciones---------------//
////////////////////////////////////////

//agregar al carrito.-
const agregarCarrito = (e) => {
    prod = productos.find(obj => obj.id == e.target.id);
    for (p of carrito) {
        if (p.id == e.target.id) {
            p.cantidad++;
            localStorage.setItem("productos", JSON.stringify(carrito));
            pintarCarrito(carrito);
            valorTotal();
            popUP();
            return
        }
    }
    carrito.push(prod);
    localStorage.setItem("productos", JSON.stringify(carrito));
    pintarCarrito(carrito);
    valorTotal();
    popUP();
}

//pinta el carrito cuando se agrega un elemento.-
const pintarCarrito = (array) => {
    productosCarrito.html("")
    array.forEach(obj => {
        productosCarrito.append(`
            <div class="carrito-producto">
                <img src="${obj.img}" alt="${obj.nombre}">
                <p>${obj.nombre}</p>
                <p class="badge rounded-pill bg-success bg-price">$ ${Intl.NumberFormat('de-DE').format(obj.precio)}</p>
                <p class="badge rounded-pill bg-dark">${obj.cantidad}</p>
                <div>
                    <button id="${obj.id}" class="btn btn-secondary sumarProd">+</button>
                    <button id="${obj.id}" class="btn btn-secondary restarProd">-</button>
                </div>
                <button id="${obj.id}" class="btn btn-danger eliminarProd">X</button>
            </div>
        `);
    })
    localStorage.setItem("productos", JSON.stringify(array));
    valorTotal();

    if (carrito.length === 0) {
        carritoContador.css("display", "none")
        finalCompra.attr('disabled', true)
    } else {
        carritoContador.css("display", "block")
        finalCompra.attr('disabled', false)
    }

    if (productosCarrito.html() == "") {
        productosCarrito.html(`
        <div class="productos-carrito">
            <p class="text-center mt-2 mb-0">El carrito está vacio.</p>
            <i class="fal fa-frown mb-2"></i>
        </div>
        `);
    }

    //Selecciono los botones y le aplico el evento con metodo jQuery
    let sumarProd = $(".sumarProd");
    sumarProd.on("click", sumarProducto)
    let restarProd = $(".restarProd");
    restarProd.on("click", restarProducto)
    let eliminarProd = $(".eliminarProd");
    eliminarProd.on("click", eliminarProducto)

    
    
    $("#carritoContador").text(carrito.length)
}



//mi funcion que recorre el carrito y va actualizando el precio por pantalla cuando hay una accion
const valorTotal = () => {
    let precio = 0;
    let total = 0;
    carrito.forEach(obj => {
        precio += obj.precio * obj.cantidad
    });
    total += precio;
    let valor = document.getElementById("valorTotal");
    valor.innerHTML = `$ ${Intl.NumberFormat('de-DE').format(total)}`
    return Intl.NumberFormat('de-DE').format(total); //Agrego un metodo NumberFormat para formatear precio.-
}

//sumar y restar preductos son las funciones que manejan mis botones de [+] y [-]
const sumarProducto = (e) => {
    e.stopPropagation()
    let producto = carrito.find(obj => obj.id == e.target.id)
    producto.cantidad++;
    pintarCarrito(carrito)
    valorTotal();
}

const restarProducto = (e) => {
    e.stopPropagation()
    let producto = carrito.find(obj => obj.id == e.target.id)
    if (producto.cantidad > 1) {
        producto.cantidad--;
        pintarCarrito(carrito)
        valorTotal();
    }
}

//La funcion de eliminar producto cuando se preciona el boton rojo en el carrito!
const eliminarProducto = (e) => {
    let productoEliminar = carrito.indexOf(carrito.find(obj => obj.id == e.target.id));
    carrito.splice(productoEliminar, 1);
    pintarCarrito(carrito);
    valorTotal();
    return
}

//Funcion confirmar compra!
function confirmarCompra() {
    carrito.splice(0, carrito.length);
    localStorage.setItem("productos", "");
    pintarCarrito(carrito);
}

//Aca llamo a pintar carrito y le paso por parametro 'carrito' si tiene algo el localStorage lo parsea y lo recupera.-
pintarCarrito(carrito);

//utilizo el selector de jQuery para todos los botones "agregar al carrito" y le aplico un evento click:
$(".btn-primary").on("click", agregarCarrito);


//Eventos de botones para abrir y cerrar el carrito!
$("#carritoBtn").on("click", () => {
    modalContainer.toggleClass("visible");
    carritoContainer.toggleClass("carritoVisible")
    for(obj of body) {
        if (obj != body[5]) {
            $(obj).css({"filter": "blur(6px)"});
        }
    }
})
$("#cerrar").on("click", () => {
    modalContainer.toggleClass("visible")
    carritoContainer.toggleClass("carritoVisible")
    for(obj of body) {
        if (obj != body[5]) {
            $(obj).css({"filter": "blur(0)"});
        }
    }
})

$(".modal-carrito").on("click", (e)=>{
    e.stopPropagation();
})
$(".modal-container").on("click", ()=> {
    // $("#cerrar").click();
    modalContainer.toggleClass("visible")
    carritoContainer.toggleClass("carritoVisible")
    for(obj of body) {
        if (obj != body[5]) {
            $(obj).css({"filter": "blur(0)"});
        }
    }
});

//Para abrir el menu hamburguesa cuando se alcanza el ancho maximo de 760px
$("#toggleMenu").on("click", ()=>{
    menu.slideDown().toggleClass("abrirMenu");
})

//Funcion para mercadopago
const pagarMP = async () => {
    const comprarProductos = carrito.map( obj => {
        return {
            "title": obj.nombre,
            "description": "",
            "picture_url": obj.img,
            "category_id": obj.id,
            "quantity": obj.cantidad,
            "currency_id": "ARS",
            "unit_price": obj.precio
        }
    })
//fetch metodo post para enviar al Api de MP
    const res = await fetch("https://api.mercadopago.com/checkout/preferences", {
        method: "POST",
        headers: {
            Authorization: "Bearer TEST-7946711842843103-120415-3e2c44932e82950098bc2868cc59aa78-229705873"
        },
        body: JSON.stringify({
            items: comprarProductos,
            back_urls: {
                success: 'http://127.0.0.1:5500/procesado/close.html'
            }
        })
    })
    const data = await res.json()
    console.log(data.init_point)
    window.open(data.init_point, "target='popup'", "width=1900,height=1000px")
    confirmarCompra()
    
}

finalCompra.click(()=> {
    console.log("testing del boton de mercado pago")
    pagarMP()
})

//Agrego el evento del formulario del mail con api de formspree
$("form").on("submit", enviarMail)

async function enviarMail(e){
    e.preventDefault();
    const formu = new FormData(this)

    const res = await fetch("https://formspree.io/f/xyyogrgl", {
        method: "POST",
        body: formu,
        headers: {
            'Accept': 'application/json'
        }
    })
    if(res.ok) {
        this.reset()
        console.log("test de envio si respuesta de fetch es ok")
        mailSucces()
    }
    
}
//Funcion con Sweetalert
function mailSucces(){
    Swal.fire(
        'Mensaje enviado!',
        '¡Gracias! En breve te contestaremos!',
        'success'
    )
}