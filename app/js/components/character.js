//import THREE from 'three.js';
//import _ from 'underscore';
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

		if (this.utils.isIframe()) {

			parent.document.addEventListener('keydown', (e) => this.keyDown(e), false);

		} else {

			window.addEventListener('keydown', (e) => this.keyDown(e), false);

		}

  }


  getMesh() {
    return this.mesh;
  }


  keyDown(event) {

    event = event || window.event;

		event.preventDefault();

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

      this.app.level.addMove();
      this.app.level.lift.check();

      // this.hasFoundKey();

      this.level.checkSolved();

			// this.isOnBeamField();

    }

  }


  // check if there is an obstacle before moving
  canMove (direction) {

		if (this.app.level.solved)
			return false;

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

        this.app.level.addPush();

      } else {

        console.log('cannot move becase thee is a box o wall infont of anothe box');
        return false;

      }

    }

    return true;

  }


	/**
	 * Check if the character is inside a beam field
	 * If yes the player can activate a beam action to move the character to another game field
	 */
	isOnBeamField() {

		console.log('is on beam', this.app.level.isObjectAtPosition('beam', this.currentPosition));

		if (this.app.level.isObjectAtPosition('beam', this.currentPosition)) {

			this.app.level.beamer.activate();

		} else {

			this.app.level.beamer.deactivate();

		}

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
