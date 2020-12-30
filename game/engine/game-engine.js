import GameObject from './game-object.js'

import * as THREE from '../vendor/three.js/build/three.module.js';
import { VRButton } from '../vendor/three.js/examples/jsm/webxr/VRButton.js';
import { XRControllerModelFactory } from '../vendor/three.js/examples/jsm/webxr/XRControllerModelFactory.js';

export default class GameEngine {
	constructor() {
		this.userData = {}

		this.scene = null
		this.renderer = null
		this.camera = null
		// this.controller = null	// TODO remove controller

		/** @type {GameObject[]} */
		this.gameObjects = [];
		this._clock = new THREE.Clock()

		this.updateData = {
			deltaTime : 1/60
		}

		this._init()
	}

	/////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////
	//	
	/////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////
	
	_init(){
		/////////////////////////////////////////////////////////////////////////////////////
		/////////////////////////////////////////////////////////////////////////////////////
		//	
		/////////////////////////////////////////////////////////////////////////////////////
		/////////////////////////////////////////////////////////////////////////////////////

		let container = document.createElement('div')
		document.body.appendChild(container)

		/////////////////////////////////////////////////////////////////////////////////////
		/////////////////////////////////////////////////////////////////////////////////////
		//	scene/camera
		/////////////////////////////////////////////////////////////////////////////////////
		/////////////////////////////////////////////////////////////////////////////////////

		this.scene = new THREE.Scene()
		let scene = this.scene
		scene.background = new THREE.Color(0x505050)

		this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 10)
		let camera = this.camera
		camera.position.set(0, 1.6, 3)
		scene.add(camera)

		// create an AudioListener and add it to the camera
		const audioListener = new THREE.AudioListener();
		this.audioListener = audioListener
		this.camera.add( audioListener );

		/////////////////////////////////////////////////////////////////////////////////////
		/////////////////////////////////////////////////////////////////////////////////////
		//	Renderer
		/////////////////////////////////////////////////////////////////////////////////////
		/////////////////////////////////////////////////////////////////////////////////////

		this.renderer = new THREE.WebGLRenderer({ antialias: true });
		let renderer = this.renderer
		renderer.setPixelRatio(window.devicePixelRatio);
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.outputEncoding = THREE.sRGBEncoding;
		renderer.xr.enabled = true;
		container.appendChild(renderer.domElement);


		// /////////////////////////////////////////////////////////////////////////////////////
		// /////////////////////////////////////////////////////////////////////////////////////
		// //	controller
		// /////////////////////////////////////////////////////////////////////////////////////
		// /////////////////////////////////////////////////////////////////////////////////////
		// // TODO remove controller

		// this.controller = renderer.xr.getController(0);
		// let controller = this.controller
		// scene.add(controller);

		// let controllerObject3D = null
		// controller.addEventListener('connected', function (event) {
		// 	let xrInputSource = event.data
		// 	if (xrInputSource.targetRayMode === 'tracked-pointer') {
		// 		let geometry = new THREE.BufferGeometry();
		// 		geometry.setAttribute('position', new THREE.Float32BufferAttribute([0, 0, 0, 0, 0, - 1], 3));
		// 		geometry.setAttribute('color', new THREE.Float32BufferAttribute([0.5, 0.5, 0.5, 0, 0, 0], 3));
		// 		let material = new THREE.LineBasicMaterial({ vertexColors: true, blending: THREE.AdditiveBlending });
		// 		controllerObject3D = new THREE.Line(geometry, material);
		// 	} else if (xrInputSource.targetRayMode === 'gaze') {
		// 		let geometry = new THREE.RingBufferGeometry(0.02, 0.04, 32).translate(0, 0, - 1);
		// 		let material = new THREE.MeshBasicMaterial({ opacity: 0.5, transparent: true });
		// 		controllerObject3D = new THREE.Mesh(geometry, material);
		// 	}
		// 	this.add(controllerObject3D);
		// });
		// controller.addEventListener('disconnected', function () {
		// 	this.remove(controllerObject3D);
		// });


		// // add controlerModel to controllerGrip 0
		// let controllerGrip = renderer.xr.getControllerGrip(0);
		// const controllerModelFactory = new XRControllerModelFactory();
		// let controlerModel = controllerModelFactory.createControllerModel(controllerGrip)
		// controllerGrip.add(controlerModel);
		// scene.add(controllerGrip)

		// // set controller.userData.isSelecting to true when controller is using select button
		// controller.addEventListener('selectstart', function onSelectStart() {
		// 	controller.userData.isSelecting = true;
		// })
		// controller.addEventListener('selectend', function onSelectEnd() {
		// 	controller.userData.isSelecting = false;
		// })

		/////////////////////////////////////////////////////////////////////////////////////
		/////////////////////////////////////////////////////////////////////////////////////
		//	window resize
		/////////////////////////////////////////////////////////////////////////////////////
		/////////////////////////////////////////////////////////////////////////////////////

		window.addEventListener('resize', function onWindowResize() {
			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix()

			renderer.setSize(window.innerWidth, window.innerHeight)
		}, false)

		/////////////////////////////////////////////////////////////////////////////////////
		/////////////////////////////////////////////////////////////////////////////////////
		//	VRButton
		/////////////////////////////////////////////////////////////////////////////////////
		/////////////////////////////////////////////////////////////////////////////////////

		// add VRButton
		document.body.appendChild(VRButton.createButton(renderer))
	}
	
	/////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////
	//	
	/////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////
	
	/**
	 * Render the scene
	 */
	render(){
		this.renderer.render(this.scene, this.camera)	
	}

	/////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////
	//	GameObject
	/////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////
	
	/**
	 * 
	 * @param {GameObject} gameObject 
	 */
	addGameObject(gameObject) {
		this.gameObjects.push(gameObject);
	}

	/**
	 * 
	 * @param {GameObject} gameObject 
	 */
	removeGameObject(gameObject) {
		const index = this.gameObjects.indexOf(gameObject);
		if (index === -1) return
		this.gameObjects.splice(index, 1);
	}

	/////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////
	//	update()
	/////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////
	

	updateGameObjects() {
		this.updateData.deltaTime = this._clock.getDelta()

		let gameObjects = [...this.gameObjects]
		for(let gameObject of gameObjects){
			gameObject.updateComponents()
			gameObject.update()
		}

		this.updateData.deltaTime = null
	}
}
