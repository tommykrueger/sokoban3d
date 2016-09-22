import Log from './app/log';
import ThreeScene from './components/threescene.js';

export default class App {
  
  constructor () {

    this.resolutions = {

      low: {

        sphereSegments: 32

      },

      high: {

        sphereSegments: 128

      }

    }


    this.defaultOptions = {

      // the level of detail
      resolution: this.resolutions['low'],

      // rendering mode
      view: '3d',

      // render statistics as well
      renderStats: true,

    };


    this.setDevelopmentMode();
    this.init();

  }


  init () {

    this.THREESCENE = new ThreeScene(this.defaultOptions);

  }


  setResolution (resolution = 'low') {

    this.defaultOptions.resolution = this.resolutions[resolution];

  }


  setDevelopmentMode () {

    window.isDevelopmentMode = true;

  }

};

new App();
export var __useDefault = true;

export default class Log {

  init () {}

  info (message) {
  	this.print(message, 'info');
  }

  error (message) {
		this.print(message, 'error');
  }

  print (message, type = 'info') {
  	if (typeof(console) === 'object' && window.console.log) {
  		console.log(message);
  	}
  }
}
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
export var __useDefault = true;

import Utils from './utils';

import Template from '../views/template';

/**
 * View base class
 * Used for all DOM - related objects
 * 
 */

export default class View {

	constructor ( options = {} ) {

		this.options = options;
		this.app = options.app;

		this.utils = new Utils();
		
		this.name = '';
		this.$view = ``;

	}

	setData() {

	}

	render() {

		this.$el = this.$view;
		return this.$el;

	}

	getHtml() {

		return this.$el.html();

	}

	appendTo( $element ) {



	}

}
import THREE from 'three.js';
import _ from 'underscore';
import Utils from '../app/utils';

export default class Character {


	constructor (options = {}) {

		this.options = options;
		this.app = this.options.app;
    this.level = this.options.level;
    this.position = this.options.position;

    this.delta = 1;
    this.currentPosition = { x: 0, y: 0 };

		this.utils = new Utils();

	}
 

  render () {

  	this.material = new THREE.MeshLambertMaterial({
  		color: 0xff0000, 
  		transparent: false,
  		opacity: 1,
  		side: THREE.DoubleSide,
  		blending: THREE.AdditiveBlending 
  	});

    this.mesh = new THREE.Mesh(
      new THREE.SphereGeometry(.5, 32, 32),
      this.material
    );

    this.mesh.castShadow = true;

    this.setPosition();
    this.initControls();

  }


  animate (clock) {

    let t = Math.sin(clock.getElapsedTime() * 3);
    let scale = Math.max(.86, t);

    this.mesh.scale.x = scale;
    this.mesh.scale.y = scale;
    this.mesh.scale.z = scale;

  }


  setPosition (position = false) {

    if (position) this.position = position;
    this.mesh.position.set(this.position.x, .8/2, this.position.z);

  }



  initControls () {

    window.addEventListener('keydown', (e) => this.keyDown(e), false);

  }


  getMesh() { 
    return this.mesh;
  }


  keyDown(event) {

    event = event || window.event;

    var keycode = event.keyCode;

    switch(keycode){
        case 37: // left arrow
        this.move('left');
      break;
        case 38: // up arrow
        this.move('up');
      break;
        case 39: // right arrow
        this.move('right');
      break;
        case 40: // down arrow
        this.move('down');
      break;
    }

  }


  move (direction = 'down') {

    if (this.canMove(direction)) {

      let oldPos = Object.assign({}, this.currentPosition);

      if (direction == 'left') {
        this.currentPosition.x -= 1;
        this.mesh.position.x -= this.delta; 
      }

      if (direction == 'right') {
        this.currentPosition.x += 1;
        this.mesh.position.x += this.delta; 
      }

      if (direction == 'up') {
        this.currentPosition.y -= 1;
        this.mesh.position.z -= this.delta; 
      }

      if (direction == 'down') {
        this.currentPosition.y += 1;
        this.mesh.position.z += this.delta; 
      }

      if (this.level.isObjectInFront('gift', this.currentPosition)) {

        console.log('we fond a gift ', this.level.isObjectInFront('gift', this.currentPosition));

      }

      this.app.$interface.addMove();
      this.app.$interface.update();
      this.app.level.lift.check();

      // this.hasFoundKey();

      this.level.checkSolved();

    }

  }


