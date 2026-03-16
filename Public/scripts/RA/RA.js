document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM cargado, esperando marcadores...");
    
    const marker = document.querySelector("#markerMexico");
    
    if (!marker) {
        console.error("❌ No se encontró el marker con id 'markerMexico'");
        return;
    }

    // Verificar si el pattern existe
    fetch('/Public/makers/pattern-Mexico.patt')
        .then(response => {
            if (response.ok) {
                console.log("✅ Archivo pattern encontrado");
                return response.text();
            } else {
                console.error("❌ Archivo pattern no encontrado:", response.status);
            }
        })
        .then(text => {
            if (text) {
                console.log("Contenido del pattern (primeras líneas):", text.substring(0, 100));
            }
        })
        .catch(error => {
            console.error("Error al cargar pattern:", error);
        });

    // Verificar si el modelo existe
    fetch('/Public/models/pose-t.glb', { method: 'HEAD' })
        .then(response => {
            if (response.ok) {
                console.log("✅ Modelo GLB encontrado");
            } else {
                console.error("❌ Modelo GLB no encontrado:", response.status);
            }
        })
        .catch(error => {
            console.error("Error al verificar modelo:", error);
        });

    // Eventos del marcador
    marker.addEventListener("markerFound", (event) => {
        console.log("✅ ¡Marcador México detectado!", event);
        document.body.style.backgroundColor = "green";
    });

    marker.addEventListener("markerLost", (event) => {
        console.log("❌ Marcador perdido", event);
        document.body.style.backgroundColor = "white";
    });

    // Escuchar eventos en la escena
    const scene = document.querySelector("a-scene");
    if (scene) {
        scene.addEventListener("markerFound", (event) => {
            console.log("Evento markerFound en escena:", event);
        });
        
        scene.addEventListener("markerLost", (event) => {
            console.log("Evento markerLost en escena:", event);
        });
        
        scene.addEventListener("loaded", () => {
            console.log("✅ Escena AR cargada y lista");
        });
        
        // Verificar estado de AR
        scene.addEventListener("camera-init", (event) => {
            console.log("Cámara inicializada:", event);
        });
    }
    
    // Monitorear detección continua
    let detectionInterval = setInterval(() => {
        if (marker.object3D.visible) {
            console.log("Marker visible:", marker.object3D.visible);
        }
    }, 1000);
    
    console.log("Sistema AR inicializado");
});