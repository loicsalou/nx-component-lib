import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {swipeAnimation} from './swiper-animations';

@Component({
             selector: 'zas-swiper',
             templateUrl: './swiper.component.html',
             styleUrls: [ './swiper.component.scss' ],
             animations: [ swipeAnimation ]
           })
export class SwiperComponent implements OnInit {
  @Output() onSwipe: EventEmitter<number> = new EventEmitter();

  state;

  constructor() {
  }

  ngOnInit() {
    this.state = 'in';
  }

  swipeLeft() {
    this.state = 'left';
    this.onSwipe.emit(-1);
  }

  swipeRight() {
    this.state = 'right';
    this.onSwipe.emit(1);
  }

  stateIn(event) {
    this.state = 'in';
  }
}
