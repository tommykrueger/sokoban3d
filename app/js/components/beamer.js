//import THREE from 'three.js';

/**
 * A Beamer is a structure to move the character to a different field
 */
export default class Beamer {


	constructor (options = {}) {

    this.app = options.app;
    this.beamFields = options.beamFields;

    this.meshes = [];

	}


  render () {

    this.liftItems();

  }


  /**
   * find the items that ae on the lift and waiting fo moving
   */
  getItemsInBeam () {

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
  activate () {



  }


	deactivate () {


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
