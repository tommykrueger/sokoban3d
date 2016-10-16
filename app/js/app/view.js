export var __useDefault = true;

import Utils from './utils';

import Template from '../views/template';

/**
 * View base class
 * Used for all DOM - related objects
 *
 */

export default class View {

	constructor ( options = {} ) {

		this.options = options;
		this.app = options.app;

		this.utils = new Utils();

		this.name = '';
		this.$view = ``;

	}

	setData() {

	}

	render() {

		this.$el = this.$view;
		return this.$el;

	}

	getHtml() {

		return this.$el.html();

	}

	appendTo( $element ) {



	}

}
