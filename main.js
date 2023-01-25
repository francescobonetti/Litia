import './style.css'
import * as THREE from 'three';
/* import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger.js'; */
gsap.registerPlugin(ScrollTrigger);
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
const hdrTextureURL = new URL('assets/Immagini/brown_photostudio_07_1k.hdr', import.meta.url); 
const scene = new THREE.Scene();

let specta;
let basetta;
let plane;
let movelights = {value: 1};
let video;
let loading = document.querySelector(".loading");
let camera;

let loadingTl = gsap.timeline({
  defaults : {
    ease: "power2.out",
    duration: 2
  }  
});


console.log("loading started")
  loadingTl.to(".loading-rect", {width:"12vh", height: "12vh"})
  loadingTl.call(loop)


let iphoneTex = "wave";

const toLoad = [
  {name: "specta", file: "assets/specta/Specta.gltf", group: new THREE.Group()},
  {name: "basetta", file: "assets/basetta/Basetta.gltf", group: new THREE.Group()},
  {name: "iphone", file: "assets/dispositivi/iphone/scene.gltf", group: new THREE.Group()},
  {name: "mac", file: "assets/dispositivi/mac/scene.gltf", group: new THREE.Group()},
  {name: "tv", file: "assets/dispositivi/tv/scene.gltf", group: new THREE.Group()}
]

const models = {};

const LoadingManager = new THREE.LoadingManager

//LoadingManager.onStart = loadingAnimation;
LoadingManager.onProgress = function(url, loaded, total) {console.log(loaded)}
LoadingManager.onLoad = setupAnimation;

const gltfLoader = new GLTFLoader(LoadingManager)
const textureLoader = new THREE.TextureLoader(LoadingManager)
const hdriloader = new RGBELoader(LoadingManager);

var appTex = textureLoader.load('assets/dispositivi/iphone/textures/ekran_baseColor_1.png');
var waveTex = textureLoader.load('assets/dispositivi/iphone/textures/ekran_baseColor.png');

toLoad.forEach(item=>{
  gltfLoader.load(item.file, (model)=>{
    model.scene.traverse(child => {
      if (child instanceof THREE.Mesh) {
        child.receiveShadow = true;
      }
    })
    item.group.add(model.scene)
    item.group.scale.set(10, 10, 10)
    scene.add(item.group);
    models[item.name] = item.group 
  })
}) 


//sizes 
let sizes = {
  width : window.innerWidth,
  height : window.innerHeight
} 


//lights

const startRightLight = new THREE.DirectionalLight( 0xffffff , 0.5 );
startRightLight.position.set( 10, 10, -10 );
startRightLight.castShadow = true
startRightLight.shadow.bias = -0.01;
startRightLight.shadow.mapSize.width = 2048
startRightLight.shadow.mapSize.height = 2048
startRightLight.shadow.camera.near = 1.0
startRightLight.shadow.camera.far = 500
startRightLight.shadow.camera.left = 200
startRightLight.shadow.camera.right = -200
startRightLight.shadow.camera.top = 200
startRightLight.shadow.camera.bottom = -200

const startLeftLight = new THREE.DirectionalLight( 0xffffff , 0.5 );
startLeftLight.position.set( -10, -10, -10 );
startLeftLight.castShadow = true
startLeftLight.shadow.bias = -0.01;
startLeftLight.shadow.mapSize.width = 2048
startLeftLight.shadow.mapSize.height = 2048
startLeftLight.shadow.camera.near = 1.0
startLeftLight.shadow.camera.far = 500
startLeftLight.shadow.camera.left = 200
startLeftLight.shadow.camera.right = -200
startLeftLight.shadow.camera.top = 200
startLeftLight.shadow.camera.bottom = -200

const RightLight = new THREE.DirectionalLight( 0xffffff , 0);
RightLight.position.set( 50, 50, 50 );
RightLight.castShadow = true
RightLight.shadow.bias = -0.01;
RightLight.shadow.mapSize.width = 2048
RightLight.shadow.mapSize.height = 2048
RightLight.shadow.camera.near = 1.0
RightLight.shadow.camera.far = 500
RightLight.shadow.camera.left = 200
RightLight.shadow.camera.right = -200
RightLight.shadow.camera.top = 200
RightLight.shadow.camera.bottom = -200

const LeftLight = new THREE.DirectionalLight( 0xffffff , 0);
LeftLight.position.set( -10, -10, 10 );
LeftLight.castShadow = true
LeftLight.shadow.bias = -0.01;
LeftLight.shadow.mapSize.width = 2048
LeftLight.shadow.mapSize.height = 2048
LeftLight.shadow.camera.near = 1.0
LeftLight.shadow.camera.far = 500
LeftLight.shadow.camera.left = 200
LeftLight.shadow.camera.right = -200
LeftLight.shadow.camera.top = 200
LeftLight.shadow.camera.bottom = -200

