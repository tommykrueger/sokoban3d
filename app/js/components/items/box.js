//import THREE from 'three.js';

import Utils from '../../app/utils';
import Item from '../item';

export default class Box extends Item {


	constructor (options = {}) {

    super(options);

    this.height = 1;
    this.margin = .05;

		this.texture = this.materials.box;
		//this.texture.wrapS = THREE.RepeatWrapping;
		//this.texture.wrapT = THREE.RepeatWrapping;

		this.material = new THREE.MeshLambertMaterial({
			map: this.texture,
  		color: 0xF4A460,
  		transparent: false,
  		opacity: 1,
  		//side: THREE.DoubleSide,
  		//blending: THREE.AdditiveBlending
  	});

	}


  render () {

    this.mesh = new THREE.Mesh(
      new THREE.BoxGeometry(1-this.margin, this.height-this.margin, 1-this.margin),
      this.material
    );

    this.mesh.castShadow = true;
    this.mesh.position.set(this.options.position.x, (this.height-this.margin) / 2, this.options.position.z);
    this.mesh.objectType = 'box';

  }


  /**
   * Animate all the child elements of this level
   */
  animate (clock) {}

}
