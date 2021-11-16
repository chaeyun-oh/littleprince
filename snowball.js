import * as THREE from '../build/three.module.js';
import { OrbitControls } from "../examples/jsm/controls/OrbitControls.js"
import { GLTFLoader } from "../examples/jsm/loaders/GLTFLoader.js"

//var loader = new THREE.TextureLoader();
    //var backgroundTexture = loader.load( 'space.jpeg' );

//const scene = new THREE.Scene();

//function addStar() {
    //const geometry = new THREE.SphereGeometry(0.25, 24, 24);
    //const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
    //const star = new THREE.Mesh(geometry, material);
  
    //const [x, y, z] = Array(3)
      //.fill()
      //.map(() => THREE.MathUtils.randFloatSpread(100));
  
    //star.position.set(x, y, z);
    //scene.add(star);
  //}
  
  //Array(200).fill().forEach(addStar);
  
  // Background
  
  //const spaceTexture = new THREE.TextureLoader().load('space.jpg');
  //scene.background = spaceTexture;


class APP {
    constructor() {
    const divContainer = document.querySelector("#webgl-container");
    this._divContainer = divContainer;

    const renderer = new THREE.WebGLRenderer({ antialias:true });
    renderer.setPixelRatio(window.devicePixelRatio);
    divContainer.appendChild(renderer. domElement);
    this._renderer = renderer;
 
    const scene = new THREE.Scene();
    this._scene = scene;


    this._setupCamera();
    this._setupLight();
    this._setupBackground();
    this._setupModel();
    this._setupControls();

    window.onresize = this.resize.bind(this);
    this.resize();

    requestAnimationFrame(this.render.bind(this));
 }

 

 _zoomFit(object3D, camera) {
     //모델 경계 박스
     const box = new THREE.Box3() .setFromObject(object3D);

     // 모델의 경계 박스 대각 길이
     const sizeBox = box.getSize(new THREE.Vector3()).length();

     // 모델 크기의 절반값
     const halfSizeModel = sizeBox * 0.5;

     // 카메라의 fov의 절반값
     const halfFov = THREE.Math.degToRad(camera.fov * .5);

    //모델을 화면에 꽉 채우기 위한 적당한 거리
     const distance = halfSizeModel / Math.tan(halfFov);
    
    // 모델 중심에서 카메라 위치로 향하는 방향 단위 백터 계산
    const direction = (new THREE.Vector3()). subVectors(
    camera.position, centerBox).normalize();

    //"단위 방향 벡터" 방향으로 모델 중심 위치에서  distance 거리에 대한 위치
    const position = direction.multiplyScalar(distance).add(centerBox);
    camera.position.copy(position);

    // 모델의 크기에 맞춰 카메라의 near, far 값을 대략적으로 조정
    camera.near = sizeBox / 100;
    camera.far = sizeBox * 0;

    // 카메라 기본 속성 변경에 따른 투영행렬 업데이트
    camera.updateProjectionMatrix();

    //카메라가 모델의 중심을 바라 보도록 함
    camera.lookAT(centerBox.x, centerBox.y. centerBox.z);
 }

 _setupControls() {
    new OrbitControls(this._camera, this._divContainer);
}

 _setupCamera() {
 
     const camera = new THREE.PerspectiveCamera(
         75,
         window.innerWidth / window.innerHeight,
         0.1,
         100
        );

        camera.position.z = 4;
        this._camera = camera;

        this._scene.add(this._camera);
    }

    _setupLight() {
        const color = 0xffffff;
        const intensity =1.5;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(-1, 2, 4);
        //this._scene.add(light);
        this._camera.add(light); 
    }

    _setupModel() {

        
        const gltfLoader = new GLTFLoader();

        const url = 'data/snowball/moon.gltf';
    
        gltfLoader. load(
            url,
            (gltf) => {
                const root = gltf.scene;
                this._scene.add(root);

                this._zoomFit(root, this._camera);
            }
        ); 
    }
    _setupBackground() {
        //this._scene.background = new THREE.Color("9b59b6");
        //this._scene.fog = new THREE.Fog("9b59b6",0,150);
        // this._scene.fog = new THREE.FogExp2("9b59b6",0.02);
        const loader = new THREE.TextureLoader();    
        
        loader.load("./data/bg.jpg", texture => { 
            this._scene.background = texture; 
        });
    }
    
 
    resize() {
        const width = this._divContainer.clientWidth;
        const height = this._divContainer.clientHeight;

        this._camera.aspect = width / height;
        this._camera.updateProjectionMatrix();

        this._renderer.setSize(width, height);
    }

    render(time) {
        this._renderer.render(this._scene, this._camera);
        this.update(time);
        requestAnimationFrame(this.render.bind(this));
    }

    update(time) {
        time *=0.001; 
        //this._cube.rotation.x = time;
        //this._cube.rotation.y = time;
    }
}

window.onload = function() {
   new APP();
} 
