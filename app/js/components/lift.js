//import THREE from 'three.js';

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
