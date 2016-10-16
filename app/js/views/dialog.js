import View from '../app/view';

export default class Dialog extends View {


  constructor ( options = {} ) {

    super();

    this.app = options.app;
    this.title = options.title;
    this.text = options.text;
    this.actions = options.actions;

    this.prepareTemplate();
    this.render();
    this.initEvents();

  }


  prepareTemplate () {

    this.$template = $(`<div class="dialog"></div>`);

    this.$title = $(`<div class="dialog-title">${this.title}</div>`);
    this.$text = $(`<div class="dialog-content">${this.text}</div>`);

    this.$template.append( this.$title );
    this.$template.append( this.$text );
    this.$template.append( this.$actions );

  }


  render () {

    $('body').find('.dialog').remove();
    $('body').append(this.$template);

    this.resizeToContent();

  }


  initEvents () {


    this.$template.find('.button-round').on('click', (e) => {

      let $btn = $(e.currentTarget);
      let resolution = $btn.data('resolution');

      this.$template.find('.button-round').not(this).removeClass('active');
      $btn.toggleClass('active');

      this.action.scope.setResolution(resolution);

      this.$template.find('.action-btn').removeClass('hidden');

    });


    this.$template.find('.action-btn').on('click', (e) => {

      this.close();
      this.action.scope[this.action.function]();

    });


    this.actions.forEach( (action) => {

      $(action.id).on('click', (e) => {
        e.preventDefault();

        this.app[action.action]();
        this.close();

      });

    });

  }


  resizeToContent() {

    let contentWidth = this.$template.outerWidth();
    let contentHeight = this.$template.outerHeight();

    this.$template.css({
      left: $(window).width() / 2 - (contentWidth/2),
      top: $(window).height() / 2 - (contentHeight/2)
    });

  }


  close () {

    this.$template.remove();

  }

}
