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