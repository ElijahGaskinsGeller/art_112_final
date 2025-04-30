'use strict';
let perlin = {
	rand_vect: function() {
		let theta = Math.random() * 2 * Math.PI;
		return { x: Math.cos(theta), y: Math.sin(theta) };
	},
	dot_prod_grid: function(x, y, vx, vy) {
		let g_vect;
		let d_vect = { x: x - vx, y: y - vy };
		if (this.gradients[[vx, vy]]) {
			g_vect = this.gradients[[vx, vy]];
		} else {
			g_vect = this.rand_vect();
			this.gradients[[vx, vy]] = g_vect;
		}
		return d_vect.x * g_vect.x + d_vect.y * g_vect.y;
	},
	smootherstep: function(x) {
		return 6 * x ** 5 - 15 * x ** 4 + 10 * x ** 3;
	},
	interp: function(x, a, b) {
		return a + this.smootherstep(x) * (b - a);
	},
	seed: function() {
		this.gradients = {};
		this.memory = {};
	},
	get: function(x, y) {
		if (this.memory.hasOwnProperty([x, y]))
			return this.memory[[x, y]];
		let xf = Math.floor(x);
		let yf = Math.floor(y);
		//interpolate
		let tl = this.dot_prod_grid(x, y, xf, yf);
		let tr = this.dot_prod_grid(x, y, xf + 1, yf);
		let bl = this.dot_prod_grid(x, y, xf, yf + 1);
		let br = this.dot_prod_grid(x, y, xf + 1, yf + 1);
		let xt = this.interp(x - xf, tl, tr);
		let xb = this.interp(x - xf, bl, br);
		let v = this.interp(y - yf, xt, xb);
		this.memory[[x, y]] = v;
		return v;
	}
}
perlin.seed();


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
