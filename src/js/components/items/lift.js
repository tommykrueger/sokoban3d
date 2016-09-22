import THREE from 'three.js';

import Item from '../item';

export default class Lift extends Item {


	constructor (options = {}) {

    super(options);

    this.app = options.app;
    this.liftMeshes = [];

		this.material = new THREE.MeshLambertMaterial({
  		color: 0x90ff00, 
  		transparent: false,
  		opacity: 1,
  		side: THREE.DoubleSide,
  		blending: THREE.AdditiveBlending 
  	});

	}
 

  render () {

    this.mesh = new THREE.Mesh(
      new THREE.BoxGeometry(1, .1, 1),
      this.material
    );

    // this.mesh.castShadow = true;
    this.mesh.position.set(this.options.position.x, -.3, this.options.position.z);
    this.mesh.objectType = 'lift';

  }


  setFloorPosition (position) {
    
    this.mesh.position.y = position - .3;

  }


  /**
   * Animate all the child elements of this level
   */
  animate (clock) {}

}