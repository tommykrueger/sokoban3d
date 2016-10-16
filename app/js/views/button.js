import View from '../app/view';

export default class Button extends View {


  constructor ( options = {} ) {

    super();

    this.app = options.app;
    this.name = options.name;
    this.text = options.text;

    this.object = options.object;
    this.action = options.action;

    this.isActive = false;

    this.$template = $(`<button class="button button-round button-control button-inactive">${this.text}</button>`);

  }


  render ($element = $('body')) {

    $element.append( this.$template );
    this.initEvents();

  }


  initEvents () {

    this.$template.on('click', (e) => {

      if (!this.isActive) return;

      let $btn = $(e.currentTarget);
      this.app.level[this.object][this.action]();

    });

  }


  remove () {

    this.$template.remove();

  }


  activate() {

    this.isActive = true;
    this.$template.addClass('button-animated');

  }


  deactivate() {

    this.isActive = false;
    this.$template.removeClass('button-animated');

  }

}