  // check if there is an obstacle before moving
  canMove (direction) {

    let targetPosition = Object.assign({}, this.currentPosition); 

    // let targetFrontPosition = new THREE.Vector3(targetPosition.x, targetPosition.y, targetPosition.z); 
    let targetFrontPosition = Object.assign({}, this.currentPosition);
    let pFrontOld = Object.assign({}, targetFrontPosition);
    let pOld = Object.assign({}, targetPosition);


    if (direction == 'left') {
      targetPosition.x -= this.delta;
      targetFrontPosition.x -= this.delta * 2;
    }

    if (direction == 'right') {
      targetPosition.x += this.delta; 
      targetFrontPosition.x += this.delta * 2;
    }

    if (direction == 'up') {
      targetPosition.y -= this.delta; 
      targetFrontPosition.y -= this.delta * 2;
    }

    if (direction == 'down') {
      targetPosition.y += this.delta; 
      targetFrontPosition.y += this.delta * 2;
    }


    if (this.level.isObjectInFront('wall', targetPosition)) {

      console.log('cannot move becase thee is a wall infont');
      return false;

    }


    let object = this.level.isObjectInFront('box', targetPosition);

    if (object) {

      console.log('in font is a box, can we move it?', object);

      // check if in front of the box is a free place
      if (!this.level.isObjectInFront('wall', targetFrontPosition) && !this.level.isObjectInFront('box', targetFrontPosition)) {

        let pNew = {
          x: targetFrontPosition.x, 
          y: 0, 
          z: targetFrontPosition.y 
        }

        this.level.moveObject(object.item, pNew);
        this.level.updateBoxes(object, pNew);

        this.app.$interface.addBoxMove();

      } else {

        console.log('cannot move becase thee is a box o wall infont of anothe box');
        return false;

      }

    }

    return true;

  }


  moveToFloor (oldFloor, newfloor) {

    if (this.app.level.floors[oldFloor])
      this.app.level.floors[oldFloor].remove(this.mesh);

    if (this.app.level.floors[newfloor])
      this.app.level.floors[newfloor].add(this.mesh);

  }


  /**
   * the playe eaches a field with a key
   */
  hasFoundKey () {

    this.level.removeGate();

  }


}
import THREE from 'three.js';
import _ from 'underscore';
import Utils from '../app/utils';


export default class Item {


	constructor (options = {}) {

		this.options = options;
		this.app = this.options.app;
		this.level = this.options.level;

		this.utils = new Utils();

    // the three.js object of the item
    this.mesh;

    // means the player can interact with this item
    this.isInteractable = false;

	}
 
  // to be implemented by extending class object
  render () {}



  /**
   * Animate all the child elements of this level
   */
  animate (clock) {

    // define custom item based animation function here

  }


  move (targetPosition) {

    this.mesh.position.x = targetPosition.x;
    // this.mesh.position.y = targetPosition.y;
    this.mesh.position.z = targetPosition.z;

  }


  setFloorPosition (position) {

    this.mesh.position.y = position;

  }


  getMesh() {

    return this.mesh;

  }


}
import THREE from 'three.js';
import _ from 'underscore';
import Utils from '../app/utils';


// standalone classes
import Lift from './lift';


// import items
import WallItem from './items/wall';
import TargetItem from './items/target';
import FloorItem from './items/floor';
import BoxItem from './items/box';
import LiftItem from './items/lift';
import KeyItem from './items/key';
import GiftItem from './items/gift';

import Character from './character';


// helper classes
import Text from '../helpers/text';


export default class Level {


