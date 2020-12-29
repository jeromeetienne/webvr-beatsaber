import * as THREE from '../vendor/three.js/build/three.module.js';
import GameObject from './game-object.js'
import GameEngine from './game-engine.js'

export default class GameObjectManager {

	/**
	 * 
	 * @param {GameEngine} gameEngine 
	 */
	constructor(gameEngine) {
		/** @type {GameObject[]} */
		this.gameObjects = [];

		this.gameEngine = gameEngine

		this._clock = new THREE.Clock()
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
		console.assert(gameObject.gameEngine === null)
		gameObject.gameEngine = this
		this.gameObjects.push(gameObject);
	}

	/**
	 * 
	 * @param {GameObject} gameObject 
	 */
	removeGameObject(gameObject) {
		const index = this.gameObjects.indexOf(gameObject);
		if (index === -1) return
		console.assert(gameObject.gameEngine !== null)
		this.gameObjects.splice(index, 1);
	}

	/////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////
	//	update()
	/////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////
	

	update() {
		const deltaTime = this._clock.getDelta()

		let gameObjects = [...this.gameObjects]
		for(let gameObject of gameObjects){
			gameObject.update(deltaTime)
		}
	}
}