class producto {
  constructor(id, nombre, precio, descripcion, img, cantidad) {
    this.id = id;
    this.nombre = nombre;
    this.precio = precio;
    this.descripcion = descripcion;
    this.cantidad = cantidad;
    this.img = img;
  }

  aumentarCantidad() {
    this.cantidad++;
  }

  disminuirCantidad() {
    if (this.cantidad > 1) {
      this.cantidad--;
    }
  }
}
class carrito {
  constructor() {
    this.listaCarrito = [];
  }

  agregar(producto) {
    const productoEnCarrito = this.listaCarrito.find(
      (item) => item.producto.id === producto.id
    );

    if (productoEnCarrito) {
      productoEnCarrito.cantidad++;
    } else {
      this.listaCarrito.push({ producto, cantidad: 1 });
    }
    this.mostrar();
  }
  guardarStorage() {
    let listacarritoJSON = JSON.stringify(this.listaCarrito);
    localStorage.setItem("listaCarrito", listacarritoJSON);
  }
  recuperarStorage() {
    let listaCarritoJS = JSON.parse(localStorage.getItem("listaCarrito"));
    if (listaCarritoJS.length > 0) {
      this.listaCarrito = listaCarritoJS;
    }
  }

  mostrar() {
    const contenedor_carrito = document.getElementById("contenedor_carrito");
    contenedor_carrito.innerHTML = "";
    this.listaCarrito.forEach((item) => {
      const producto = item.producto;
      const cantidad = item.cantidad;
      contenedor_carrito.innerHTML += `
  <div class="card mb-3" style="max-width: 540px">
    <div class="row g-0">
      <div class="col-md-4">
        <img src="${producto.img}" class="img-fluid rounded-start" alt="..." />
      </div>
      <div class="col-md-8">
        <div class="card-body">
          <h5 class="card-title">${producto.nombre}</h5>
          <p class="card-text">Cantidad: 
            <button class="btn btn-primary" id="plus-${producto.id}"><i class="fa-sharp fa-solid fa-plus" style="color: #FFFFF;"></i></button>
            ${cantidad}
            <button class="btn btn-primary" id="minus-${producto.id}"><i class="fa-solid fa-minus" style="color: #FFFFF;"></i></button>
          </p>
          <p class="card-text">Precio unitario: $${producto.precio}</p>
         
          <button class="btn btn-danger" id="ep-${producto.id}" data-product-id="${producto.id}">
            <i class="fa-sharp fa-solid fa-trash" style="color: #FFFFF"></i>
          </button>
          
        </div>
      </div>
    </div>
  </div>`;
    });
    this.actualizarTotal();
    this.registrarEventosBotones();
  }
  eliminarProducto(productId) {
    this.listaCarrito = this.listaCarrito.filter(
      (item) => item.producto.id !== productId
    );
    this.guardarStorage();
    this.mostrar();
  }

  limpiarCarrito() {
    this.listaCarrito = [];
  }