	constructor (options = {}) {

		this.options = options;
		this.app = this.options.app;
		this.level = this.options.level;

		this.utils = new Utils();

    this.boxes = [];
    this.floors = [];
		this.meshes = [];

    this.targetPoints = 0;

    this.group = new THREE.Group();
    this.floor = new THREE.Group();

    this.group.add(this.floor);
    this.app.scene.add(this.group);

    this.width = options.level.width;
    this.height = options.level.height;

    this.currentFloor = options.level.currentFloor || 0;

    // the height of each floor in pixels
    this.floorHeight = 3;

    // holds all the three.js items rendered in this level
    this.items = [];

    this.world = { floors: [] };

    this.walls = { floors: [] };
    this.boxes = { floors: [] };
    this.lifts = { floors: [] };
    this.targets = { floors: [] };
    this.keys = { floors: [] };
    this.gifts = { floors: [] };

    this.level.floors.forEach((floor, index) => {
      this.world.floors.push({ name: floor.name, map: [] });
      this.walls.floors[index] = [];
      this.boxes.floors[index] = [];
      this.lifts.floors[index] = [];
      this.targets.floors[index] = [];
      this.keys.floors[index] = [];
      this.gifts.floors[index] = [];
    });


    this.symbols = {
      '@': 'character',
      '.': 'target',
      '#': 'wall', 
      '-': 'floor', 
      'b': 'box',
      'l': 'lift',
      '?': 'gift'
    }
      

		this.materials = {

	  	floor: new THREE.MeshLambertMaterial({
	  		color: 0x666666, 
	  		transparent: false,
	  		opacity: 1,
	  		side: THREE.DoubleSide,
	  		blending: THREE.AdditiveBlending 
	  	})

		};

    this.prepareLevelStructure();
    this.setLevelPosition();

	}


  prepareLevelStructure() {

    if (this.level.floors) {
      this.level.floors.forEach((floor, index) => {
        let group = new THREE.Object3D();
        this.floors.push(group);
        this.group.add(group);
      });
    }

  }



  setLevelPosition() {
    this.group.position.x -= this.width / 2;
    this.group.position.z -= this.height / 2;

    this.app.camera.lookAt(this.group.position);
  }



  focusFloor () {

    this.floors.forEach((floor, index) => {

      if (index != this.currentFloor) {

        floor.traverse((child) => {
          if (child.children.length) {
            child.children.forEach((mesh) => {
              mesh.material.transparent = true;
              mesh.material.opacity = .1;
            });
          }
        });

      } else {

        floor.traverse((child) => {
          if (child.children.length) {
            child.children.forEach((mesh) => {

              if (mesh instanceof THREE.Mesh)
                mesh.material.transparent = false;
            });
          }
        });

      }
      
    });

    // move the camera
    this.app.updateCamera(this.currentFloor * this.floorHeight);

  }
 


  render () {

  	if (this.level.floors) {

      this.level.floors.forEach(( floor, index ) => {

        this.floors[index].position.y = index * this.floorHeight;

    		floor.map.forEach(( row, i ) => {

          this.world.floors[index].map.push([]);
    			
    			row.forEach(( col, j ) => {

            let position = new THREE.Vector3(j, 0, i);
            let item;
            let options = {
              app: this.app, 
              level: this, 
              position: position
            };

    				switch(col) {

              case '@':

                this.character = new Character(options);
                this.character.render();
                this.character.currentPosition.x = j;
                this.character.currentPosition.y = i;

                // this.character = item;
                this.floors[index].add(this.character.getMesh());
                this.items.push(this.character);

                break;

              case '-':
                
                break;

    					case '#':
              case '1':
              case '2':
              case '3':
              case '4':
              case '5':
              case '6':
              case '7':
              case '8':
              case '9':
              case '10':

                options.height = col;
                item = new WallItem(options);

                this.walls.floors[index].push({
                  id: 'floor-' + index +'-'+ i +'-'+ j,
                  item: item,
                  position: position
                });

    						break;

  						case '.':
                item = new TargetItem(options);

                this.targets.floors[index].push({
                  id: 'floor-' + index +'-'+ i +'-'+ j,
                  item: item,
                  position: position
                });

                this.targetPoints++;
    						break;

  						case 'b':
                item = new BoxItem(options);

                this.boxes.floors[index].push({
                  id: 'floor-' + index +'-'+ i +'-'+ j,
                  item: item,
                  position: position
                });

    						break;

              case 'l':
                item = new LiftItem(options);

                this.lifts.floors[index].push({
                  id: 'floor-' + index +'-'+ i +'-'+ j,
                  item: item,
                  position: position
                });

                break;

              case 'k':
                item = new KeyItem(options);

                /*
                this.lifts.floors[index].push({
                  id: 'floor-' + index +'-'+ i +'-'+ j,
                  item: item,
                  position: position
                });
                */

                break;

              case '?':

                options = Object.assign({
                  type: 'text',
                  text: '?'
                }, options);

                item = new GiftItem(options);

                this.gifts.floors[index].push({
                  id: 'floor-' + index +'-'+ i +'-'+ j,
                  item: item,
                  position: position
                });

                this.items.push(item);

                break;
    				}


            if (item) {

              item.render();

              this.world.floors[index].map[i].push({
                type: col,
                item: item
              });

              this.meshes.push(item.getMesh());
              this.floors[index].add(item.getMesh());
            }



            let floor = new FloorItem(options);
                floor.render();

            this.floors[index].add(floor.getMesh());


  				});

  			});  

      });       

  	}

    console.log(this.world);
    this.afterRender();

  }


