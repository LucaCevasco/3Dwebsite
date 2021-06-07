import './style.css'

import * as THREE from 'three';

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// PARAMS
const FOV = 75;
const ASPECT_RATIO = window.innerWidth / window.innerHeight;
const FRUSTRUM_INIT = 0.1;
const FRUSTRUM_FINISH = 1000;

// fundamentals
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(FOV, ASPECT_RATIO, FRUSTRUM_INIT, FRUSTRUM_FINISH)

const renderer = new THREE.WebGL1Renderer({
  canvas: document.querySelector('#bg')
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
//camera position init in z = 30
camera.position.setZ(30);

renderer.render(scene, camera);

// figures
const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
const material = new THREE.MeshStandardMaterial({color: 0xFF6347});
const torus = new THREE.Mesh(geometry, material);

scene.add(torus);

// lights
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5,5,5);

const ambientLight = new THREE.AmbientLight(0xffffff);

scene.add(pointLight, ambientLight);

// helpers
/*
const lightHelper = new THREE.PointLightHelper(pointLight)
const gridHelper = new THREE.GridHelper(200, 50)
scene.add(lightHelper, gridHelper);
*/

// controls
const controls = new OrbitControls(camera, renderer.domElement);

// generators
function addStar() {
  const geometry = new THREE.SphereGeometry(0.30);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff});
  const star = new THREE.Mesh(geometry, material);
  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));
  
  star.position.set(x, y, z);
  scene.add(star);
}

Array(250).fill().forEach(addStar);

// scene background
const spaceTexture = new THREE.TextureLoader().load("space.jpg")
scene.background = spaceTexture;

// avatar
const avatarTexture = new THREE.TextureLoader().load("avatar.jpeg")

const avatar = new THREE.Mesh(
  new THREE.BoxGeometry(3,3,3),
  new THREE.MeshBasicMaterial({ map: avatarTexture })
)

scene.add(avatar);

// moon
const moonTexture = new THREE.TextureLoader().load("moon.jpg");
const normalTexture = new THREE.TextureLoader().load("normal.jpg");

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3,32,32),
  new THREE.MeshBasicMaterial({ map: moonTexture, normalMap: normalTexture })
);

scene.add(moon);

moon.position.z = 30; // setZ or .z its the same
moon.position.setX(-10);

// move camera

function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
  moon.rotation.x += 0.05;
  moon.rotation.y += 0.075;
  moon.rotation.z += 0.05;

  avatar.rotation.y += 0.01;
  avatar.rotation.z += 0.01;

  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.rotation.y = t * -0.0002;
}

document.body.onscroll = moveCamera

// animation loop -- like videogames loop, keep the animation running
function animate() {
  requestAnimationFrame(animate);

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  controls.update()

  renderer.render(scene, camera);
}

animate();