import THREE from 'three.js';

import Utils from '../../app/utils';
import Item from '../item';

export default class Floor extends Item {


	constructor (options = {}) {

    super(options);

		this.material = new THREE.MeshLambertMaterial({
  		color: 0x363636, 
  		transparent: false,
  		opacity: 1,
  		side: THREE.DoubleSide,
  		blending: THREE.AdditiveBlending 
  	});

	}
 

  render () {

    this.mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(1, 1),
      this.material
    );

    this.mesh.receiveShadow = true;
    this.mesh.rotation.x = Math.PI / 2;

    this.mesh.position.set(this.options.position.x, 0, this.options.position.z);
    this.mesh.objectType = 'floor';

  }


  /**
   * Animate all the child elements of this level
   */
  animate (clock) {}

}