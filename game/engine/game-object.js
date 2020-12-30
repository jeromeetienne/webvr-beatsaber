import GameEngine from './game-engine.js'
import GameObjectComponent from './game-object-component.js'

import * as THREE from '../vendor/three.js/build/three.module.js';

export default class GameObject {
	/**
	 * 
	 * @param {GameEngine} gameEngine 
	 */
	constructor(gameEngine) {
		this.gameEngine = gameEngine
		this.components = [];
		this.object3D = new THREE.Object3D();
		this.object3D.userData.gameObject = this
	}

	async init(){

	}

	/////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////
	//	
	/////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////

	addComponent(ComponentType, ...args) {
		const component = new ComponentType(this, ...args);
		this.components.push(component);
		return component;
	}
	removeComponent(component) {
		const index = this.components.indexOf(component);
		if (index === -1) return
		this.components.splice(index, 1);
	}
	getComponent(ComponentType) {
		return this.components.find(c => c instanceof ComponentType);
	}

	updateComponents() {
		let components = [...this.components]
		for (const component of components) {
			component.update();
		}
	}

	/////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////
	//	
	/////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////
	
	// TODO to rename onUpdate()
	update(){
		
	}
}