const BackLight = new THREE.DirectionalLight( 0xffffff , 0);
BackLight.position.set( 0, 15, -15 );
BackLight.target.position.set(0, 0, -20)
BackLight.castShadow = true
BackLight.shadow.bias = -0.01;
BackLight.shadow.mapSize.width = 2048
BackLight.shadow.mapSize.height = 2048
BackLight.shadow.camera.near = 1.0
BackLight.shadow.camera.far = 500
BackLight.shadow.camera.left = 200
BackLight.shadow.camera.right = -200
BackLight.shadow.camera.top = 200
BackLight.shadow.camera.bottom = -200

const ambientLight = new THREE.AmbientLight(0xffffff, 0)

scene.add( startRightLight, startLeftLight, RightLight, LeftLight, BackLight, BackLight.target, ambientLight );

//hdri
hdriloader.load(hdrTextureURL, function(texture) {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.environment = texture;
})

//camera
camera = new THREE.PerspectiveCamera(40, sizes.width/sizes.height, 0.1, 100);

camera.position.set(0, 0, 25);
let cameraTarget = new THREE.Vector3(0, 0, 0)
scene.add(camera);


//render

const renderer = new THREE.WebGLRenderer({alpha:true});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
const container = document.querySelector('.canvas-container');
container.appendChild( renderer.domElement)
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(window.devicePixelRatio)
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;


function loop() {

  camera.lookAt(cameraTarget)
  renderer.render(scene, camera); 
  requestAnimationFrame(loop);
  if(movelights.value > 0) {
    startRightLight.position.y = movelights.value *  10 * Math.cos(Date.now() / 2000);
    startRightLight.position.x = movelights.value *  10 * Math.sin(Date.now() / 2000);
    startLeftLight.position.y = -movelights.value *  10 * Math.cos(Date.now() / 2000);
    startLeftLight.position.x = -movelights.value *  10 * Math.sin(Date.now() / 2000);
  }

  loading.classList.add("inactive")
  //loadingTl.to(".loading", {opacity: 0})
  loadingTl.to(".loading", {"z-index": -2})
  
  
}


function setupAnimation(){

  console.log("loaded")

  video = document.querySelector(".video-scrub")

  //plane
  const geometry = new THREE.PlaneGeometry( sizes.width, sizes.height );
  const material = new THREE.MeshStandardMaterial( {color: 0xffffff, transparent: true, opacity: 1.0, envMapIntensity: 0});
  plane = new THREE.Mesh( geometry, material );
  plane.position.set(0, 0, -20);
  plane.receiveShadow = true;
  plane.castShadow = true;
  scene.add( plane );

  specta = models.specta
  basetta = models.basetta
  specta.children[0].children[0].material.envMapIntensity = 0
  basetta.children[0].children[0].material.envMapIntensity = 0

  specta.position.set( 0, -7, 3);
  specta.rotation.set(1.7, -0.12, 0);
  basetta.position.set(0, -40, 0);

  models.iphone.scale.set(7,7,7)
  models.mac.scale.set(7,7,7)
  models.tv.scale.set(3.2,3.2,3.2)

  models.mac.position.set(35, -10, -60)
  models.tv.position.set(-35, 1, -60)
  models.iphone.position.set(0, 2,-60)

  models.mac.rotation.y = -0.5
  models.tv.rotation.y = 0.5

  models.iphone.children[0].children[0].children[0].children[0].children[0].children[3].children[5].material.envMapIntensity = 0;

  desktopAnimation()

}

