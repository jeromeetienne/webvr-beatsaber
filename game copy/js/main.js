import GameEngine from '../engine/game-engine.js'
import GameObject from '../engine/game-object.js'
import GameObjectComponent from '../engine/game-object-component.js'
// import GameObjectManager from '../engine/game-object-manager.js'

import CubeGameObject from './cube-game-object.js'
import * as THREE from '../vendor/three.js/build/three.module.js';
import { BoxLineGeometry } from '../vendor/three.js/examples/jsm/geometries/BoxLineGeometry.js';

/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
//	
/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////


// init GameEngine
let gameEngine = new GameEngine()

// create room itself
let roomObject3D = new THREE.LineSegments(
	new BoxLineGeometry(6, 6, 6, 10, 10, 10).translate(0, 3, 0),
	new THREE.LineBasicMaterial({ color: 0x808080 })
);
gameEngine.scene.add(roomObject3D);

// add all cubes
let cubesObject3D = createAllCubes()
// for (let cubeObject3D of cubesObject3D) {
// 	roomObject3D.add(cubeObject3D)
// }

// start animation loop
gameEngine.renderer.setAnimationLoop(render)

for (let i = 0; i < 20; i++) {

	let cubeGameObject = new CubeGameObject()
	roomObject3D.add(cubeGameObject.object3D)
	gameEngine.addGameObject(cubeGameObject)
}

/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
//	render()
/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////

const clock = new THREE.Clock()
let INTERSECTED;
let raycaster = new THREE.Raycaster()


function render() {

	gameEngine.update()

	const deltaTime = clock.getDelta()

	/////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////
	//	When controller is selecting, reninit a cube
	/////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////

	if (gameEngine.controller.userData.isSelecting === true) {
		// take old cube
		let cubeObject3D = cubesObject3D.shift()
		let parentObject3D = cubeObject3D.parent
		parentObject3D.remove(cubeObject3D)

		// generate 'new' cube
		cubeObject3D.position.copy(gameEngine.controller.position)
		cubeObject3D.userData.velocity.x = (Math.random() - 0.5) * 0.02 * deltaTime * 60;
		cubeObject3D.userData.velocity.y = (Math.random() - 0.5) * 0.02 * deltaTime * 60;
		cubeObject3D.userData.velocity.z = (Math.random() * 0.01 - 0.05) * deltaTime * 60;
		cubeObject3D.userData.velocity.applyQuaternion(gameEngine.controller.quaternion)
		cubesObject3D.push(cubeObject3D)
		parentObject3D.add(cubeObject3D)
	}

	/////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////
	//	Intersections
	/////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////

	// find intersections

	const tempMatrix = new THREE.Matrix4()
	tempMatrix.identity().extractRotation(gameEngine.controller.matrixWorld)

	raycaster.ray.origin.setFromMatrixPosition(gameEngine.controller.matrixWorld)
	raycaster.ray.direction.set(0, 0, - 1).applyMatrix4(tempMatrix)

	const intersects = raycaster.intersectObjects(cubesObject3D)

	if (intersects.length > 0) {

		if (INTERSECTED != intersects[0].object) {

			if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.userData.currentHex)

			INTERSECTED = intersects[0].object;
			INTERSECTED.userData.currentHex = INTERSECTED.material.emissive.getHex()
			INTERSECTED.material.emissive.setHex(0xff0000)

		}

	} else {

		if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.userData.currentHex)

		INTERSECTED = undefined;

	}

	/////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////
	//	update all cubes
	/////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////

	updateAllCubes(deltaTime)

	/////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////
	//	renderer.render
	/////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////
	gameEngine.render()
}

/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
//	
/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////

function createAllCubes() {
	let cubesObject3D = []
	const geometry = new THREE.BoxBufferGeometry(0.15, 0.15, 0.15)

	for (let i = 0; i < 200; i++) {

		const cubeObject3D = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff }))

		cubeObject3D.position.x = Math.random() * 4 - 2;
		cubeObject3D.position.y = Math.random() * 4;
		cubeObject3D.position.z = Math.random() * 4 - 2;

		cubeObject3D.rotation.x = Math.random() * 2 * Math.PI;
		cubeObject3D.rotation.y = Math.random() * 2 * Math.PI;
		cubeObject3D.rotation.z = Math.random() * 2 * Math.PI;

		cubeObject3D.scale.x = Math.random() + 0.5;
		cubeObject3D.scale.y = Math.random() + 0.5;
		cubeObject3D.scale.z = Math.random() + 0.5;

		cubeObject3D.userData.velocity = new THREE.Vector3()
		cubeObject3D.userData.velocity.x = Math.random() * 0.01 - 0.005;
		cubeObject3D.userData.velocity.y = Math.random() * 0.01 - 0.005;
		cubeObject3D.userData.velocity.z = Math.random() * 0.01 - 0.005;

		cubesObject3D.push(cubeObject3D)
	}
	return cubesObject3D
}

/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
//	
/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////


/**
 * 
 * @param {number} deltaTime 
 */
function updateAllCubes(deltaTime) {
	for (let i = 0; i < cubesObject3D.length; i++) {

		const cubeObject3D = cubesObject3D[i];

		cubeObject3D.userData.velocity.multiplyScalar(1 - (0.001 * deltaTime))

		cubeObject3D.position.add(cubeObject3D.userData.velocity)

		if (cubeObject3D.position.x < - 3 || cubeObject3D.position.x > 3) {

			cubeObject3D.position.x = THREE.MathUtils.clamp(cubeObject3D.position.x, - 3, 3)
			cubeObject3D.userData.velocity.x = - cubeObject3D.userData.velocity.x;

		}

		if (cubeObject3D.position.y < 0 || cubeObject3D.position.y > 6) {

			cubeObject3D.position.y = THREE.MathUtils.clamp(cubeObject3D.position.y, 0, 6)
			cubeObject3D.userData.velocity.y = - cubeObject3D.userData.velocity.y;

		}

		if (cubeObject3D.position.z < - 3 || cubeObject3D.position.z > 3) {

			cubeObject3D.position.z = THREE.MathUtils.clamp(cubeObject3D.position.z, - 3, 3)
			cubeObject3D.userData.velocity.z = - cubeObject3D.userData.velocity.z;

		}

		cubeObject3D.rotation.x += cubeObject3D.userData.velocity.x * 2 * deltaTime;
		cubeObject3D.rotation.y += cubeObject3D.userData.velocity.y * 2 * deltaTime;
		cubeObject3D.rotation.z += cubeObject3D.userData.velocity.z * 2 * deltaTime;
	}
}