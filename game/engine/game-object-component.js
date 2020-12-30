import GameObject from './game-object.js'

// Base for all components
export default class GameComponent {
	/**
	 * 
	 * @param {GameObject} gameObject 
	 */
	constructor(gameObject) {
		this.gameObject = gameObject;
	}

	onUpdate() {
	}
}