function desktopAnimation() {  

  console.log("desktop animation")

  const tl = gsap.timeline({
    defaults : {
      ease: "power2.inOut",
      duration: 2
    },
    scrollTrigger: {
      trigger: ".page",
      start: "top top",
      end: "bottom bottom",
      scrub: true,
    }

  
  });

  let section = 0;

  //comparsa
  tl.to(movelights, {value: 0}, section)
  tl.to(ambientLight, {intensity: 0.1}, '<')
  tl.to(startLeftLight, {intensity: 0}, '<')
  tl.to(startRightLight, {intensity: 0}, '<')
  tl.to(RightLight, {intensity: 0.6}, '<')
  tl.to(LeftLight, {intensity: 0}, '<')
  tl.to(BackLight, {intensity: 0.2}, '<')
  tl.to(specta.children[0].children[0].material, {envMapIntensity: 0.5}, '<')
  tl.to(basetta.children[0].children[0].material, {envMapIntensity: 0.5}, '<')
  tl.to(plane.material, {envMapIntensity: 1}, '<')
  tl.to(plane.material, {opacity: 0, duration: 2}, '<')
 
  //si appoggia sulla basetta
  tl.to(specta.rotation, {x:0, y:1.57, z:0}, section)
  tl.to(specta.position, {x:0, y:-2.55, z:0}, '<')
  tl.to(basetta.position, {x:0, y:-5.5, z:0}, '<')
  tl.from(".specta", {y: "100vh", duration:1}, section+1)
  section += 2;
  
  //ruota per far spazio al testo
  tl.to(specta.position, {x:4, y:-1}, section+0.5)
  tl.to(basetta.position, {x:4, y:-4.05}, '<')
  tl.to(".specta", {y: "-50vh", duration:1}, section+0.5)
  tl.from(".personal-silencer", {y:"2vh", opacity:0, duration: 1}, section+1)
  section +=2
  
  //sale coperta dal video
  tl.to(specta.position, {y:1}, section+0.5)
  tl.to(basetta.position, {y:-1.05}, '<')
  tl.to(".personal-silencer", {y:"-10vh", opacity:0}, '<')
  tl.from(".video-container", {y: "100vh"}, '<')
  tl.add(function() {video.play()}, section)
  section += 2;
  
  //in posizione per dopo il video
  tl.to(specta.rotation, {x:-3, y:-0.12}, section)
  tl.to(basetta.position, {x:0, y:-0.5, z:-2}, '<')
  tl.to(basetta.rotation, {x:0, y:0}, '<')
  section +=2;

  //la basetta scende 
  tl.to(basetta.rotation, {x:1.57, y:1.57}, section)
  tl.to(specta.position, {x:0, y:20, z:0}, '<')
  tl.to(basetta.position, {x:5}, '<')
  tl.to(".video-container", {y: "-100vh"}, '<')
  tl.add(function() {video.pause()}, section)
  tl.from(".plug-and-play", {y:"2vh", opacity:0, duration: 1}, section+1)
  section +=2

  //la basetta va in centro e entrano i dispositivi
  tl.to(basetta.position, {x:0, y:-18, z:-40}, section)
  tl.to(basetta.rotation, {x:0, y:0, z:0}, '<')
  tl.to(specta.position, {x:0, y:-15, z:-40}, '<')
  tl.to(specta.rotation, {x:0, y:0, z:0}, '<')
  tl.from(models.mac.position, {x:100}, '<')
  tl.from(models.mac.rotation, {y:1.57}, '<')
  tl.from(models.tv.position, {x:-100}, '<')
  tl.from(models.tv.rotation, {y:-1.57}, '<')
  tl.from(models.iphone.position, {z:40, y:30, duration: 1.5}, section + 0.5)
  tl.from(models.iphone.rotation, {x:-3, duration: 1.5}, '<')
  tl.from(".all-devices", {y:"2vh", opacity:0, duration: 1}, '<')
  tl.to(".plug-and-play", {y:"-2vh", opacity:0, duration: 1}, '<')
  section +=2

  //il telefono viene avanti per mostrare l'app
  tl.to(models.iphone.position, {x:-18, y:0, z:-20}, section)
  tl.to(models.iphone.rotation, {y:7.28, x:-0.2, z:0.3}, section)
  //tl.to(models.iphone.scale, {x:0.3, y:0.3, z:0.3}, section)
  tl.to(models.mac.position, {x:100}, '<')
  tl.to(models.mac.rotation, {y:1.57}, '<')
  tl.to(models.tv.position, {x:-100}, '<')
  tl.to(models.tv.rotation, {y:-1.57}, '<')
  tl.to(basetta.position, {y:-40}, '<')
  tl.to(specta.position, {y:-37, z:0}, '<')
  tl.to(".all-devices", {y:"-2vh", opacity:0, duration: 1}, '<')
  tl.from(".app", {y:"2vh", opacity:0, duration: 1}, section + 0.5)
  tl.add(function() {

    waveTex.flipY = false;

      if(iphoneTex == "app") {
        iphoneTex = "wave";
        models.iphone.children[0].children[0].children[0].children[0].children[0].children[3].children[5].material.map = waveTex;
        models.iphone.children[0].children[0].children[0].children[0].children[0].children[3].children[5].material.emissiveMap = waveTex;
    }
      else {
        iphoneTex = "app"
        models.iphone.children[0].children[0].children[0].children[0].children[0].children[3].children[5].material.map = appTex;
        models.iphone.children[0].children[0].children[0].children[0].children[0].children[3].children[5].material.emissiveMap = appTex;
      }
    }

  , section+1) 
  section +=2

//telefono esce
  tl.to(".app", {y:"-80vh", opacity: 0}, section);
  tl.to(models.iphone.position, {y: 40, duration: 1.5}, section + 0.5);
  tl.to(models.iphone, {opacity: 0}, '<');
  
//due colorazioni
  tl.to(specta.rotation, {x:1.7, y:-0.12, z:0},'<')
  tl.to(specta.position, {x:0, y:1, z:0},'<')
  tl.from(".buynow", {y:"20vh"},section + 1.5)
  section+=2; 
  
}













