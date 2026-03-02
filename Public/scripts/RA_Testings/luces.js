import * as three from 'three';

export function crearLuces(scene) {
    
    const ambient = new three.AmbientLight(0xffffff, 0.7);
    scene.add(ambient);
    
    const dirLight = new three.DirectionalLight(0xffffff, 8);
    dirLight.position.set(13, 13, 13);
    // const dlhelper = new three.DirectionalLightHelper(dirLight, 0.5);
    // scene.add(dlhelper);       
    scene.add(dirLight);

  
}

// Añadir funcion para hacer rotar la dl en el origen
export function rotateDL(dirLight, dlhelper) {
    const time = Date.now() * 0.0005;
    const radius = 13;
    dirLight.position.x = Math.cos(time) * radius;
    dirLight.position.z = Math.sin(time) * radius;
    dirLight.lookAt(0, 0, 0);
    dirLight.updateMatrixWorld();
    dlhelper.update();
}
