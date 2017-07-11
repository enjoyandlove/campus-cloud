import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'cp-feedback-stars',
  templateUrl: './feedback-stars.component.html',
  styleUrls: ['./feedback-stars.component.scss']
})
export class FeedbackStarsComponent implements OnInit {
  @Output() rated: EventEmitter<number> = new EventEmitter();
  rating = 0;

  constructor() { }

  onRate(target: HTMLElement): void {
    this.rating = parseInt(target.attributes['data-value'].value, 10);
    this.rated.emit(this.rating);
  }

  ngOnInit() { }
}
