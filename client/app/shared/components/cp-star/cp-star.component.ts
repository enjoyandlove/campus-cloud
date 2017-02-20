import { Component, OnInit, Input } from '@angular/core';

export const STAR_SIZE = {
  'SMALL': 'small',
  'LARGE': 'large',
  'DEFAULT': 'default'
};

@Component({
  selector: 'cp-star',
  templateUrl: './cp-star.component.html',
  styleUrls: ['./cp-star.component.scss']
})
export class CPStarComponent implements OnInit {
  @Input() data: { filled: boolean };
  star_full;
  star_empty;
  STAR_SIZE;
  star;

  constructor() {
    this.star_empty = '&star;';
    this.star_full = '&starf;';
  }

  ngOnInit() {
    this.star = this.data.filled ? this.star_full : this.star_empty;
    this.STAR_SIZE = STAR_SIZE.DEFAULT;
  }
}
