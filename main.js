import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

function mapValue(x, in_min, in_max, out_min, out_max)
{
	return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;

}

const GAME_WIDTH =220;
const GAME_HEIGHT = 250;
const PILLS_Y = 6;
const PILLS_OFFSET = (GAME_HEIGHT - 20) / 2;
const BALL_Y = 6;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();

//defining background
const background = new THREE.TextureLoader().load('./textures/tenniBack.png');
scene.background = background

renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const controls = new OrbitControls( camera, renderer.domElement );
camera.position.set( 0, 90, 170 );
controls.update();

//define ball
const textureBall = new THREE.TextureLoader().load('./textures/ball.jpg');
textureBall.colorSpace = THREE.SRGBColorSpace;
const geometryBall = new THREE.SphereGeometry(5, 10, 20, 20);
const materialBall =new THREE.MeshStandardMaterial( {map: textureBall, side: THREE.DoubleSide, roughness: 0.7, metalness: 0.1,} );
const ball = new THREE.Mesh( geometryBall, materialBall);
ball.position.set(0, 6, 0);
scene.add(ball);

//define plane
const texturePlane = new THREE.TextureLoader().load('./textures/blue-tennis-court-texture-synthetic-surface-tennis-court-sports-background-field-top-view-ground_611669-82.avif');
texturePlane.colorSpace = THREE.SRGBColorSpace;
const geometryPlane = new THREE.PlaneGeometry(GAME_WIDTH, GAME_HEIGHT);
const materialPlane =new THREE.MeshStandardMaterial( {map: texturePlane, side: THREE.DoubleSide, roughness: 0.7, metalness: 0.1,} );
const plane = new THREE.Mesh( geometryPlane, materialPlane);
plane.rotation.x = Math.PI / 2;
scene.add(plane);

//define bottom bar
const texture = new THREE.TextureLoader().load('./textures/pddleTexture.jpg');
texture.colorSpace = THREE.SRGBColorSpace;
const geometryBottomPills = new THREE.CapsuleGeometry( 4, 20, 10, 10 ); 
const materialBottomPills = new THREE.MeshStandardMaterial({ map: texture, roughness: 0.7, metalness: 0.1,});
const bottomPills = new THREE.Mesh( geometryBottomPills, materialBottomPills);
bottomPills.rotation.z = Math.PI / 2;
bottomPills.position.set(0, PILLS_Y, PILLS_OFFSET);
scene.add( bottomPills );

//define upper bar
const geometryTopPills = new THREE.CapsuleGeometry( 4, 20, 10, 10 ); 
const materialTopPills = new THREE.MeshStandardMaterial({ map: texture, roughness: 0.7, metalness: 0.1,});
const topPills = new THREE.Mesh( geometryTopPills, materialTopPills);
topPills.rotation.z = Math.PI / 2;
topPills.position.set(0, PILLS_Y, -PILLS_OFFSET);
scene.add( topPills );


//setting up lights
const light1 = new THREE.PointLight(0xFFFFFF, 100000);
light1.position.set(100, 100, 100);
scene.add(light1);
const light2 = new THREE.PointLight(0xFFFFFF, 100000);
light2.position.set(-100, 100, -100);
scene.add(light2);

//define ball movement
let deltaZ = 0.0;
let deltaX = 0.0;
ball.rotation.z = 0.01;
ball.rotation.x = 0.01;

//defining wall


console.log("done setting up")
function animate() {
	requestAnimationFrame( animate );
	if (deltaX != 0 && deltaZ != 0)
	{
		deltaX > 0 ? deltaX += 0.0001 : deltaX -= 0.0001;
		deltaZ > 0 ? deltaZ += 0.0001 : deltaZ -= 0.0001;
	}
	const ballColl = new THREE.Box3().setFromObject(ball);
	const topPillsColl = new THREE.Box3().setFromObject(topPills);
	const botPillsColl = new THREE.Box3().setFromObject(bottomPills);
	if (ball.position.z > PILLS_OFFSET || ball.position.z < -PILLS_OFFSET)
	{
		deltaZ = 0;
		deltaX = 0;
		ball.position.set(0, 0, 0)
		alert("You loose !!");
	}
	if ((ballColl.intersectsBox(topPillsColl) || ballColl.intersectsBox(botPillsColl))) {
		deltaZ = -deltaZ;
	}
	if (ball.position.x > ((GAME_WIDTH - 20) / 2) || ball.position.x < ((GAME_WIDTH - 20) / -2))
		deltaX = -deltaX;
	controls.update();
	renderer.render( scene, camera );
	topPills.position.set(ball.position.x, PILLS_Y, topPills.position.z)
	ball.rotation.z += 0.05;
	ball.rotation.x = 0.05;
	ball.position.set(ball.position.x += deltaX, BALL_Y, ball.position.z += deltaZ);

}

window.addEventListener("keyup", (key)=>{
	if (key.key == "s")
	{
		deltaZ = 0.2;
		deltaX = 0.07;
	}
	if (key.key == "ArrowLeft" && bottomPills.position.x >= ((GAME_WIDTH - 40) / -2))
		bottomPills.position.set( bottomPills.position.x - 10 , PILLS_Y, bottomPills.position.z);
	if (key.key == "ArrowRight" && bottomPills.position.x <= ((GAME_WIDTH - 40) / 2))
		bottomPills.position.set( bottomPills.position.x + 10 , PILLS_Y, bottomPills.position.z);
})

window.addEventListener("mousemove", (e)=>{
	bottomPills.position.set(mapValue(e.x, 0, window.innerWidth, -PILLS_OFFSET, PILLS_OFFSET), PILLS_Y, bottomPills.position.z)
})

animate();