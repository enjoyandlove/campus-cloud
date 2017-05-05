import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'cp-base-feedback',
  templateUrl: './base-feedback.component.html',
  styleUrls: ['./base-feedback.component.scss']
})
export class BaseFeedbackComponent implements OnInit {
  @Input() isEvent: boolean;
  @Input() isService: boolean;

  constructor() { }

  ngOnInit() {
    if (!this.isEvent && !this.isService) {
      console.warn('BaseFeedbackComponent, needs an isEvent or isService');
    }
  }
}
