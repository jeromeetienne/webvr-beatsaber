import SaberGame from './saber-game.js'

import GameEngine from '../engine/game-engine.js'
import GameObject from '../engine/game-object.js'

import * as THREE from '../vendor/three.js/build/three.module.js';
import { XRControllerModelFactory } from '../vendor/three.js/examples/jsm/webxr/XRControllerModelFactory.js';
import CubeGameObject from './cube-game-object.js';

const cubeGeometry = new THREE.BoxBufferGeometry(0.15, 0.15, 0.15)
let raycaster = new THREE.Raycaster()

export default class ControllerGameObject extends GameObject {
	/**
	 * 
	 * @param {GameEngine} gameEngine 
	 * @param {number} controllerIndex
	 */
	constructor(gameEngine, controllerIndex) {
		super(gameEngine)

		this._intersectedObject3D = null

		let controller = this.gameEngine.renderer.xr.getController(controllerIndex);
		this.controller = controller
		this.gameEngine.scene.add(controller);

		let controllerObject3D = null
		controller.addEventListener('connected', function (event) {
			let xrInputSource = event.data
			if (xrInputSource.targetRayMode === 'tracked-pointer') {
				let geometry = new THREE.BufferGeometry();
				geometry.setAttribute('position', new THREE.Float32BufferAttribute([0, 0, 0, 0, 0, - 1], 3));
				geometry.setAttribute('color', new THREE.Float32BufferAttribute([0.5, 0.5, 0.5, 0, 0, 0], 3));
				let material = new THREE.LineBasicMaterial({ vertexColors: true, blending: THREE.AdditiveBlending });
				controllerObject3D = new THREE.Line(geometry, material);
			} else if (xrInputSource.targetRayMode === 'gaze') {
				let geometry = new THREE.RingBufferGeometry(0.02, 0.04, 32).translate(0, 0, - 1);
				let material = new THREE.MeshBasicMaterial({ opacity: 0.5, transparent: true });
				controllerObject3D = new THREE.Mesh(geometry, material);
			}
			this.add(controllerObject3D);
		});
		controller.addEventListener('disconnected', function () {
			this.remove(controllerObject3D);
		});


		// add controlerModel to controllerGrip 0
		let controllerGrip = this.gameEngine.renderer.xr.getControllerGrip(controllerIndex);
		const controllerModelFactory = new XRControllerModelFactory();
		let controlerModel = controllerModelFactory.createControllerModel(controllerGrip)
		controllerGrip.add(controlerModel);
		this.gameEngine.scene.add(controllerGrip)

		// set controller.userData.isSelecting to true when controller is using select button
		controller.addEventListener('selectstart', function onSelectStart() {
			controller.userData.isSelecting = true;
		})
		controller.addEventListener('selectend', function onSelectEnd() {
			controller.userData.isSelecting = false;
		})
	}

	onUpdate() {
		/** @type {SaberGame} */
		let saberGame = this.gameEngine.userData.saberGame

		// if this.controller is not selecting, return now
		if (this.controller.userData.isSelecting === true) {

			// take old cube
			let cubeGameObject = saberGame.cubesGameObjects.shift()
			let parentObject3D = cubeGameObject.object3D.parent
			parentObject3D.remove(cubeGameObject.object3D)

			// generate 'new' cube
			cubeGameObject.resetPosition(this)
			saberGame.cubesGameObjects.push(cubeGameObject)
			parentObject3D.add(cubeGameObject.object3D)

		}


		/////////////////////////////////////////////////////////////////////////////////////
		/////////////////////////////////////////////////////////////////////////////////////
		//	intersections
		/////////////////////////////////////////////////////////////////////////////////////
		/////////////////////////////////////////////////////////////////////////////////////

		// setup raycaster
		raycaster.ray.origin.setFromMatrixPosition(this.controller.matrixWorld)
		const tempMatrix = new THREE.Matrix4()
		tempMatrix.identity().extractRotation(this.controller.matrixWorld)
		raycaster.ray.direction.set(0, 0, - 1).applyMatrix4(tempMatrix)

		for (let cubeGameObject of saberGame.cubesGameObjects) {
			let intersects = raycaster.intersectObject(cubeGameObject.object3D, true)
			// let intersects = []
			// console.log(intersects)
			let intersectingWithSaber = intersects.length > 0 ? true : false

			if (intersectingWithSaber === true) {
				cubeGameObject.positionalAudio.play()
				cubeGameObject.object3D.position.x = Math.random() * 4 - 2;
				cubeGameObject.object3D.position.y = Math.random() * 4;
				cubeGameObject.object3D.position.z = Math.random() * 4 - 2;
			}
		}
	}
}