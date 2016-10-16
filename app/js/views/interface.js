import View from '../app/view';

import Datetime from '../helpers/datetime';

export default class Interface extends View {


  constructor ( options = {} ) {

    super();

    this.app = options.app;
    this.datetime = new Datetime();

    this.$template = $(`
      <div id="interface">

        <div class="level">
          <span class="level-name"></span>
          <span class="level-difficulty"></span>
        </div>

        <div class="time">
          <span class="icon">Time: </span>
          <span class="time-seconds">00:00</span>
        </div>

        <div class="moves">
          <span class="icon">Moves: </span>
          <span class="number-moves">0</span>
        </div>

        <div class="pushes">
          <span class="icon">Pushes: </span>
          <span class="number-pushes">0</span>
        </div>

        <div class="help" title="How to play">
          <span class="help-icon" data-action="openLightbox" data-view="">i</span>
        </div>

      </div>

      <div id="items">
        <!--
        <div class="item">
          <span class="icon">Hammer: </span>
          <span class="hammers-number">0</span>
        </div>
        -->
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


  setLevelName (level) {

    this.$template.find('.level-name').text( level.world + '@' + level.name);

    if (level.difficulty) {
      this.$template.find('.level-difficulty').text('('+ level.difficulty +' level)');
    }

  }


  setMoves (moves) {

    this.$template.find('.number-moves').text(moves);

  }


  setPushes (pushes) {

    this.$template.find('.number-pushes').text(pushes);

  }


  updateTime ( time ) {

    this.datetime.setTime(time);
    this.$template.find('.time .time-seconds').text( this.datetime.getMinutesWithSeconds() );

  }


  remove () {

    this.$template.remove();

  }

}
