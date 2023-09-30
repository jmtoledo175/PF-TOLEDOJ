document.addEventListener("DOMContentLoaded", () => {
  const enviar = document.getElementById("Enviar");
  const miFormulario = document.getElementById("miFormulario");
  enviar.addEventListener("mousedown", () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Tu mensaje fue enviado con éxito",
      showConfirmButton: false,
      timer: 3500,
    });
    miFormulario.reset();
  });
});
