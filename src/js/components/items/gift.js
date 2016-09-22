import THREE from 'three.js';

import Utils from '../../app/utils';
import Text from '../../helpers/text';
import Item from '../item';

export default class Gift extends Item {


	constructor (options = {}) {

    super(options);

    this.height = 1;
    this.margin = .05;

    this.type = options.type || '';
    this.text = options.text || '';

		this.material = new THREE.MeshLambertMaterial({
  		color: 0x5656cc, 
  		transparent: false,
  		opacity: 1,
  		blending: THREE.AdditiveBlending 
  	});


    this.group = new THREE.Group();

	}
 

  render () {

    /*
    this.mesh = new THREE.Mesh(
      new THREE.BoxGeometry(.96, .001, .96),
      this.material
    );

    */

    this.group.castShadow = true;
    this.group.position.set(this.options.position.x, .001/2, this.options.position.z);

    if (this.type != 'undefined') {

      switch (this.type) {

        case 'text':

          this.text = new Text({
            app: this.options.app, 
            text: this.options.text, 
            position: this.options.position,
            group: this.group
          });

          this.text.render();

          break;

      }
      
    }

    // this.mesh.objectType = 'gift';

  }


  getMesh () {

     return this.group;

  }


  animate (clock) {

    if (this.mesh)
      this.mesh.rotation.y -= .01;

    if (this.group)
      this.group.rotation.y -= .01;

  }


}