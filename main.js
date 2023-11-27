import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, 300 / 300, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(0, 1, 0);
scene.add(directionalLight);
renderer.setSize( 300, 300);
document.body.appendChild( renderer.domElement );
const texture = new THREE.TextureLoader().load( './crate.gif' );
texture.colorSpace = THREE.SRGBColorSpace;

const geometryS = new THREE.SphereGeometry(0.6, 10, 10);
const materialS = new THREE.MeshBasicMaterial( { map: texture } );
const sphere = new THREE.Mesh( geometryS, materialS );

const geometry = new THREE.CylinderGeometry(0.3, 0.3, 2, 4 );
const material = new THREE.MeshBasicMaterial( { map: texture } );
const cube = new THREE.Mesh( geometry, material );

const radius = 1;
const height = 3;
const segments = 32;

const topGeometry = new THREE.SphereGeometry(radius, segments, segments, 0, Math.PI * 2, 0, Math.PI / 2);
const bottomGeometry = new THREE.SphereGeometry(radius, segments, segments, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2);
const middleGeometry = new THREE.CylinderGeometry(radius, radius, height - 2 * radius, segments);

// Merge geometries using BufferGeometryUtils
const pillGeometry = BufferGeometryUtils.mergeBufferGeometries([topGeometry, bottomGeometry, middleGeometry]);

// Create a material
const materialPill = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });

// Create a mesh with the pill geometry and material
const pillMesh = new THREE.Mesh(pillGeometry, materialPill);

cube.rotation.z = Math.PI / 2
cube.position.set(0, -5, 0)

cubeT.rotation.z = Math.PI / 2
cubeT.position.set(0, 5, 0)

scene.add( cube );
scene.add(pillMesh);
scene.add(sphere);
camera.position.z = 10;


renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

//controls.update() must be called after any manual changes to the camera's transform
// camera.position.set( 0, 20, 100 );
let delta = 0.05;
let deltaX = 0.05;
function animate() {
	requestAnimationFrame( animate );
	const box1 = new THREE.Box3().setFromObject(cube);
	const box2 = new THREE.Box3().setFromObject(cubeT);
	const sphereB = new THREE.Box3().setFromObject(sphere);
	if ((sphereB.intersectsBox(box2) || sphereB.intersectsBox(box1)) || (sphere.position.y > 5 || sphere.position.y < -5)) {
		delta = -delta
	}
	if ((sphere.position.x > 5 || sphere.position.x < -5))
		deltaX = -deltaX
	sphere.position.set(sphere.position.x + deltaX, sphere.position.y + delta, 0)
	renderer.render( scene, camera );
	console.log(sphere.position.x)
}

window.addEventListener("keyup", (key)=>{
	if (key.key == "ArrowRight")
		cube.position.set( cube.position.x + 0.7, -5, 0 );
	if (key.key == "ArrowLeft")
		cube.position.set( cube.position.x - 0.7, -5, 0 );
	if (key.key == "a")
		cubeT.position.set( cubeT.position.x - 0.7, 5, 0 );
	if (key.key == "d")
		cubeT.position.set( cubeT.position.x + 0.7, 5, 0 );
		if (key.key == "w")
		cubeT.position.set( 0, cubeT.position.y + 0.7, 0 );
		if (key.key == "s")
		cubeT.position.set( 0, cubeT.position.y - 0.7, 0 );
})

animate();