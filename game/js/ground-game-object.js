import ControllerGameObject from './controller-game-object.js'

// import GameEngine
import GameEngine from '../engine/game-engine.js'
import GameObject from '../engine/game-object.js'

// import three.js
import * as THREE from '../vendor/three.js/build/three.module.js';

const cubeGeometry = new THREE.BoxBufferGeometry(0.15, 0.15, 0.15)

export default class GroundGameObject extends GameObject {
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

		var geometry = new THREE.BoxBufferGeometry(2, 0.2, 3 + 1);

		// const textureLoader = new THREE.TextureLoader();
		var texture = new THREE.TextureLoader().load('./images/uv_grid_opengl.jpg');
		texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
		texture.repeat.set(1, 1);
		var material = new THREE.MeshBasicMaterial({
			map: texture,
		});
		var mesh = new THREE.Mesh(geometry, material);

		this.object3D.add(mesh)

		this.object3D.position.x = 0
		this.object3D.position.y = -geometry.parameters.height / 2
		this.object3D.position.z = -1.5
	}


	/////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////
	//	
	/////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////

	onUpdate() {
		let deltaTime = this.gameEngine.updateData.deltaTime
		let mesh = this.object3D.children[0]
		let geometry = mesh.geometry
		let texture = mesh.material.map

		let speed = 0.5 / geometry.parameters.depth
		texture.offset.y += speed * deltaTime
	}
}