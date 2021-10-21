import './style.css'
import * as THREE from 'three'

import gsap from 'gsap'

import vertexShader from './shaders/vertex.glsl'
import fragmentShader from './shaders/fragment.glsl'
import athmosphereVertex from './shaders/athmosphereVertex.glsl'
import athmosphereFragment from './shaders/athmosphereFragment.glsl'
import { Float32BufferAttribute } from 'three'

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000)
const renderer = new THREE.WebGLRenderer({ antialias:true, canvas: document.querySelector('canvas') })
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)

camera.position.z = 70

/* STARTS HERE */

/* EARTH */
const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(10, 50, 50), 
  new THREE.ShaderMaterial({ 
   vertexShader, 
   fragmentShader,
   uniforms:{
     globeTexture: {
       value: new THREE.TextureLoader().load('/img/earth-map.jpg')
     }
   }
  }))

/* GLOWY */
const athmosphere = new THREE.Mesh(
  new THREE.SphereGeometry(5, 50, 50), 
  new THREE.ShaderMaterial({ 
    vertexShader: athmosphereVertex,
    fragmentShader: athmosphereFragment,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide
}))

athmosphere.scale.set(1.1,1.1,1.1)

scene.add(athmosphere)

const group = new THREE.Group()
group.add(sphere)
scene.add(group)

const mouse = {
  x:undefined,
  y:undefined
}

addEventListener('mousemove', (event)=>{
  mouse.x = (event.clientX / innerWidth) * 2 -1
  mouse.y = (event.clientY / innerHeight) * 2 -1
})

const starGeometry = new THREE.BufferGeometry()
const starMaterial = new THREE.PointsMaterial({colors: 0xffffff})
const stars = new THREE.Points(starGeometry, starMaterial)

const starVerticies = []
for (let i = 0; i < 4000; i++) {
  const x = (Math.random() - 0.5) * 4000 
  const y = (Math.random() - 0.5) * 4000
  const z = -Math.random() * 1000

  starVerticies.push(x,y,z)
}

starGeometry.setAttribute('position', new Float32BufferAttribute(starVerticies, 3))

scene.add(stars)

function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
  sphere.rotation.y -= .005
  sphere.rotation.x += .0005
 
  gsap.to(group.rotation, {
    x: mouse.x * -0.4,  
    y: mouse.x * 0.5,
    duration: 2 
  })
}

animate()