  finalizarCompra() {
    const btn_comprar = document.getElementById("Comprar");
    btn_comprar.addEventListener("click", () => {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Tu compra fue realizada con éxito",
        showConfirmButton: false,
        timer: 3500,
      });

      // Limpia el carrito y el almacenamiento local
      this.limpiarCarrito();
      this.guardarStorage();
      // Limpia el contenido del carrito en el HTML
      const contenedor_carrito = document.getElementById("contenedor_carrito");
      contenedor_carrito.innerHTML = "";
      // Actualiza el total y muestra el carrito vacío
      this.actualizarTotal();
    });
  }

  calcularTotal() {
    return this.listaCarrito.reduce(
      (total, producto) => total + producto.producto.precio * producto.cantidad,
      0
    );
  }

  actualizarTotal() {
    const precio_total = document.getElementById("Total");
    precio_total.innerText = `Precio total: $${this.calcularTotal()}`;
  }
  registrarEventosBotones() {
    this.listaCarrito.forEach((item) => {
      const producto = item.producto;
      const plusBtn = document.getElementById(`plus-${producto.id}`);
      const minusBtn = document.getElementById(`minus-${producto.id}`);
      plusBtn.addEventListener("click", () => {
        item.cantidad++;
        this.guardarStorage();
        this.mostrar();
      });

      minusBtn.addEventListener("click", () => {
        item.cantidad--;
        this.guardarStorage();
        this.mostrar();
      });

      const deleteBtn = document.getElementById(`ep-${producto.id}`);
      deleteBtn.addEventListener("click", () => {
        const productoId = producto.id;
        Carrito.eliminarProducto(productoId);
        Carrito.mostrar();
      });

      const eliminarCarrito = document.getElementById("btn-ec");
      eliminarCarrito.addEventListener("click", () => {
        Swal.fire({
          title: "¿Estas seguro de que quieres eliminar tu carrito?",
          showDenyButton: true,
          showCancelButton: true,
          confirmButtonText: "Confirmar",
          denyButtonText: `Cancelar`,
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.fire("Carrito eliminado", "", "success");
            // Limpia el carrito y el almacenamiento local
            this.limpiarCarrito();
            this.guardarStorage();
            // Limpia el contenido del carrito en el HTML
            const contenedor_carrito =
              document.getElementById("contenedor_carrito");
            contenedor_carrito.innerHTML = "";
            // Actualiza el total y muestra el carrito vacío
            this.actualizarTotal();
          } else if (result.isDenied) {
            Swal.fire("Cambios no ejecutados", "", "info");
          }
        });
      });
    });
  }
}

class agregarProductos {
  constructor() {
    this.listaDeProductos = [];
  }

  eventoFiltro() {
    const precioMinimoInput = document.getElementById("precioMin");
    const precioMaximoInput = document.getElementById("precioMax");
    let minPrecio = 0;
    let maxPrecio = Infinity;

    precioMinimoInput.addEventListener("change", () => {
      if (precioMinimoInput.value > 0) {
        minPrecio = precioMinimoInput.value;
        this.filtrarPorPrecio(minPrecio, maxPrecio);
        this.mostrar();
      }
    });

    precioMaximoInput.addEventListener("change", () => {
      maxPrecio = precioMaximoInput.value;
      this.filtrarPorPrecio(minPrecio, maxPrecio);
      this.mostrar();
    });
  }
  filtrarPorPrecio(min, max) {
    this.listaDeProductos = this.listaDeProductos.filter(
      (producto) => min <= producto.precio && producto.precio <= max
    );
  }

  agregar(producto) {
    this.listaDeProductos.push(producto);
  }

  mostrar() {
    const contenedor_productos = document.getElementById(
      "contenedor_productos"
    );
    contenedor_productos.innerHTML = '<div class="row"></div>';
    const row = contenedor_productos.querySelector(".row");
    this.listaDeProductos.forEach((producto) => {
      row.innerHTML += `
        <div class="col-md-2 mb-3">
          <div class="card">
            <img src="${producto.img}" class="card-img-top" alt="...">
            <div class="card-body">
              <h5 class="card-title">${producto.nombre}</h5>
              <p class="card-text">${producto.descripcion}</p>
              <p class="card-text">$${producto.precio}</p>
              <button type="button" class="btn btn-primary" id="ap-${producto.id}">Añadir al carrito</button>
            </div>
          </div>
        </div>`;
    });

    this.listaDeProductos.forEach((producto) => {
      const btn_ap = document.getElementById(`ap-${producto.id}`);
      btn_ap.addEventListener("click", () => {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Producto agregado",
          showConfirmButton: false,
          timer: 2500,
        });
        Carrito.agregar(producto);
        Carrito.guardarStorage();
        Carrito.mostrar();
      });
    });
  }

  buscar(id) {
    return this.listaDeProductos.find((producto) => producto.id === id);
  }
}