  afterRender () {

    this.lift = new Lift({ app: this.app, lifts: this.lifts });
    this.focusFloor();

  }


  /**
   * Animate all the child elements of this level
   */
  animate (clock) {

    this.items.forEach( (item) => {
      if ( typeof(item.animate) === 'function') {
        item.animate(clock);
      }
    });

  }


  /**
   * Once the corbyn moves to another floor - eg with a lift
   * he enters a new floor
   */
  setFloor (index) {

    this.currentFloor = index;

  }



  isObjectInFront (objectType, position) {

    let object = false;

    if (objectType === 'wall') {
      this.walls.floors[this.currentFloor].forEach((wall) => {
        if (wall.position.x == position.x && wall.position.z == position.y) {
          object = wall;
        }
      });
    } 


    if (objectType === 'box') {
      this.boxes.floors[this.currentFloor].forEach((box) => {
        if (box.position.x == position.x && box.position.z == position.y) {
          object = box;
        }
      });
    } 

    if (objectType === 'gift') {
      this.gifts.floors[this.currentFloor].forEach((gift) => {
        if (gift.position.x == position.x && gift.position.z == position.y) {
          object = gift;
        }
      });
    }

    return object;

  }


  isObjectAtPosition (objectType, position) {

    let object = false;

    if (objectType === 'lift') {
      this.lifts.floors[this.currentFloor].forEach((lift) => {
        if (lift.position.x == position.x && lift.position.z == position.y) {
          object = lift;
        }
      });
    } 

    return object;

  }



  updateFloorItems (items, oldFloor, newFloor) {

    console.log('updating items');

    items.forEach((item) => {

      console.log(item);

      this.boxes.floors[oldFloor].forEach((box, index) => {
        if (box.id === item.id) {
          this.boxes.floors[oldFloor].splice(index, 1);  
          this.boxes.floors[newFloor].push(box);  

          this.floors[oldFloor].remove(item.item.mesh);
          this.floors[newFloor].add(item.item.mesh);
        }
      });

    });


  }


  updateBoxes (object, position) {

    this.boxes.floors[this.currentFloor].forEach((box) => {
      if (box.id === object.id) {
        box.position.x = position.x;
        box.position.z = position.z;
      }
    });

  }



  moveObject (item, targetPosition) {

    item.mesh.position.x = targetPosition.x;
    // item.mesh.position.y = targetPosition.y;
    item.mesh.position.z = targetPosition.z;

  }



  checkSolved () {

    let solved = false;
    let targetsWithBoxes = 0;
    let boxes = 0;


    this.boxes.floors.forEach((floor, boxIndex) => {
      floor.forEach((box) => {

        boxes++;

        this.targets.floors.forEach((targets, targetIndex) => {
          targets.forEach((target) => {
            if (boxIndex == targetIndex && box.position.x == target.position.x && box.position.z == target.position.z) {
              targetsWithBoxes++;
            }
          });
        });

      });
    });

    // console.log('solved?', targetsWithBoxes, this.targetPoints);
 
    if (boxes === targetsWithBoxes) {
      solved = true;
      console.log('level solved ', solved, boxes);

      //this.text = new Text({app: this.app, text: '?'});
      //this.text.render();
    }

  }


}
import THREE from 'three.js';

export default class Lift {


	constructor (options = {}) {

    this.app = options.app;
    this.lifts = options.lifts;

    this.meshes = [];

	}
 

  render () {

    this.liftItems();

  }


  /**
   * find the items that ae on the lift and waiting fo moving
   */
  getItemsInLift () {

    let items = [];

    this.app.level.boxes.floors[this.app.level.currentFloor].forEach((box) => {
      this.app.level.lifts.floors[this.app.level.currentFloor].forEach((lift) => {
        if (box.position.x == lift.position.x && box.position.z == lift.position.z) {
          items.push(box);
        }
      });
    });

    return items;

  }


