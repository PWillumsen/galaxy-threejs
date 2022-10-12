import "./style.css";
import * as THREE from "three";
import GUI from "lil-gui";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import particleTextureImg from "./textures/particles/1.png"


const canvas = document.getElementById("webgl");
const params = {}
const sizes = {width: window.innerWidth, height: window.innerHeight }


// GUI
const gui = new GUI() 


// Scene
const scene = new THREE.Scene();


// Renderer
const renderer = new THREE.WebGLRenderer({canvas: canvas as HTMLCanvasElement});
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


// Camera
const camera = new THREE.PerspectiveCamera( 75, sizes.width / sizes.height, 0.1, 1000 );
const controls = new OrbitControls(camera, canvas as HTMLCanvasElement)
controls.enableDamping = true
camera.position.z = 10;
scene.add(camera)

window.addEventListener("resize", () => {
      // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  }
)

window.addEventListener("dblclick", () => {

  const fullScreenElement = document.fullscreenElement || document.webkitFullscreenElement;

  if (!fullScreenElement) {
    if (canvas.requestFullscreen) {
      canvas.requestFullscreen();
    } else if (canvas.webkitRequestFullscreen) {
      canvas.webkitRequestFullscreen()
    }
  } else {

    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen()
    }
  }
})


/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const particleTexture = textureLoader.load(particleTextureImg)


/**
 * Particles
 */
// Geometry
const particlesGeometry = new THREE.BufferGeometry()
const count = 50000

const positions = new Float32Array(count * 3)
const colors = new Float32Array(count * 3)

for(let i = 0; i < count; i++)
{
  const i3 = i * 3;
  
  positions[i3] = (Math.random() - 0.5) * 10
  positions[i3 + 1] = (Math.random() - 0.5) * 10
  positions[i3 + 2] = 0;
  colors[i3] = Math.random()
  colors[i3 + 1] = Math.random()
  colors[i3 + 2] = Math.random()
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

// Material
const particlesMaterial = new THREE.PointsMaterial()

particlesMaterial.size = 0.1
particlesMaterial.sizeAttenuation = true

particlesMaterial.color = new THREE.Color()

particlesMaterial.transparent = true
particlesMaterial.alphaMap = particleTexture
// particlesMaterial.alphaTest = 0.01
// particlesMaterial.depthTest = false
particlesMaterial.depthWrite = false
particlesMaterial.blending = THREE.AdditiveBlending

particlesMaterial.vertexColors = true

// Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles)


// Animate
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()