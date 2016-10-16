//import THREE from 'three.js';

import Log from '../app/log';
import Utils from '../app/utils';


/**
 * Helper class to define custom textures used for THREE.js rendering
 * Textures rendered to 2d canvas
 */
export default class Textures {


  constructor ( options = {} ) {

    this.options = options;
    this.utils = new Utils();

    this.canvas = null;
    this.context = null;
    this.size = 512

  }


  createCanvas (size = 128) {

    this.size = size;
    this.canvas = document.createElement( 'canvas' );
    this.canvas.width = this.size;
    this.canvas.height = this.size;

  }


  getCircleMaterial (size = 128) {

    this.createCanvas(size);
    this.context = this.canvas.getContext( '2d' );

    this.context.beginPath();
    this.context.arc(this.canvas.width, this.canvas.height, size/2, 0, 2 * Math.PI);
    this.context.stroke();

    return this.canvas;

  }


  updateCircleTexture (time, color = '#00ce00', glowColor = '#ffffff') {

    let radius = Math.abs( this.size/2 * Math.sin(time.elapsedTime));

    this.clearCanvas();

    this.drawRadialGradient();

    this.drawCircle(radius, 4, '#00ce00', 2, '#fff');
    //this.drawCircle(radius/2, 8, '#00ce00');
    //this.drawCircle(radius/6, 6, '#00ce00');

  }


  clearCanvas (clearColor = 'black') {

    this.context.fillStyle = clearColor;
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

  }


  drawCircle ( radius = 10, lineWidth = 10, stroke = '#00ce00', shadowRadius, shadowColor) {

    this.context.beginPath();

    if (shadowRadius && shadowColor) {
      this.context.shadowBlur = shadowRadius;
      this.context.shadowColor = shadowColor;
    }

    this.context.lineWidth = lineWidth;
    this.context.strokeStyle = stroke;
    this.context.arc(this.canvas.width/2, this.canvas.width/2, radius, 0, 2 * Math.PI);
    this.context.stroke();

  }


  drawRadialGradient() {

    var gradient = this.context.createRadialGradient(
			this.canvas.width / 2,
			this.canvas.height / 2,
			0,
			this.canvas.width / 2,
			this.canvas.height / 2,
			this.canvas.width / 2
		);

		gradient.addColorStop( 0.0, 'rgba(50, 200, 50, 1.0)');
		gradient.addColorStop( 0.85, 'rgba(25, 255, 25, 0.35)' );
		gradient.addColorStop( 1.0, 'rgba(0, 50, 0, 0.0)' );

		this.context.fillStyle = gradient;
		this.context.fillRect( 0, 0, this.canvas.width, this.canvas.height );

  }


  getStarMaterial ( showShininess ) {

		// create the star texture
		var canvas = document.createElement( 'canvas' );
				canvas.width = 512;
				canvas.height = 512;

		//var col = new THREE.Color(color);
		var context = canvas.getContext( '2d' );

		var gradient = context.createRadialGradient(
			canvas.width / 2,
			canvas.height / 2,
			0,
			canvas.width / 2,
			canvas.height / 2,
			canvas.width / 2
		);

		gradient.addColorStop( 0, 'rgba(255, 255, 255, 1.0)');
		gradient.addColorStop( 0.05, 'rgba(205, 205, 224, 1.0)');
		gradient.addColorStop( 0.1, 'rgba(125, 100, 0, 0.35)' );
		gradient.addColorStop( 1.0, 'rgba(0,0,0,0.0)' );

		context.fillStyle = gradient;
		context.fillRect( 0, 0, canvas.width, canvas.height );

		if ( showShininess ) {
			context.beginPath();
			context.lineWidth = 2;

			// top - bottom
      context.moveTo(canvas.width/2, 0);
      context.lineTo(canvas.width/2, canvas.height);

      // left - right
      context.moveTo(0, canvas.height/2);
      context.lineTo(canvas.width, canvas.height/2);

      // set line color
      context.strokeStyle = 'rgba(255,255,255,0.75)';
      context.stroke();
		}

		var texture = new THREE.Texture(canvas);
				texture.needsUpdate = true;

		return texture;
	}


}
