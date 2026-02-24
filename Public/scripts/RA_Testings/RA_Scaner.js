//import { MindARThree } from 'mindar-image-three'

const start = async () =>{
    const mindarThree = new window.MINDAR.IMGAE.MindARThree({
        container: document.querySelector(".phone-camera"),
        imageTargetSrc: '/Public/image/escudos/targets.mind'
    });

    // okay?
    const {renderer,scene,camera} = mindarThree;


    const Anchor = mindarThree.addAnchor(0);

    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshNormalMaterial();
    const cube = new THREE.Mesh(geometry, material);
    
    Anchor.group.add(cube);

    // detecta la imagen
    Anchor.onTargetFound = () =>{
        //DesbloquearObjeto()
        console.log("Detectado!!");
    };

    const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
    scene.add(light);

    //scene.add(Objeto);

    await mindarThree.start();

    renderer.setAnimationLoop(()=>{
        renderer.render(scene,camera);
    });
};

start();