const p1 = new producto(
  1,
  "Malbec",
  1100,
  "Sabores frescos de grosella y cereza negra con taninos dulces y redondos terminando con un largo final de notas vanela y clavo de olor",
  "https://www.espaciovino.com.ar/media/default/0001/59/thumb_58921_default_big.jpeg"
);
const p2 = new producto(
  2,
  "Portillo Cabernet Sauvignon",
  1500,
  "Posee aromas que combinan frutos rojos con pimiento rojo y notas de pimienta negra.",
  "https://www.espaciovino.com.ar/media/default/0001/59/thumb_58919_default_big.jpeg"
);
const p3 = new producto(
  3,
  "Portillo Chardonnay",
  1550,
  "En nariz presenta aromas delicados que recuerdan a frutas como la manzana y la banana con notas minerales. ",
  "https://www.espaciovino.com.ar/media/default/0001/59/thumb_58920_default_big.jpeg"
);
const p4 = new producto(
  4,
  "Portillo Merlot",
  1300,
  "En boca la fruta es concentrada, con taninos suaves y un final prolongado. Joven y frutado.",
  "https://www.espaciovino.com.ar/media/default/0001/59/thumb_58922_default_big.jpeg"
);
const p5 = new producto(
  5,
  "Portillo Tempranillo",
  1522,
  "En boca se presenta fresco y frutado, con taninos dulces y buena concentración.",
  "https://www.espaciovino.com.ar/media/default/0001/59/thumb_58925_default_big.jpeg"
);
const p6 = new producto(
  6,
  "Portillo Syrah",
  1522,
  "En boca es un vino de entrada suave, donde se perciben frutas con buena intensidad, una sutil nota especiada y sobre el final de boca una sensación dulce aportada por sus taninos.",
  "https://www.espaciovino.com.ar/media/default/0001/59/thumb_58926_default_big.jpeg"
);
const p7 = new producto(
  7,
  "Cordero con Piel de Lobo Malbec",
  2850,
  "Con una acidez justa deja en boca un picor agradable con un final reforzado por su paso por madera.",
  "https://www.espaciovino.com.ar/media/default/0001/61/thumb_60952_default_big.jpeg"
);
const p8 = new producto(
  8,
  "Prófugo Especias Cabernet Sauvignon",
  2113,
  " En boca tiene una entrada amable y acaramelada. Especialmente pensado para amantes de vinos especiados.",
  "https://www.espaciovino.com.ar/media/default/0001/67/thumb_66449_default_big.jpeg"
);
const p9 = new producto(
  9,
  "Callejón del Crimen Gran Reserva Malbec",
  6600,
  "En boca se destacan ciruelas maduras y una muy buena acidez con un toque de pasas y taninos dulces, redondos. Vino sobresaliente.",
  "https://www.espaciovino.com.ar/media/default/0001/59/thumb_58380_default_big.jpeg"
);
const p10 = new producto(
  10,
  "Prófugo Frutos Rojos Malbec",
  1270,
  "Presenta un color rojo violáceo, de mediana intensidad. En nariz destacan sus notas de vainilla y ciruelas. En boca tiene una entrada amable con sensación de dulzor, muy afrutado.",
  "https://www.espaciovino.com.ar/media/default/0001/67/thumb_66448_default_big.jpeg"
);
const p11 = new producto(
  11,
  "Callejón del Crimen Gran Reserva Cabernet Sauvignon",
  6600,
  "En boca es un vino de gran estructura con sabor a cassis y frutos.",
  "https://www.espaciovino.com.ar/media/default/0001/59/thumb_58379_default_big.jpeg"
);
const p12 = new producto(
  12,
  "Crux Malbec",
  2838,
  "En boca se perciben notas a frutos rojos, sutileza ahumada y mineralidad. Persistencia media.",
  "https://www.espaciovino.com.ar/media/default/0001/64/thumb_63545_default_big.jpeg"
);

const CP = new agregarProductos();
const Carrito = new carrito();

CP.agregar(p1);
CP.agregar(p2);
CP.agregar(p3);
CP.agregar(p4);
CP.agregar(p5);
CP.agregar(p6);
CP.agregar(p7);
CP.agregar(p8);
CP.agregar(p9);
CP.agregar(p10);
CP.agregar(p11);
CP.agregar(p12);

CP.eventoFiltro();
CP.mostrar();
Carrito.recuperarStorage();
Carrito.mostrar();
Carrito.registrarEventosBotones();
Carrito.finalizarCompra();
