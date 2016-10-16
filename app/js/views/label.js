import View from '../app/view';

export default class Label extends View {


  constructor ( options = {} ) {

    super();

    this.app = options.app;
    this.data = options.data;
    this.planetsystem = options.planetsystem;

    this.planetsystemName = this.planetsystem.name.toLowerCase().replace(' ', '-');
    this.planetName = this.data.name.toLowerCase().replace(' ', '-');

    this.$template = $(`
      <span class="label label-${this.planetsystemName} label-${this.planetName}">
        <span class="label-marker"></span>
        ${this.data.name}
      </span>
    `);

    this.render();
    this.initEvents();

  }


  render () {

    this.$template.css({'color': '#' + this.utils.orbitColors[ this.app.systems.length ].toString(16) });

    $('#labels').append( this.$template );

  }


  initEvents () {


    this.$template.on('click', (e) => {

      let $btn = $(e.currentTarget);

      console.log('load planet data');

    });


    this.$template.on('mouseover', (e) => {

      console.log('planet mouseover');

    });

    this.$template.on('mouseout', (e) => {

      console.log('planet mouseout');

    });

  }


  remove () {

    this.$template.remove();

  }


  updatePosition (object) {

    //let pos = window.utils.getPosition2D( mesh.parent.parent, self.camera, self.projector);
    let pos = this.utils.toScreenPosition( object, this.app.camera );

    this.$template.css({
      'left': pos.x + 'px',
      'top': pos.y + 'px'
    });

  }

}
