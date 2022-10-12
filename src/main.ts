import "./style.css";
import * as THREE from "three";
import GUI from "lil-gui";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { normDist } from "./normDist";


const canvas = document.getElementById("webgl");
const params = { 
  count: 50000, 
  radius: 5, 
  size: 0.01, 
  branches: 6, 
  innerColor: "#ff9500", 
  outerColor: "#0000ff", 
  spin: 1, 
  spread: 0.05
}
const sizes = { width: window.innerWidth, height: window.innerHeight }


// Scene
const scene = new THREE.Scene();


// Renderer
const renderer = new THREE.WebGLRenderer({ canvas: canvas as HTMLCanvasElement });
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000);
const controls = new OrbitControls(camera, canvas as HTMLCanvasElement)
controls.enableDamping = true
camera.position.set(3,3,3);
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

/**
 * Particles
 */
// Geometry

let geometry: THREE.BufferGeometry | null = null;
let material: THREE.PointsMaterial | null = null;
let points: THREE.Points | null = null;

const generateGalaxy = () => {

  if (points !== null) {
    geometry?.dispose();
    material?.dispose();
    scene.remove(points);
  }

  const particlesGeometry = new THREE.BufferGeometry()

  const positions = new Float32Array(params.count * 3)
  const colors = new Float32Array(params.count * 3)
  
  const colorInside = new THREE.Color(params.innerColor);
  const colorOutside = new THREE.Color(params.outerColor);
  
  
  for (let i = 0; i < params.count; i++) {

    const i3 = i * 3;
    const radius = Math.random() * params.radius;
    const branchAngle = (i % params.branches) / params.branches * Math.PI * 2;
    const spinAngle = params.spin * radius
    
    const randX = normDist(0, params.spread) * (params.radius +0.2 - radius)
    const randY = normDist(0, params.spread) * (params.radius +0.2 - radius)
    const randZ = normDist(0, params.spread) * (params.radius +0.2 - radius)
    
    
    positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randX
    positions[i3 + 1] = randY
    positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randZ;


    // Color
    
    const color = colorInside.clone();
    color.lerp(colorOutside, radius / params.radius)
    
    colors[i3] = color.r
    colors[i3 + 1] = color.g
    colors[i3 + 2] = color.b
  }
  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  // Material
  material = new THREE.PointsMaterial()

  material.size = params.size;
  material.sizeAttenuation = true
  material.blending = THREE.AdditiveBlending
  material.vertexColors = true
  material.depthWrite = true;

  // Points
  points = new THREE.Points(particlesGeometry, material)
  scene.add(points)
}

// GUI
const gui = new GUI()
gui.add(params, "count").min(1000).max(100000).step(1000).onFinishChange( generateGalaxy);
gui.add(params, "radius").min(1).max(10).step(1).onFinishChange(generateGalaxy)
gui.add(params, "size").min(0.001).max(0.1).step(0.001).onFinishChange(generateGalaxy)
gui.add(params, "branches").min(2).max(10).step(1).onFinishChange(generateGalaxy)
gui.add(params, "spin").min(-3).max(3).step(0.01).onFinishChange(generateGalaxy)
gui.add(params, "spread").min(0).max(0.1).step(0.001).onFinishChange(generateGalaxy)
gui.addColor(params, "innerColor").onFinishChange(generateGalaxy);
gui.addColor(params, "outerColor").onFinishChange(generateGalaxy);


generateGalaxy()

// Animate
// const clock = new THREE.Clock()

const animate = () => {
  // const elapsedTime = clock.getElapsedTime()

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(animate)
}

animate()