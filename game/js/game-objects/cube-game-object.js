import ControllerGameObject from './controller-game-object.js'

// import GameEngine
import GameEngine from '../../engine/game-engine.js'
import GameObject from '../../engine/game-object.js'

// import three.js
import * as THREE from '../../vendor/three.js/build/three.module.js';

const cubeGeometry = new THREE.BoxBufferGeometry(0.15, 0.15, 0.15)

export default class CubeGameObject extends GameObject {
	/**
	 * 
	 * @param {GameEngine} gameEngine 
	 */
	constructor(gameEngine) {
		super(gameEngine)


		/////////////////////////////////////////////////////////////////////////////////////
		/////////////////////////////////////////////////////////////////////////////////////
		//	
		/////////////////////////////////////////////////////////////////////////////////////
		/////////////////////////////////////////////////////////////////////////////////////

		const audioLoader = new THREE.AudioLoader();
		this.positionalAudio = new THREE.PositionalAudio(this.gameEngine.audioListener);
		audioLoader.load('sounds/ping_pong.mp3', (buffer) => {
			this.positionalAudio.setBuffer(buffer);
		})

		/**
		 * Possible way to use promise here. and avoid to have one buffer per GameObject
		 * - if you have audioBuffer !== null, so promise has been settled, so set audioBuffer
		 * - else audioBufferPromise === null, so you create a promise which load the buffer 
		 * - else you have audioBufferPromise !== null, so you do .then(), and set audioBuffer
		 */


		/////////////////////////////////////////////////////////////////////////////////////
		/////////////////////////////////////////////////////////////////////////////////////
		//	
		/////////////////////////////////////////////////////////////////////////////////////
		/////////////////////////////////////////////////////////////////////////////////////

		let material = new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff })
		const mesh = new THREE.Mesh(cubeGeometry, material)
		this.object3D.add(mesh)

		this.object3D.position.x = THREE.MathUtils.randFloat(-1, +1)
		this.object3D.position.y = THREE.MathUtils.randFloat(1.2, 2)
		this.object3D.position.z = THREE.MathUtils.randFloat(-3, -1)


		/////////////////////////////////////////////////////////////////////////////////////
		/////////////////////////////////////////////////////////////////////////////////////
		//	
		/////////////////////////////////////////////////////////////////////////////////////
		/////////////////////////////////////////////////////////////////////////////////////

		this.object3D.userData.velocity = new THREE.Vector3()
		this.object3D.userData.velocity.x = 0;
		this.object3D.userData.velocity.y = 0
		this.object3D.userData.velocity.z = 0.5
	}


	/////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////
	//	
	/////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////

	onUpdate() {
		let deltaTime = this.gameEngine.updateData.deltaTime

		this.object3D.position.add(this.object3D.userData.velocity.clone().multiplyScalar(deltaTime))

		if (this.object3D.position.z > 1) {
			this.object3D.position.z = THREE.MathUtils.randFloat(-3, -1)
		}
	}


	/////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////
	//	
	/////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////

	/**
	 * 
	 * @param {ControllerGameObject} controllerGameObject 
	 */
	resetPosition(controllerGameObject) {
		this.object3D.position.copy(controllerGameObject.controller.position)
		this.object3D.userData.velocity.applyQuaternion(controllerGameObject.controller.quaternion)
	}
}