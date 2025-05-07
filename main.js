import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.outputColorSpace = THREE.SRGBColorSpace;

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xffffff);
renderer.setPixelRatio(window.devicePixelRatio);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.set(4, 5, 11);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 7;
controls.maxDistance = 14;
controls.minPolarAngle = 0.5;
controls.maxPolarAngle = 1.5;
controls.autoRotate = false;
controls.target = new THREE.Vector3(0, 1, 0);
controls.update();

// const m1 = new THREE.MeshBasicMaterial({color: 0xFF0000});  
// const groundGeometry = new THREE.PlaneGeometry(20, 20, 32, 32);
// groundGeometry.rotateX(-Math.PI / 2);
// const groundMaterial = new THREE.MeshStandardMaterial({
//   color: 0x555555,
//   side: THREE.DoubleSide
// });
// const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
// groundMesh.castShadow = false;
// groundMesh.receiveShadow = true;
// scene.add(groundMesh);

const light = new THREE.AmbientLight(0xffffff, 3);
light.castShadow = false;
scene.add(light);

// const spotLight = new THREE.SpotLight(0xffffff, 3000, 100, 0.22, 1);
// spotLight.position.set(0, 50, 50);
// spotLight.castShadow = false;
// spotLight.shadow.bias = -0.0001;
// scene.add(spotLight);

const loader = new GLTFLoader().setPath('models/pushkin/');
loader.load('pushkin.gltf', (gltf) => {
  console.log('loading model');
  const mesh = gltf.scene;
  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x000000,
    metalness: .9,
    roughness: .05,
    envMapIntensity: 0.9,
    clearcoat: 1,
    transparent: true,
    opacity: .5,
    reflectivity: 0.2,
    refractionRatio: 0.985,
    ior: 0.9,
    side: THREE.DoubleSide,
    // alphaHash: true    
  });

  mesh.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = false;
      child.reseveShadow = false;
      if (child.name.includes('glass')) {
        child.material = glassMaterial;
      } else {
        const materialParams = {};
        if (child.material.map) {
          materialParams.map = child.material.map;
          // materialParams.transparent = true;
          // materialParams.alphaHash  = true;

        }
        materialParams.side = THREE.DoubleSide;
        materialParams.color = 0xffffff;

        const newMaterial = new THREE.MeshBasicMaterial(materialParams);
        child.material = newMaterial;
      }
    }
  });

  mesh.position.set(-1, 0, 0);
  mesh.scale.set(0.1, 0.1, 0.1);
  scene.add(mesh);
});


window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

animate();