import THREE from 'three.js';

export var __useDefault = true;


/**
 * Utility class to be used for global functions
 */

export default class Utils {

	constructor() {

		// the distance of one astronomical unit in kilometers
		this.AU = 149597870.700;

		// the distance for one light year in km
		this.LY = 9460730472580.800;

		// the distance of one parsec in light years
		this.PC = 3.26156;

		// define how large 1px is in comparison to the the real world size
		// every distance will be divided by this value
		this.distancePixelRatio = Math.round(149597870.700 / 10.0);


		// set the default rotation time in days for stars
		this.defaultStarRotationPeriod = 25.00;

		this.radiusSun = 696342; // km


		this.radiusEarth = 6371;

		// For stars
		this.radiusStarPixelRatio = 100000000;

		// For planets, moons, etc
		this.radiusPixelRatio = 50000;


		this.planetDefaultColor = [0, 0, 200];


		this.orbitTransparency = 0.5;

		this.orbitColors = [
			0xD59C6F,
			0x88bf8b,
			0x4682b4,
			0xd2691e,
			0xf0e68c,
			0xffa500,
			0xE89296,
			0x92DEE8,
			0x55732D,
			0x0FF7E8,

			0xE3B1E0,
			0xCA8E40,
			0x983315,
			0xA06E00,
			0xFFB100,
			0xFF6202,
			0x00579E,
			0x9E600A,
			0xFFA301,
			0x913E20
		];



		this.spectralColors = {
			'o': 0x9BB0FF, // blue
			'b': 0xBBCCFF, // blue white
			'a': 0xFBF8FF, // white
			'f': 0xFFFFF0, // yellow white
			'g': 0xFFFF00, // yellow
			'k': 0xFF9833, // orange
			'm': 0xBB2020, // red
			'l': 0xA52A2A, // red brown
			't': 0x964B00, // brown
			'y': 0x663300  // dark brown
		};


	}

	getDistance( distance, distanceType = 'ly' ) {

		if (distanceType.toLowerCase() == 'ly') {
			return (distance * this.LY / this.distancePixelRatio);
		}	

		if (distanceType.toLowerCase() == 'au') {
			return (distance * this.AU / this.distancePixelRatio);
		}

	}


	/**
	 * project from 3d to 2d space
	 */ 
	toScreenPosition(obj, camera) {

    var vector = new THREE.Vector3();

    var widthHalf = 0.5 * window.innerWidth;
    var heightHalf = 0.5 * window.innerHeight;

    obj.updateMatrixWorld();
    vector.setFromMatrixPosition(obj.matrixWorld);
    vector.project(camera);

    vector.x = ( vector.x * widthHalf ) + widthHalf;
    vector.y = - ( vector.y * heightHalf ) + heightHalf;

    return { 
      x: vector.x,
      y: vector.y
    };

	}


	project2D (mesh, app) {

		app.scene.updateMatrixWorld(true);

		var position = new THREE.Vector3();
		var pos = position.setFromMatrixPosition( mesh.matrixWorld );
		
		app.camera.updateMatrixWorld(true);

		// var vector = app.projector.projectVector(pos.clone(), app.camera);
		var vector = pos.unproject(app.camera);

		var pLocal = new THREE.Vector3(0, 0, -1);
		var pWorld = pLocal.applyMatrix4( app.camera.matrixWorld );
		var dir = pWorld.sub( app.camera.position ).normalize();

		var scalar = (pos.x - app.camera.position.x) / dir.x;
		// window.utils.debug( scalar );
		if (mesh.name == 'Earth') {
  		// window.utils.debug('Earth pos', scalar);
  	}

	  if (scalar < 0) {
	  	console.log(mesh.name);
	  	// window.utils.debug('object behind camera');
	  	// return false; // this means the point was behind the camera, so discard
	  }

		vector.x = (vector.x + 1)/2 * window.innerWidth;
		vector.y = -(vector.y - 1)/2 * window.innerHeight;

		return vector;
	}



