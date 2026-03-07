async function actualizarMesa(id, nuevoEstado) {
    // Deshabilitar el botón temporalmente para evitar doble clic
    try {
        const respuesta = await fetch('backend/api.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                id: id,
                nuevoEstado: nuevoEstado
            })
        });

        // Verificamos que el servidor respondió con un código 200 OK
        if (!respuesta.ok) {
            throw new Error(`Error de red: ${respuesta.status}`);
        }

        const data = await respuesta.json();

        if (data.success) {
            // Recargamos la página para que PHP pinte los nuevos colores
            window.location.reload();
        } else {
            alert("Atención: " + data.message);
        }
    } catch (error) {
        console.error("Error en la petición Fetch:", error);
        alert("Ocurrió un error al comunicarse con el servidor.");
    }
}