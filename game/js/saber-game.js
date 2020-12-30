import GameEngine from '../engine/game-engine.js'
import CubeGameObject from './game-objects/cube-game-object.js'
import ControllerGameObject from './game-objects/controller-game-object.js'
import GroundGameObject from './game-objects/ground-game-object.js'
import TubeGameObject from './game-objects/tube-game-object.js'

// import three.js
import * as THREE from '../vendor/three.js/build/three.module.js';
import { BoxLineGeometry } from '../vendor/three.js/examples/jsm/geometries/BoxLineGeometry.js';

export default class SaberGame {
	/////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////
	//	constructor()
	/////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////

	constructor() {
		// init gameEngine
		this.gameEngine = new GameEngine()
		this.gameEngine.userData.saberGame = this

		/////////////////////////////////////////////////////////////////////////////////////
		/////////////////////////////////////////////////////////////////////////////////////
		//	Lights
		/////////////////////////////////////////////////////////////////////////////////////
		/////////////////////////////////////////////////////////////////////////////////////

		this.gameEngine.scene.add(new THREE.HemisphereLight(0x606060, 0x404040));

		const light = new THREE.DirectionalLight(0xffffff);
		light.position.set(1, 1, 1).normalize();
		this.gameEngine.scene.add(light);

		// create roomObject3D
		this.roomObject3D = new THREE.LineSegments(
			new BoxLineGeometry(6, 6, 6, 12, 12, 12).translate(0, 3, 0),
			new THREE.LineBasicMaterial({ color: 0x808080 })
		);
		this.gameEngine.scene.add(this.roomObject3D);

		var geometry = new THREE.CubeGeometry( 10000, 10000, 10000 );
		var material = new THREE.MeshBasicMaterial( { color: 0x9999ff, side: THREE.BackSide } );
		var skyBox = new THREE.Mesh( geometry, material );

		// add all the cubes
		/** @type {CubeGameObject[]} */
		this.cubesGameObjects = []
		for (let i = 0; i < 200; i++) {
			let cubeGameObject = new CubeGameObject(this.gameEngine)
			this.roomObject3D.add(cubeGameObject.object3D)
			this.gameEngine.addGameObject(cubeGameObject)
			this.cubesGameObjects.push(cubeGameObject)
		}


		let groundGameObject = new GroundGameObject(this.gameEngine)
		this.roomObject3D.add(groundGameObject.object3D)
		this.gameEngine.addGameObject(groundGameObject)

		let tubeGameObject = new TubeGameObject(this.gameEngine)
		this.roomObject3D.add(tubeGameObject.object3D)
		this.gameEngine.addGameObject(tubeGameObject)

		/////////////////////////////////////////////////////////////////////////////////////
		/////////////////////////////////////////////////////////////////////////////////////
		//	ControllerGameObject
		/////////////////////////////////////////////////////////////////////////////////////
		/////////////////////////////////////////////////////////////////////////////////////
		
		let controllerGameObject0 = new ControllerGameObject(this.gameEngine, 0)
		this.controllerGameObject0 = controllerGameObject0
		this.gameEngine.addGameObject(controllerGameObject0)
		let controllerGameObject1 = new ControllerGameObject(this.gameEngine, 1)
		this.controllerGameObject1 = controllerGameObject1
		this.gameEngine.addGameObject(controllerGameObject1)
	}


	/////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////
	//	start()
	/////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////

	/**
	 * start the game
	 */
	start() {

		// start animation loop
		this.gameEngine.renderer.setAnimationLoop(() => {
			this.gameEngine.updateGameObjects()
			this.gameEngine.render()
		})
	}
}