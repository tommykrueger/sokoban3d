//import THREE from 'three.js';

import Log from '../app/log';
import Utils from '../app/utils';


/**
 * Helper class to define custom geometries used for THREE.js rendering
 */
export default class Text {


  constructor ( options = {} ) {

    this.options = options;
    this.utils = new Utils();

    this.app = options.app;
    this.text = options.text;
    this.color = options.color || 0x009000;
    this.position = options.position;

    this.font = './fonts/optimer_bold.typeface.json';
    this.isCenter = options.isCenter || true;

    this.material = new THREE.MeshPhongMaterial({
      color: this.color,
      shininess: 100
    });

    this.mesh;

  }


	render () {

		this.loader = new THREE.FontLoader();
		this.loader.load(this.font, (font) => {

	    this.geometry = new THREE.TextGeometry( this.text, {

	      font: font,

	      size: .7,
	      height: .01,
	      curveSegments: 20,
	      weight: 'light',

	      bevelThickness: .03,
	      bevelSize: .01,
	      bevelEnabled: true

	    });

	    this.mesh = new THREE.Mesh(
	      this.geometry,
	      this.material
	    );

	    if (this.isCenter)
    		this.center();


    	this.mesh.castShadow = true;

    	if (this.options.group)
    		this.options.group.add(this.mesh);

		});


	}


	center () {

		this.geometry.computeBoundingBox();
		let textWidth = this.geometry.boundingBox.max.x - this.geometry.boundingBox.min.x;

    this.mesh.position.set( -0.5 * textWidth, .1, 0 );

	}


	getMesh () {

		return this.mesh;

	}


}
