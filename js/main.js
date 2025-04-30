'use strict'

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'


console.log(THREE);


let scene = new THREE.Scene();


let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.001, 1000);

camera.position.z = 5;


let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let controls = new OrbitControls(camera, renderer.domElement);


let cubes = [];
let width = 100;
let height = 100;

for (let x = 0; x < width; x++) {
	for (let y = 0; y < height; y++) {
		let geometry = new THREE.BoxGeometry(.005, .005, .005);
		let material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
		let cube = new THREE.Mesh(geometry, material);
		cube.position.x = x / width;
		cube.position.y = y / height;
		scene.add(cube);

		if (cubes[x] === undefined) {
			cubes[x] = [];
		}
		cubes[x].push(cube)
	}
}

console.log(cubes)


function OnWindowResize(e) {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);

}

console.log(perlin)
perlin.seed()

function animate(time) {

	for (let x = 0; x < cubes.length; x++) {
		for (let y = 0; y < cubes[x].length; y++) {

			let value = perlin.get((x + (Math.cos(time / 10000) * 5)) / cubes.length, (y + (Math.sin(time / 10000) * 5)) / cubes[x].length);


			cubes[x][y].rotation.x = value * 10;
			cubes[x][y].position.z = value * .5;

		}
	}

	perlin.memory = {}


	//cube.rotation.x += 0.01;
	//cube.rotation.y += 0.01;
	renderer.render(scene, camera);
}



window.addEventListener("resize", OnWindowResize);

renderer.setAnimationLoop(animate);
