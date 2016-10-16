import Utils from '../app/utils';
import Textures from '../helpers/textures';


export default class Item {


	constructor (options = {}) {

		this.options = options;
		this.app = this.options.app;
		this.level = this.options.level;

		this.utils = new Utils();
		this.textures = new Textures();

    // the three.js object of the item
    this.mesh;

    // means the player can interact with this item
    this.isInteractable = false;

		this.materials = {
			box: new THREE.TextureLoader().load( "img/textures/texture-box-small.jpg" ),
			floor: new THREE.TextureLoader().load( "img/textures/texture-floor-small.jpg" ),
			wall: new THREE.TextureLoader().load( "img/textures/texture-stone-small.jpg" )
		};

	}

  // to be implemented by extending class object
  render () {}



  /**
   * Animate all the child elements of this level
   */
  animate (clock) {

    // define custom item based animation function here

  }


  move (targetPosition) {

    this.mesh.position.x = targetPosition.x;
    // this.mesh.position.y = targetPosition.y;
    this.mesh.position.z = targetPosition.z;

  }


  setFloorPosition (position) {

    this.mesh.position.y = position;

  }


  getMesh() {

    return this.mesh;

  }


}
