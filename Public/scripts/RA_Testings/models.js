import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';

export function cargarModelo(ruta, escena, onLoadCallback) {
    const extension = ruta.split('.').pop().toLowerCase();
    let loader;

    switch (extension) {
        case 'glb':
        case 'gltf':
            loader = new GLTFLoader();
            break;

        case 'fbx':
            loader = new FBXLoader();
            break;

        case 'obj': {
            const basePath = ruta.substring(0, ruta.lastIndexOf('/') + 1);
            
            const fileName = ruta.split('/').pop();

            const mtlLoader = new MTLLoader();
            mtlLoader.setPath(basePath);
            mtlLoader.load(fileName.replace('.obj','.mtl'), (materials) => {
                materials.preload();

                const objLoader = new OBJLoader();
                objLoader.setMaterials(materials);
                objLoader.setPath(basePath);

                objLoader.load(fileName, (obj) => {
                    obj.scale.set(1, 1, 1);
                    obj.position.set(0, 0, 0);
                    escena.add(obj);
                    if (onLoadCallback) onLoadCallback(obj);
                });
            });
            return; // salimos porque ya manejamos el flujo .obj + .mtl
        }
        default:
            console.error('Formato no soportado:', extension);
            return;
    }

    // 🔹 Resto para GLB / FBX (igual que antes)
    loader.load(
        ruta,
        (obj) => {
            const modelo = obj.scene || obj;
            let mixer = null;

            modelo.scale.set(1, 1, 1);
            modelo.position.set(0, 0, 0);
            escena.add(modelo);

            if (obj.animations && obj.animations.length > 0) {
                mixer = new THREE.AnimationMixer(modelo);
                const action = mixer.clipAction(obj.animations[0]);
                action.play();
            }

            if (onLoadCallback) onLoadCallback(modelo, mixer);
        },
        (xhr) => console.log(`Cargando modelo: ${(xhr.loaded / xhr.total) * 100}%`),
        (error) => console.error('Error al cargar el modelo:', error)
    );
}

export function ScaleModel(model,scale){
    model.scale.set(scale,scale,scale);
}

export function RotateModel(model,rotate){
    model.rotation.y = rotate;
}

export function MoveModelInX(model,position){
    model.position.x = position;
}
export function MoveModelInY(model,position){
    model.position.y = position;
}
export function MoveModelInZ(model,position){
    model.position.z = position;
}

// Crear HitBox para el personaje
export function createHitBox(model, type = 'player') {
    // Crear una caja de colisión visible (para debug)
    const hitBoxGeometry = new THREE.BoxGeometry(1.5, 4, 1.5);
    const hitBoxMaterial = new THREE.MeshBasicMaterial({ 
        color: type === 'player' ? 0x00ff00 : 0xff0000,
        wireframe: true,
        visible: true // Cambiar a true para debug
    });
    
    const hitBox = new THREE.Mesh(hitBoxGeometry, hitBoxMaterial);
    hitBox.name = `${type}_hitbox`;
    
    // Ajustar posición para que esté centrada en el personaje
    hitBox.position.y = 2; // Mitad de la altura
    
    // Agregar la hitbox como hijo del modelo
    model.add(hitBox);
    
    // Guardar referencia en userData
    model.userData.hitBox = hitBox;
    model.userData.hitBoxType = type;
    
    return hitBox;
}

// Obtener la hitbox mundial
export function getWorldHitBox(model) {
    if (!model.userData.hitBox) return null;
    
    const hitBox = model.userData.hitBox;
    const worldPosition = new THREE.Vector3();
    const worldScale = new THREE.Vector3();
    
    hitBox.getWorldPosition(worldPosition);
    hitBox.getWorldScale(worldScale);
    
    return {
        position: worldPosition,
        size: new THREE.Vector3(1.5 * worldScale.x, 4 * worldScale.y, 1.5 * worldScale.z),
        model: model
    };
}

const gravity = -9.8;
const physicsObjects = [];

export function SetPhysicsModel(model,mass = 1){
    model.userData.physics = {
        velocity: new THREE.Vector3(0,0,0),
        acceleration: new THREE.Vector3(0,gravity,0),
        mass: mass,
        onGround: false
    };

    physicsObjects.push(model);
}

export function UpdatePhysics(delta,groundY = 0){
    for(const model of physicsObjects){
        const phys = model.userData.physics;
        if(!phys) continue;

        phys.velocity.addScaledVector(phys.acceleration,delta);

        model.position.addScaledVector(phys.velocity, delta);

        if(model.position.y <= groundY){
            model.position.y = groundY;
            phys.velocity.y = 0;
            phys.onGround = true;
        }else{
            phys.onGround = false;
        }
    }
}