	// taken from: http://zachberry.com/blog/tracking-3d-objects-in-2d-with-three-js/
	getPosition2D ( object, app ) {

		app.scene.updateMatrixWorld(true);

		var p, v, percX, percY, left, top;

		// this will give us position relative to the world
		p = object.position.clone();

		app.camera.updateMatrixWorld(true);

		// unproject will translate position to 2d
		v = p.unproject(app.camera);

		// Pick a point in front of the camera in camera space:
		var pLocal = new THREE.Vector3(0, 0, -1);

		// Now transform that point into world space:
		var pWorld = pLocal.applyMatrix4( app.camera.matrixWorld );
		
		// You can now construct the desired direction vector:
		var dir = pWorld.sub( app.camera.position ).normalize();

		var scalar = (p.x - app.camera.position.x) / dir.x;
		//window.utils.debug( scalar );

	  if (scalar < 0) {
	  	// window.utils.debug('object behind camera');
	  	// return false; //this means the point was behind the camera, so discard
	  }
		//window.utils.debug( v );

		// translate our vector so that percX=0 represents
		// the left edge, percX=1 is the right edge,
		// percY=0 is the top edge, and percY=1 is the bottom edge.
		v.x = (v.x + 1)/2 * window.innerWidth;
		v.y = -(v.y - 1)/2 * window.innerHeight;

		return v;

	}


	toRad() {

		return Math.PI / 180;

	}


	// derived from: https://github.com/mrdoob/three.js/blob/master/examples/js/Detector.js
  isWebGLSupported() {

    try {
      
      let canvas = document.createElement("canvas");
      return !! window.WebGLRenderingContext && (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"));

    } catch(e) { return false; } 

  }

  // taken from: http://stackoverflow.com/questions/3177855/how-to-format-numbers-similar-to-stack-overflow-reputation-format
	numberFormat(number) {
		var repString = number.toString();

	  if ( number < 1000 ) {
			repString = number;
	  } else if ( number < 1000000 ) {
			repString = (Math.round((number / 1000) * 10) / 10) + ' K'
	  } else if ( number < 1000000000 ) {
			repString = (Math.round((number / 1000000) * 10) / 10) + ' Mio'
	  } else if ( number < 1000000000000000000 ) {
			repString = (Math.round((number / 1000000000) * 10) / 10) + ' Bio'
	  }

	  return repString;
	}



	getDimensionToTen( min, max ) {

		var size = Math.ceil( max * 100000 ) / 100000;

		if( max < 0.001 )
			size = Math.ceil( max * 10000 ) / 10000;
		else if( max < 0.01 )
			size = Math.ceil( max * 1000 ) / 1000;
		else if( max < 0.1 )
			size = Math.ceil( max * 100 ) / 100;
		else if( max < 1 )
			size = Math.ceil( max * 10 ) / 10;

		else {
			size = Math.ceil( max );
		}

		return {
			size: size,
			max: max,
			min: min,
			minPercent: Math.round(min * 100 / size) / 100,
			maxPercent: Math.round(max * 100 / size) / 100
		}

	}


  debug(txt) {

  	if (window.isDevelopmentMode)
  		console.log(txt);

  }


  // taken from: http://jsfiddle.net/Brfp3/3/
	textCircle (ctx, text, x, y, radius, space, top){
	   space = space || 0;
	   var numRadsPerLetter = (Math.PI - space * 2) / text.length;
	   ctx.save();
	   ctx.translate(x,y);
	   var k = (top) ? 1 : -1; 
	   ctx.rotate(-k * ((Math.PI - numRadsPerLetter) / 2 - space));
	   for(var i=0;i<text.length;i++){
	      ctx.save();
	      ctx.rotate(k*i*(numRadsPerLetter));
	      ctx.textAlign = "center";
	     	ctx.textBaseline = (!top) ? "top" : "bottom";
	     	ctx.fillText(text[i],0,-k*(radius));
	      ctx.restore();
	   }
	   ctx.restore();
	}


}