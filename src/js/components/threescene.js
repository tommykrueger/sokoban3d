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

