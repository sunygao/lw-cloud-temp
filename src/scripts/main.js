import Zepto from 'jquery';
import { TweenMax, TimelineMax } from 'TweenMax';
import _ from 'lodash-min';
import Config from 'config/config';
import CV from 'config/CV';


class Main {
  onReady() {
    console.log('init main');
  }
   
}

//init main when document is ready
var main = module.exports = new Main();
$(document).ready(main.onReady.bind(main));