  /**
   * Move the lift one level up
   */
  moveUp () {

    let floor = this.app.level.currentFloor;
    let floorHeight = this.app.level.floorHeight;

    if (floor < this.app.level.floors.length) {

      let items = this.getItemsInLift();
      console.log(items);

      this.app.level.currentFloor++;
      this.app.level.updateFloorItems(items, floor, this.app.level.currentFloor);

      this.lifts.floors[floor].forEach((lift) => {
        console.log('items as lift', lift);
        //lift.item.setFloorPosition(this.app.level.currentFloor * floorHeight);
      }); 

    }

    this.app.level.character.moveToFloor(floor, this.app.level.currentFloor);
    this.app.level.focusFloor();

    this.check();

  }

  /**
   * Move the lift one level down
   */
  moveDown () {

    let floor = this.app.level.currentFloor;
    let floorHeight = this.app.level.floorHeight;

    if (floor < this.app.level.floors.length) {

      let items = this.getItemsInLift();
      console.log(items);

      this.app.level.currentFloor--;
      this.app.level.updateFloorItems(items, floor, this.app.level.currentFloor);

      this.lifts.floors[floor].forEach((lift) => {
        console.log('items as lift', lift);
        //lift.item.setFloorPosition(this.app.level.currentFloor * floorHeight);
      });

    }

    this.app.level.character.moveToFloor(floor, this.app.level.currentFloor);
    this.app.level.focusFloor();

    this.check();

  }


  check () {

    let object = this.app.level.isObjectAtPosition('lift', this.app.level.character.currentPosition);

    if (object) {

      console.log(this.app.level.currentFloor, this.app.level.floors.length);

      if (this.app.level.currentFloor < this.app.level.floors.length-1) 
        this.app.$liftUpButton.activate();
      else 
        this.app.$liftUpButton.deactivate();

      if (this.app.level.currentFloor > 0)
        this.app.$liftDownButton.activate();
      else
        this.app.$liftDownButton.deactivate();

    } else {

      this.app.$liftUpButton.deactivate();
      this.app.$liftDownButton.deactivate();

    }

  }


  animate (clock) {}

}
import $ from 'jquery';
import THREE from 'three.js';

export var __useDefault = true;

export default class Shader {


	constructor ( options = {} ) {

		this.options = options;

		this.shader = this.options.shader;
		this.uniforms = this.options.uniforms || [];
		this.attributes = this.options.attributes || [];

		this.isAnimateable = true;
		this.material = null;

		this.materials = {
			vertex: '',
			fragment: ''
		}

		this.i = 2;

	}


	load ( callback = {} ) {

		this.call({
			url: '../src/js/shaders/vertex-shader-'+ this.shader +'.js',
			shaderType: 'vertex',
			callback: callback
		});

		this.call({
			url: '../src/js/shaders/fragment-shader-'+ this.shader +'.js',
			shaderType: 'fragment',
			callback: callback
		});

	}


	getMaterial () {
		return this.material;
	}


	setMaterial () {

		this.material = new THREE.ShaderMaterial({  
		  uniforms: this.uniforms,
		  vertexShader: this.materials['vertex'],
		  fragmentShader: this.materials['fragment'],

			blending: THREE.NormalBlending,

		  transparent: true,
		  depthTest: false,
		  depthWrite: false
		});


		// this.uniforms.tNoise.value.wrapS = this.uniforms.tNoise.value.wrapT = THREE.RepeatWrapping;

	}


	setAttributes ( attributes = {} ) {
		this.attributes = attributes;
	}






	call ( options = {} ) {

		$.ajax({
			url: options.url,
			dataType: 'text',
			async: false,
			success: (data) => {

				this.materials[options.shaderType] = data;
				this.i--;

				if (this.i == 0) {
					this.setMaterial();
					options.callback(data);
				}

			}
		});

	}

}
import $ from 'jquery';
import _ from 'underscore';
import THREE from 'three.js';
import Stats from 'stats';

import Utils from '../app/utils';
import Level from '../components/level';

// views
import Button from '../views/button';
import Interface from '../views/interface';


export default class ThreeScene {
  
