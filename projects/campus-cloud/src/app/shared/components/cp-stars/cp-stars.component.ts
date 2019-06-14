import { Component, Input, OnInit, OnChanges } from '@angular/core';

export const STAR_SIZE = {
  SMALL: 'small',
  LARGE: 'large',
  DEFAULT: 'default'
};

const STAR_STATE = {
  empty: 'star_border',
  half: 'star_half',
  full: 'star'
};

const DISABLED = -1;

@Component({
  selector: 'cp-stars',
  templateUrl: './cp-stars.component.html',
  styleUrls: ['./cp-stars.component.scss']
})
export class CPStarsComponent implements OnInit, OnChanges {
  @Input() maxRate: number;
  @Input() avgRate: number;
  @Input() size: string;
  stars;
  totalRating;

  constructor() {}

  fillStars() {
    const _stars = [];
    this.stars.forEach((star, index) => {
      if (index + 1 <= this.totalRating) {
        star = Object.assign({}, star, {
          state: STAR_STATE.full,
          filled: true
        });
        _stars.push(star);

        return;
      }
      if (index + 1 === +this.totalRating.toFixed()) {
        if (this.totalRating % 1) {
          star = Object.assign({}, star, {
            state: STAR_STATE.half,
            filled: true
          });
          _stars.push(star);

          return;
        }
      }
      _stars.push(star);
    });

    this.stars = [..._stars];
  }

  drawStars() {
    this.stars = Array(this.maxRate)
      .fill('')
      .map((_, index) => {
        return { index, state: STAR_STATE.full, filled: false };
      });
  }

  ngOnInit() {
    if (this.maxRate === DISABLED) {
      /**
       *  event does not support the
       *  new basic feedback system
       **/

      this.totalRating = 0;
      this.maxRate = 5;
      this.drawStars();

      return;
    }
  }

  ngOnChanges() {
    if (this.maxRate !== DISABLED) {
      this.totalRating = +((this.avgRate * this.maxRate) / 100).toFixed(1);
      this.drawStars();
      this.fillStars();
    }
  }
}
