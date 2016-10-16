import Utils from '../../app/utils';
import Item from '../item';

export default class Target extends Item {


	constructor (options = {}) {

    super(options);

		let m = this.textures.getCircleMaterial(256);

		this.texture = new THREE.Texture(m);

		this.material = new THREE.MeshBasicMaterial({
			map: this.texture,
  		//color: 0x11ee11,
  		transparent: false,
  		//opacity: 0.05
  		//side: THREE.DoubleSide,
  		//blending: THREE.AdditiveBlending
  	});

	}


  render () {

    this.mesh = new THREE.Mesh(
      new THREE.CircleGeometry(1/2 - 0.1, 64),
      this.material
    );

    //this.mesh.receiveShadow = true;
    this.mesh.position.set(this.options.position.x, .001+0.02, this.options.position.z);
		this.mesh.rotation.x = -Math.PI/2;
    this.mesh.objectType = 'target';

  }


  /**
   * Animate all the child elements of this level
   */
  animate (clock) {

		this.texture.needsUpdate = true;
		this.textures.updateCircleTexture(clock);

	}

}