  constructor (options = {}) {

  	this.utils = new Utils();
  	this.options = options;

  	this.meshes = [];
  	this.level;

  	this.raycaster = new THREE.Raycaster();
  	this.mouse = new THREE.Vector2();

  	// to be optimized
  	this.time = Date.now();
		this.simTime = this.time;
		this.simTimeSecs = null;

		this.defaultSpeed = 100;

		this.startTime = _.now();

		// current speed (1 earth day represents 365/100 seconds in app)	
		this.currentSpeed = 100;
		this.speedStep = 100;

		this.date = new Date( this.simTime );
		this.timeElapsedSinceCameraMove = 0;
		this.timeElapsed = 0;


		this.clock = new THREE.Clock();
		this.delta = 0;

  	this.prepareScene();
    this.init();

  }

  prepareScene() {

  	this.scene = new THREE.Scene();
		this.renderer;
		this.camera; 
		this.cameraControls;
		this.controls;
		//this.projector;

  	if (this.utils.isWebGLSupported()) {

			this.renderer = new THREE.WebGLRenderer({
				antialias: true
			});

			this.renderer.setClearColor( 0x000000, 1 );

		} else {

			let message = new Message({text: 'No WebGL', state: 'info'});
					message.render();

			return;
		}


		this.initCamera();


		// the position which the camera is currently looking at
		this.cameraTarget = new THREE.Vector3(0,0,0);

		// this.cameraHelper = new CameraHelper({ app: self });

		this.renderer.setSize( window.innerWidth, window.innerHeight );
		this.renderer.shadowMap.enabled = true;
		this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

		/*
		this.renderer.shadowCameraNear = 3;
    this.renderer.shadowCameraFar = this.camera.far;
    this.renderer.shadowCameraFov = 50;

    this.renderer.shadowMapBias = 0.0039;
    this.renderer.shadowMapDarkness = 0.5;
    this.renderer.shadowMapWidth = 1024;
    this.renderer.shadowMapHeight = 1024;

    */

		this.container = document.getElementById('scene');
		this.container.appendChild(this.renderer.domElement);

	  // add event listeners
	  document.addEventListener( 'mousedown', (e) => this.onDocumentMouseMove(e), false );
	  document.addEventListener( 'mousemove', (e) => this.onDocumentMouseMove(e), false );
	  document.addEventListener( 'mouseover', (e) => this.onDocumentMouseMove(e), false );

  }


  init() {

  	// this.initCamera();
		this.initLighting();
		this.initResize();

    if (this.options.renderStats)
	  	this.renderStats();

	  // this.loadLevel('level1');
	  // this.loadLevel('level2');
	  // this.loadLevel('level3');
	  // this.loadLevel('level3');
	  // this.loadLevel('level5');

	  this.loadLevel('christmas-tree-01');
	  // this.loadLevel('christmas-tree-06');

	  this.renderViews();
	  this.animate();

  }



  initCamera( target ) {

  	var self = this;

  	if (target !== undefined || target != null)
  		self.cameraTarget = target;

  	var width = $(window).width();
  	var height = $(window).height();

  	// add the camera to the scene
		this.camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, .1, 1000 );
		//this.camera = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, 1, 1000 );
		this.camera.updateProjectionMatrix();

		//this.cameraHelper = new THREE.CameraHelper(this.camera);
		//this.scene.add(this.cameraHelper);

		this.utils.debug('current camera target', self.cameraTarget);

		if (this.options.view == '3d') {

			this.cameraPos = { 
				x: 0,
				y: 12, 
				z: 8
			};

			console.log('rendering camera at:', this.cameraPos);

			this.camera.position.set( this.cameraPos.x, this.cameraPos.y, this.cameraPos.z );

		}
		
		this.scene.add(this.camera);
		// this.controls = new THREE.TrackballControls( this.camera, this.container );

		this.controls = new THREE.OrbitControls( this.camera, this.container );

		//var vector = new THREE.Vector3( this.controls.target.x, this.controls.target.y, this.controls.target.z );
  			//vector.applyQuaternion( this.camera.quaternion );

  	this.cameraTarget = this.controls.target;

