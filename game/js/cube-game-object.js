import GameObject from '../engine/game-object.js'

import * as THREE from '../vendor/three.js/build/three.module.js';

const cubeGeometry = new THREE.BoxBufferGeometry(0.15, 0.15, 0.15)

export default class CubeObject extends GameObject {
	constructor(){
		super()

		let material = new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff })
		const mesh = new THREE.Mesh(cubeGeometry, material)
		this.object3D.add(mesh)

		this.object3D.position.x = Math.random() * 4 - 2;
		this.object3D.position.y = Math.random() * 4;
		this.object3D.position.z = Math.random() * 4 - 2;

		this.object3D.rotation.x = Math.random() * 2 * Math.PI;
		this.object3D.rotation.y = Math.random() * 2 * Math.PI;
		this.object3D.rotation.z = Math.random() * 2 * Math.PI;

		this.object3D.scale.x = Math.random() + 0.5;
		this.object3D.scale.y = Math.random() + 0.5;
		this.object3D.scale.z = Math.random() + 0.5;

		this.object3D.userData.velocity = new THREE.Vector3()
		this.object3D.userData.velocity.x = Math.random() * 0.01 - 0.005;
		this.object3D.userData.velocity.y = Math.random() * 0.01 - 0.005;
		this.object3D.userData.velocity.z = Math.random() * 0.01 - 0.005;

	}


	/////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////
	//	
	/////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////
	
	update(){
		let deltaTime = this.gameEngine.deltaTime
		// console.log('deltaTime', deltaTime)
		this.object3D.userData.velocity.multiplyScalar(1 - (0.001 * deltaTime))

		this.object3D.position.add(this.object3D.userData.velocity)

		if (this.object3D.position.x < - 3 || this.object3D.position.x > 3) {

			this.object3D.position.x = THREE.MathUtils.clamp(this.object3D.position.x, - 3, 3)
			this.object3D.userData.velocity.x = - this.object3D.userData.velocity.x;

		}

		if (this.object3D.position.y < 0 || this.object3D.position.y > 6) {

			this.object3D.position.y = THREE.MathUtils.clamp(this.object3D.position.y, 0, 6)
			this.object3D.userData.velocity.y = - this.object3D.userData.velocity.y;

		}

		if (this.object3D.position.z < - 3 || this.object3D.position.z > 3) {

			this.object3D.position.z = THREE.MathUtils.clamp(this.object3D.position.z, - 3, 3)
			this.object3D.userData.velocity.z = - this.object3D.userData.velocity.z;

		}

		this.object3D.rotation.x += this.object3D.userData.velocity.x * 2 * deltaTime;
		this.object3D.rotation.y += this.object3D.userData.velocity.y * 2 * deltaTime;
		this.object3D.rotation.z += this.object3D.userData.velocity.z * 2 * deltaTime;
	}


	/////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////
	//	
	/////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////
	
	resetPosition(){
		this.object3D.position.copy(this.gameEngine.controller.position)
		this.object3D.userData.velocity.x = (Math.random() - 0.5) * 0.02
		this.object3D.userData.velocity.y = (Math.random() - 0.5) * 0.02
		this.object3D.userData.velocity.z = Math.random() * 0.01 - 0.05
		this.object3D.userData.velocity.applyQuaternion(this.gameEngine.controller.quaternion)
	}
}