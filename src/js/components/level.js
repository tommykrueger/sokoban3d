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