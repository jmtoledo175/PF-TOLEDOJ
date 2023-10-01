class Producto {
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
      if (this.listaCarrito.length > 0) {
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
        const contenedor_carrito =
          document.getElementById("contenedor_carrito");
        contenedor_carrito.innerHTML = "";
        // Actualiza el total y muestra el carrito vacío
        this.actualizarTotal();
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "¡Debes añadir productos para poder finalizar la compra!",
        });
      }
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

  async preparar_contenedor_productos() {
    try {
      let listadeProductosJSON = await fetch("simularAPI.json");
      let listadeProductosJS = await listadeProductosJSON.json();

      listadeProductosJS.forEach((producto) => {
        let nuevoProducto = new Producto(
          producto.id,
          producto.nombre,
          producto.precio,
          producto.descripcion,
          producto.img
        );
        this.agregar(nuevoProducto);
      });

      this.mostrar();
    } catch (error) {
      console.error("Error al obtener y procesar los datos:", error);
    }
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
          title: `${producto.nombre} agregado`,
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

const CP = new agregarProductos();
const Carrito = new carrito();

CP.preparar_contenedor_productos();
CP.eventoFiltro();

Carrito.recuperarStorage();
Carrito.mostrar();
Carrito.registrarEventosBotones();
Carrito.finalizarCompra();
