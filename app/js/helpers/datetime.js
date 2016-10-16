import Log from '../app/log';
import Utils from '../app/utils';

export default class Datetime {


  constructor ( options = {} ) {

    this.time = options.time;

  }


  setTime ( time ) {

    this.time = time;

  }


  /**
   * Retrieves a time based string in the format:
   * ALso adds leading zeros.
   * 
   * mm:ss => 00:00
   */
  getMinutesWithSeconds () {

    let min = Math.floor(this.time / 60);
    let sec = (this.time - min * 60).toFixed(0);

    if (min < 10) {
      min = '0' + min;
    }

    if (sec < 10) {
      sec = '0' + sec;
    }

    return min + ':' + sec;

  }


}
