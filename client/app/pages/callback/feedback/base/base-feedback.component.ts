import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'cp-base-feedback',
  templateUrl: './base-feedback.component.html',
  styleUrls: ['./base-feedback.component.scss']
})
export class BaseFeedbackComponent implements OnInit {
  @Input() data: any;
  @Input() isEvent: boolean;
  @Input() isService: boolean;
  @Input() isSubmitted: Observable<boolean>;
  @Output() send: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() {
    if (!this.isEvent && !this.isService) {
      console.warn('BaseFeedbackComponent, needs an isEvent or isService');
    }
  }
}