		if (target !== undefined || target != null) {
			// window.utils.debug('defining new camera target', target);

			// define the camera position
			this.cameraHelper.setCameraPosition(target);	

			// define the target which the camera shoul look at
			//this.cameraHelper.setCameraTarget(target);

		} else {
			this.camera.lookAt(this.cameraTarget);
			//this.cameraHelper.setCameraTarget( self.cameraTarget );
		}


		this.cameraPosition = new THREE.Vector3();
		this.cameraPosition = this.cameraPosition.setFromMatrixPosition( this.camera.matrixWorld );
		this.cameraPositionOld = this.cameraPosition;

	  this.controls.rotateSpeed = .5;
	  this.controls.zoomSpeed = 1.8;
	  this.controls.panSpeed = .3;


	  // limit line
	  this.controls.maxPolarAngle = Math.PI/2;

	  //this.controls.minDistance = this.window.utils.makeDistance( 0.0001, 'au');

	  //this.controls.noZoom = false;
	  //this.controls.noPan = false;

	  this.controls.enableDamping = false;
	  this.controls.dampingFactor = 0.3;

	  this.controls.enableKeys = false;
	  this.controls.keys = [];
	  this.controls.addEventListener( 'change', this.render() );
  }


	initLighting() {

	  // add a very light ambient light
	  var globalLight = new THREE.AmbientLight(0xffffff);

	  globalLight.color.setRGB( 
	  	.521,
	  	.521,
	  	.521
	  );

	  this.scene.add( globalLight );


	  //directional light
		this.directionalLight = new THREE.DirectionalLight(0xffffff, 1.75);
		this.directionalLight.position.set(-6, 6, 11);
		this.directionalLight.target.position.set(1, 1, 0);
		 
		this.directionalLight.castShadow = true;
		// this.directionalLight.shadowCameraVisible = true;
		//this.directionalLight.shadowDarkness = 0.5;

		//this.directionalLight.shadow.mapSize.width = 512 * 2;
    //this.directionalLight.shadow.mapSize.height = 512 * 2;
		 
		this.directionalLight.shadow.camera.near = 0;
		this.directionalLight.shadow.camera.far = 1000;
		 
		this.directionalLight.shadow.camera.left = -20;
		this.directionalLight.shadow.camera.right = 20;
		this.directionalLight.shadow.camera.top = 20;
		this.directionalLight.shadow.camera.bottom = -20;
 
		this.scene.add(this.directionalLight);

		//var lightHelper3 = new THREE.DirectionalLightHelper( this.directionalLight );
		//this.scene.add( lightHelper3 );
  }


  loadLevel (level) {
		var self = this;

		$.ajax({
		  url: './src/json/'+ level +'.json?time=' + Math.random(),
		  dataType: 'json',
		  success: (level) => {

		  	console.log(level);
		  	
		  	this.level = new Level({
		  		app: this, 
		  		level: level
		  	});

		  	this.level.render();

		  }
		});

	}


	renderViews() {

		this.$interface = new Interface({app: this});
		this.$interface.render();

		this.$liftUpButton = new Button({
			app: this,
			name: 'LiftUp',
			text: 'Lift Up',
			object: 'lift',
			action: 'moveUp'
		});

		this.$liftDownButton = new Button({
			app: this,
			name: 'LiftDown',
			text: 'Lift Down',
			object: 'lift',
			action: 'moveDown'
		});

		this.$liftUpButton.render( $('#buttons') );
		this.$liftDownButton.render( $('#buttons') );

	}


  renderStats ( container = $('body') ) {
  	this.stats = new Stats();

  	$(this.stats.domElement).attr('class', 'stats');
  	$(this.stats.domElement).css({
			'position': 'absolute',
			'bottom': '0',
			'z-index': 99
		});

		container.append( this.stats.domElement );
  }



  initResize() {

		window.addEventListener('resize', () => {

      let w = window.innerWidth;
      let h = window.innerHeight;

      this.renderer.setSize( w, h );
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
    });

  }


	animate ( step ){
  	this.timeElapsed = step;

    // loop on request animation loop
		// - it has to be at the begining of the function
		// - see details at http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
		requestAnimationFrame( this.animate.bind( this ) );
		this.controls.update();


	  // set the time
	  this.lastTime = this.time;
	  this.time = Date.now();
	  this.dt = this.time - this.lastTime;
	  this.simTime += this.dt * this.currentSpeed;
	  this.date = new Date(this.simTime);
	  this.simTimeSecs = this.simTime;

		// do the render
		this.render(step);

		// update stats
		if (this.options.renderStats)
			this.stats.update();
  }


  render (step) {
		var self = this;

		this.delta = this.clock.getDelta();
		this.timeElapsed = this.clock.getElapsedTime();

		// this.renderCount++;
		var now = _.now();
		var currentDate = new Date(now - this.startTime);
		var secondsElapsed = currentDate.getSeconds();
		var minutesElapsed = currentDate.getMinutes();
		// window.utils.debug('time since app start', minutesElapsed + 'm ' + secondsElapsed + 's');

		if (this.$interface)
			this.$interface.updateTime(this.timeElapsed);

		this.currentRenderLoops++;

		// calculate current distance from solar center
		this.cameraPosition = new THREE.Vector3();
		this.cameraPosition = this.cameraPosition.setFromMatrixPosition( this.camera.matrixWorld );

		// distance in px
		this.distanceCamera = this.cameraPosition.distanceTo( self.cameraTarget );

		// check if camera position changed and recalculate star sizes
		if (this.cameraPosition.y != this.cameraPositionOld.y) {
			this.cameraPositionOld = this.cameraPosition;
			this.timeElapsedSinceCameraMove = now;
		}

		// Move the camera in a circle with the pivot point in the center of this circle...
	  // ...so that the pivot point, and focus of the camera is on the center of the scene.
	  if ((now - this.timeElapsedSinceCameraMove) > 30000) {
			// this.cameraHelper.autoRotation();
	  }

	  if (this.level)
	  	this.level.animate(this.clock);


	  // this.cameraHelper.update();

		// TWEEN.update();
		this.renderer.render( this.scene, this.camera );
	}


	updateCamera (lookAt) {

    let newPosY = this.cameraPos.y + lookAt;

    this.camera.position.set( this.cameraPos.x, newPosY, this.cameraPos.z );
    this.controls.target.set(0, lookAt, 0);

	}


  onDocumentMouseMove(e) {

		e.preventDefault();

		this.updateMousePosition(e);

		//var self = this;
		//var vector = new THREE.Vector3( ( e.clientX / window.innerWidth ) * 2 - 1, - ( e.clientY / window.innerHeight ) * 2 + 1, .5 );
		// this.projector.unprojectVector( vector, this.camera );

		//vector.unproject(this.camera);

		//var rayCaster = new THREE.Raycaster( this.camera.position, vector.sub( this.camera.position ).normalize() );
	

		/*
		_.each( self.markers, function( marker, idx ){
			self.scene.remove( marker );
		});
		*/

		
		// var intersects = rayCaster.intersectObjects( this.meshes, true );


		//  check intersection of stars
		// this.intersectStars(e);

		// var mouse = { x: 0, y: 0, z: 1 };

		

		// this where begin to transform the mouse cordinates to three.js cordinates
	  // mouse.x = ( e.clientX / window.innerWidth ) * 2 - 1;
	  // mouse.y = - ( e.clientY / window.innerHeight ) * 2 + 1;
	    
	  // this vector caries the mouse click cordinates
	  //var mouse_vector = new THREE.Vector3(0,0,0);
	  		//mouse_vector.set( mouse.x, mouse.y, mouse.z );

	 	// this.projector.unprojectVector( mouse_vector, this.camera );
	  
	  //mouse_vector.unproject(this.camera);

	  //var direction = mouse_vector.sub( this.camera.position ).normalize();
	  //rayCaster.set( this.camera.position, direction );
	    


		// check if the user moves the mouse over a planet or host star
		/*
		_.each( this.meshes, function( mesh, idx ){
			//window.utils.debug(mesh);
			if( mesh.position ) {
				intersects = rayCaster.intersectObject( [mesh] );

				if( intersects.length > 0 ) {
	  			window.utils.debug( intersects[ 0 ].object );
	  		}
			}
		});
		*/

		// s$('#tooltip').hide();
		// self.canvasElement.hideViewHelper();
		// this.checkStarMouseCollision(e);

	}


	updateMousePosition ( e ) {

		this.mouse.x = ( e.clientX / window.innerWidth ) * 2 - 1;
		this.mouse.y = - ( e.clientY / window.innerHeight ) * 2 + 1;

	}

}


//# sourceMappingURL=app.js.map
