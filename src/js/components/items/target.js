import THREE from 'three.js';

import Utils from '../../app/utils';
import Item from '../item';

export default class Target extends Item {


	constructor (options = {}) {

    super(options);

		this.material = new THREE.MeshLambertMaterial({
  		color: 0x11ee11, 
  		transparent: false,
  		opacity: 1,
  		side: THREE.DoubleSide,
  		blending: THREE.AdditiveBlending 
  	});

	}
 

  render () {

    this.mesh = new THREE.Mesh(
      new THREE.BoxGeometry(.96, .001, .96),
      this.material
    );

    this.mesh.receiveShadow = true;
    this.mesh.position.set(this.options.position.x, .001/2, this.options.position.z);
    this.mesh.objectType = 'target';

  }


  /**
   * Animate all the child elements of this level
   */
  animate (clock) {}

}