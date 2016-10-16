//import THREE from 'three.js';

import Utils from '../../app/utils';
import Item from '../item';

export default class Key extends Item {


	constructor (options = {}) {

    super(options);

    this.height = 1;
    this.margin = .05;

		this.material = new THREE.MeshLambertMaterial({
  		color: 0x5656cc,
  		transparent: false,
  		opacity: 1,
  		//side: THREE.DoubleSide,
  		blending: THREE.AdditiveBlending
  	});

	}


  render () {

    this.mesh = new THREE.Mesh(
      new THREE.BoxGeometry(.96, .001, .96),
      this.material
    );

    this.mesh.castShadow = true;
    this.mesh.position.set(this.options.position.x, .001/2, this.options.position.z);
    this.mesh.objectType = 'box';

  }


  /**
   * Animate all the child elements of this level
   */
  animate (clock) {}

}
