import './style.css'
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger.js';
gsap.registerPlugin(ScrollTrigger);
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'


const hdrTextureURL = new URL('assets/Immagini/brown_photostudio_07_1k.hdr', import.meta.url); 
const scene = new THREE.Scene();

let specta;
let basetta;

let iphoneTex = "wave";

const toLoad = [
  {name: "specta", file: "assets/specta/Specta.gltf", group: new THREE.Group()},
  {name: "basetta", file: "assets/basetta/Basetta.gltf", group: new THREE.Group()},
  {name: "iphone", file: "assets/dispositivi/iphone/scene.gltf", group: new THREE.Group()},
  {name: "mac", file: "assets/dispositivi/mac/scene.gltf", group: new THREE.Group()},
  {name: "tv", file: "assets/dispositivi/tv/scene.gltf", group: new THREE.Group()}
]

const models = {};

const LoadingManager = new THREE.LoadingManager(()=>{
  setupAnimation();
})
const gltfLoader = new GLTFLoader(LoadingManager)

toLoad.forEach(item=>{
  gltfLoader.load(item.file, (model)=>{
    model.scene.traverse(child => {
      if (child instanceof THREE.Mesh) {
        child.receiveShadow = true;
        child.castShadow = true;
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


//hdri
const hdriloader = new RGBELoader();
hdriloader.load(hdrTextureURL, function(texture) {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.environment = texture;
})

//camera
const camera = new THREE.PerspectiveCamera(50, sizes.width/sizes.height, 0.1, 100);

camera.position.set(0, 0, 20);
let cameraTarget = new THREE.Vector3(0, 0, 0)
scene.add(camera);


//render
const renderer = new THREE.WebGLRenderer({alpha:true});
const container = document.querySelector('.canvas-container');
container.appendChild( renderer.domElement)
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(2)
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;




//orbitcontrols
//const controls = new OrbitControls(camera, renderer.domElement)

function loop() {
  camera.lookAt(cameraTarget)
  renderer.render(scene, camera); 
  requestAnimationFrame(loop);
}

loop()


// --- ON RESIZE

/* const onResize = () => {
	sizes.width = container.clientWidth;
	sizes.height = container.clientHeight;

	camera.aspect = sizes.width/sizes.height;
	camera.updateProjectionMatrix()

  renderer.setSize(sizes.width, sizes.height);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))	
}

window.addEventListener('resize', onResize)
onResize(); */


function setupAnimation(){
  specta = models.specta
  basetta = models.basetta

  specta.position.set(1.5, -13,0);
  specta.rotation.set(0,0,4);
  basetta.position.set(0, -40, 0);

  models.iphone.scale.set(7,7,7)
  models.mac.scale.set(7,7,7)
  models.tv.scale.set(3.2,3.2,3.2)

  models.mac.position.set(35, -10, -60)
  models.tv.position.set(-35, 1, -60)
  models.iphone.position.set(0, 2,-60)

  models.mac.rotation.y = -0.5
  models.tv.rotation.y = 0.5

  desktopAnimation()

}



//gsap.from(".waves-container", {y:0})

function desktopAnimation() {

  let video = document.querySelector(".video-scrub")

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
  tl.to(specta.position, {x: 0, y:-1, z:0, duration: 1}, section);
  tl.to(specta.rotation, {x:1, y:-0.12, z:0, duration: 1}, '<');
  section += 1;

  //si appoggia sulla basetta
  tl.to(specta.rotation, {x:0, y:1.57, z:0}, section)
  tl.to(specta.position, {y:-2.55}, '<')
  tl.to(basetta.position, {x:0, y:-5.5, z:0}, '<')
  tl.from(".specta", {y:1000, opacity:0, duration: 1}, section+1)
  section += 2;
  
  //ruota per far spazio al testo
  tl.to(specta.position, {x:4, y:-1}, section+0.5)
  tl.to(basetta.position, {x:4, y:-4.05}, '<')
  tl.to(".specta", {y: -500, opacity:0, duration: 1}, section+0.5)
  tl.from(".personal-silencer", {y:"2vh", opacity:0, duration: 1}, section+1)
  section +=2
  
  //sale coperta dal video
  tl.to(specta.position, {y:1}, section+0.5)
  tl.to(basetta.position, {y:-1.05}, '<')
  tl.to(".personal-silencer", {y:"-10vh", opacity:0}, '<')
  tl.from(".video-container", {y: "100vh"}, '<')
  tl.add(function() {video.play(); console.log("play")}, section)
  section += 2;
  
  //in posizione per dopo il video
  tl.to(specta.rotation, {x:-3, y:-0.12}, section)
  tl.to(basetta.position, {x:0, y:-0.5, z:-2}, '<')
  tl.to(basetta.rotation, {x:0, y:0}, '<')
  section +=2;

  //la basetta scende 
  tl.to(basetta.rotation, {x:1.57, y:1.57}, section)
  tl.to(specta.position, {x:0, y:20, z:50}, '<')
  tl.to(basetta.position, {x:5}, '<')
  tl.to(".video-container", {y: "-100vh"}, '<')
  tl.add(function() {video.pause()}, section)
  tl.from(".plug-and-play", {y:"2vh", opacity:0, duration: 1}, section+1)
  section +=2

  //la basetta va in centro e entrano i dispositivi
  tl.to(basetta.position, {x:0, y:-15, z:-25}, section)
  tl.to(basetta.rotation, {x:0, y:0, z:0}, '<')
  tl.to(specta.position, {x:0, y:-12, z:-25}, '<')
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
  tl.to(basetta.position, {y:-50}, '<')
  tl.to(specta.position, {y:-50}, '<')
  tl.to(".all-devices", {y:"-2vh", opacity:0, duration: 1}, '<')
  tl.from(".app", {y:"2vh", opacity:0, duration: 1}, section + 0.5)
  tl.add(function() {
    
    var appTex = new THREE.TextureLoader().load('assets/dispositivi/iphone/textures/ekran_baseColor_1.png');
    var waveTex = new THREE.TextureLoader().load('assets/dispositivi/iphone/textures/ekran_baseColor.png');
    var appEmiTex = new THREE.TextureLoader().load('assets/dispositivi/iphone/textures/ekran_baseColor_1_emission.png');

    waveTex.flipY = false;

      if(iphoneTex == "app") {
        iphoneTex = "wave";
        models.iphone.children[0].children[0].children[0].children[0].children[0].children[3].children[5].material.map = waveTex;
        models.iphone.children[0].children[0].children[0].children[0].children[0].children[3].children[5].material.emissiveMap = waveTex;
      
    }
      else if (iphoneTex =="wave") {
        iphoneTex = "app"
        models.iphone.children[0].children[0].children[0].children[0].children[0].children[3].children[5].material.map = appTex;
        models.iphone.children[0].children[0].children[0].children[0].children[0].children[3].children[5].material.emissiveMap = appEmiTex;
      }
    }

  , section+1) 
  section +=2

//telefono al centro
  tl.to(".app", {y:"-2vh", opacity:0, duration: 1}, section);
  tl.to(models.iphone.position, {x:0}, '<');
  tl.to(models.iphone.rotation, {x:0, y:0, z:0}, '<');
  section +=2
  
  //due colorazioni
  tl.to(models.iphone.position, {x:-1, z:-85}, section)
  tl.to(models.iphone.scale, {x:0.5, y:0.5, z:0.5}, '<')
  tl.to(models.iphone.rotation, {y:-6.28}, '<');
  tl.fromTo(specta.rotation, {x:1, y:-0.12, z:-6.28}, {x:1, y:-0.12, z:0},'<')
  tl.fromTo(specta.position, {x:0, y:-1, z:-85}, {x:0, y:-1, z:0},'<')
  section+=2;
  
 

  
  /* //specta si appoggia alla basetta per ricaricarsi
  tl.to(specta.rotation, {x:1.57}, section)
  tl.to(specta.position, {y:0, z:0}, '<')
  tl.to(basetta.rotation, {x:1.57}, '<')
  section +=2

  //specta e la basetta si spostano a destra per lasciare spazio
  tl.to(specta.position, {x:5, duration:1}, section)
  tl.to(basetta.position, {x:5, duration:1}, '<') */


}   


gsap.timeline({
  scrollTrigger: {
    trigger: ".sec1",
    start: "-100% top",
    endTrigger: ".sec3",
    end: "center top",
    scrub: 1,
  }
}).to(".waves-container", {y:"-270vh"})
.to (".intro-text-container h1", {y: "-100vh"}, '<')



/* gsap.utils.toArray(".video-scrub").forEach(video => videoScrub(video, {
  scrollTrigger: {
    trigger: video,
    start: "center 50%-10px",
    end: "+=200%",
    pin: true,
  }

})); */

/* 
function videoScrub(video, vars) {
  video = gsap.utils.toArray(video)[0]; // in case selector text is fed in.
  let once = (el, event, fn) => {
        let onceFn = function () {
          el.removeEventListener(event, onceFn);
          fn.apply(this, arguments);
        };
        el.addEventListener(event, onceFn);
        return onceFn;
      },
      prepFunc = () => { video.play(); video.pause(); },
      prep = () => once(document.documentElement, "touchstart", prepFunc),
      src = video.currentSrc || video.src,
      tween = gsap.fromTo(video, {currentTime: 0}, {paused: true, immediateRender: false, currentTime: video.duration || 1, ease: "none", ...vars}),
      resetTime = () => (tween.vars.currentTime = video.duration || 1) && tween.invalidate();
  prep();
  video.readyState ? resetTime() : once(video, "loadedmetadata", resetTime);
  return tween;
} */














