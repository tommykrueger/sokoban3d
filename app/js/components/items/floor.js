//import THREE from 'three.js';

import Utils from '../../app/utils';
import Item from '../item';

export default class Floor extends Item {


	constructor (options = {}) {

    super(options);

		this.texture = this.materials.floor;
		//this.texture.wrapS = THREE.RepeatWrapping;
		//this.texture.wrapT = THREE.RepeatWrapping;

		this.material = new THREE.MeshBasicMaterial({
			map: this.texture,
  		color: 0x565656,
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
