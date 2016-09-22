import View from '../app/view';

export default class Interface extends View {
  

  constructor ( options = {} ) {

    super();

    this.app = options.app;

    this.points = 0; 
    this.moves = 0;
    this.movesBoxes = 0;

    this.$template = $(`
      <div id="interface">

        <div class="time">
          <span class="icon">Time: </span>
          <span class="time-seconds"></span>
        </div>

        <div class="points">
          <span class="icon">Points: </span>
          <span class="points-number">0</span>
        </div>

        <div class="moves">
          <span class="icon">Moves: </span>
          <span class="moves-number">0</span>
        </div>

        <div class="moves-boxes">
          <span class="icon">Pushes: </span>
          <span class="moves-boxes-number">0</span>
        </div>

      </div>

      <div id="items">
        <div class="item">
          <span class="icon">Hammer: </span>
          <span class="hammers-number">0</span>
        </div>  
      </div>
      
      <div id="buttons"></div>

      <div id="controls">
        <div class="button button-round button-control button-up">up</div>
        <div class="button button-round button-control button-left">left</div>
        <div class="button button-round button-control button-down">down</div>
        <div class="button button-round button-control button-right">right</div>
      </div>

    `);

  }


  render () {
    
    $('body').append( this.$template );

    this.initEvents();

  }


  initEvents () {

    this.$template.find('.button-up').on('click', (e) => {
      this.app.level.character.move('up');
    });

    this.$template.find('.button-left').on('click', (e) => {
      this.app.level.character.move('left');
    });

    this.$template.find('.button-down').on('click', (e) => {
      this.app.level.character.move('down');
    });

    this.$template.find('.button-right').on('click', (e) => {
      this.app.level.character.move('right');
    });

  }


  addPoints (points) {

    this.points += points;

  }


  addBoxMove () {

    this.movesBoxes++;

  }


  addMove () {

    this.moves++;

  }


  update () {

    this.$template.find('.points-number').text(this.points);
    this.$template.find('.moves-number').text(this.moves);
    this.$template.find('.moves-boxes-number').text(this.movesBoxes);

  }


  updateTime ( time ) {

    this.time = time;
    this.$template.find('.time .time-seconds').text( this.time.toFixed(0) );

  }
 

  remove () {

    this.$template.remove();

  }

}