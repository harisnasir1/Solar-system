import * as THREE from 'three';
import {OrbitControls} from "jsm/controls/OrbitControls.js"
import starfield from './src/Starfield.js'
import { getFresnelMat } from "./src/getFresnelMat.js";

//setup the renderer
const w = window.innerWidth;
const h = window.innerHeight;
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

//shadow
renderer.shadowMap.enabled = true;

//set up the camera
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 5000);
camera.position.z = 3;
const scene = new THREE.Scene();
const earthgroup = new THREE.Group();
scene.add(earthgroup);

//tilt the earth
earthgroup.rotation.z = -23.4 * Math.PI / 180

//Working on earth textures
const loader = new THREE.TextureLoader();

//earth
const geo = new THREE.IcosahedronGeometry(1, 40);
const mat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: loader.load("./textures/Earth_maps/8k_earth_daymap.jpg")
});
const Earth = new THREE.Mesh(geo, mat);
Earth.castShadow = true;
Earth.receiveShadow = true;
earthgroup.add(Earth);

//earth night lights
const lightMat = new THREE.MeshBasicMaterial({
    map: loader.load("./textures/Earth_maps/8k_earth_nightmap.jpg"),
    blending: THREE.AdditiveBlending,
})
const lightMesh = new THREE.Mesh(geo, lightMat)
earthgroup.add(lightMesh);

//earth cloud
const Cloudmat = new THREE.MeshBasicMaterial({
    map: loader.load("./textures/Earth_maps/8k_earth_clouds.jpg"),
    transparent: true,
    opacity: 0.35,
    blending: THREE.AdditiveBlending,
});
const cloudmesh = new THREE.Mesh(geo, Cloudmat);
cloudmesh.scale.setScalar(1.001);
earthgroup.add(cloudmesh);

//earth glow around it for it i use fresnel 
const fresnelMat = getFresnelMat();
const glowMesh = new THREE.Mesh(geo, fresnelMat);
glowMesh.scale.setScalar(1.01);
earthgroup.add(glowMesh);


//saturn 
//satrun ring 
const Saturn_group=new THREE.Group();
scene.add(Saturn_group);
const satgeo=new THREE.IcosahedronGeometry(10,40);
const satmat=new THREE.MeshBasicMaterial({
    color:0xffffff,
    map:loader.load("../textures/Saturn_maps/saturnmap.jpg")
});
const Saturn=new THREE.Mesh(satgeo,satmat);

Saturn_group.add(Saturn);


const Ringgeo=new THREE.TorusGeometry(15,2.2,2,21,6.283185307179586);
const ringmat=new THREE.MeshBasicMaterial({
    color:0xffffff,
    map:loader.load("../textures/Saturn_maps/saturnringcolor.jpg")

});
const Ring=new THREE.Mesh(Ringgeo,ringmat);
Ring.rotation.x=-300;
Ring.rotation.y=-3;
Saturn_group.add(Ring);


//Ring clouds

const Ring_clouds_mat=new  THREE.MeshBasicMaterial({
    map:loader.load("../textures/Saturn_maps/ssaturnringpattern.gif"),
     transparent:true,
     opacity:20
});
const Ring_clouds=new THREE.Mesh(Ringgeo,Ring_clouds_mat);
Ring_clouds.rotation.x=-300;
Ring_clouds.rotation.y=-3;

Saturn_group.add(Ring_clouds);

Saturn_group.position.set(-70,0,0);
























//adding stars
const stars0 = starfield({numstar: 100000, r: 645});
const stars1 = starfield({numstar: 100000, r: 665});
const stars = starfield({numstar: 100000, r: 685});
scene.add(stars);
scene.add(stars1);
scene.add(stars0);

//orbit controls
const Controls = new OrbitControls(camera, renderer.domElement);
Controls.enableDamping = true;
Controls.dampingFactor = 0.03;

//moon
const moongroup = new THREE.Group();
scene.add(moongroup)
const moonGeo = new THREE.IcosahedronGeometry(0.25, 20);
const moonmat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: loader.load("../textures/moon_maps/moonmap4k.jpg"),
    roughness: 1,  // To avoid shiny appearance
    metalness: 0,  // To avoid metallic appearance
});
const Moon = new THREE.Mesh(moonGeo, moonmat);
Moon.castShadow = true;
Moon.receiveShadow = true;

moongroup.position.set(2, 0, 0)
moongroup.add(Moon);

//bumps on the moon
const darkmoon = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: loader.load("../textures/moon_maps/moonbump4k.jpg"),
    blending: THREE.MultiplyBlending,
    roughness: 1,  // To avoid shiny appearance
    metalness: 0,
});
const darkmoonmesh = new THREE.Mesh(moonGeo, darkmoon);
moongroup.add(darkmoonmesh);


//planet earth and its moon

const planetEarth=new THREE.Group();
scene.add(planetEarth);
planetEarth.add(moongroup);
planetEarth.add(earthgroup);



//sun
const sungroup = new THREE.Group();
scene.add(sungroup);
const sungeo = new THREE.IcosahedronGeometry(100, 200);
const sunmat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    map: loader.load("../textures/sun_maps/8k_sun.jpg")
});
const Sunmesh = new THREE.Mesh(sungeo, sunmat);
Sunmesh.position.set(200, 0, 0);
sungroup.add(Sunmesh);
sungroup.add(planetEarth);


//sun lights
const sunlight = new THREE.DirectionalLight(0xffffce, 3);
sunlight.position.set(200, 0, 0);

sunlight.castShadow = true;
sunlight.shadow.camera.left = -10;
sunlight.shadow.camera.right = 10;
sunlight.shadow.camera.top = 10;
sunlight.shadow.camera.bottom = -10;
sunlight.shadow.camera.near = 0.5;
sunlight.shadow.camera.far = 1000;
sungroup.add(sunlight)

function animation(t = 0) {
    requestAnimationFrame(animation);

    Earth.rotation.y += 0.001;
    lightMesh.rotation.y += 0.001;
    cloudmesh.rotation.y += 0.0019;
    moongroup.rotation.y += 0.0029;
  
    Controls.update();
    renderer.render(scene, camera);
}

animation();

let angle = 0;
let radius = 5;
let speed = 0.004;
function mooncirculatpath(t = 0) {
    requestAnimationFrame(mooncirculatpath);
    let x = Math.cos(angle) * radius;
    let y = Earth.position.y;
    let z = Math.sin(angle) * radius;
    moongroup.position.set(x, y, z);
    
    angle += speed;
}

mooncirculatpath();
