import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'cp-feedback-already-submitted',
  templateUrl: './feedback-already-submitted.component.html',
  styleUrls: ['./feedback-already-submitted.component.scss']
})
export class FeedbackAlreadySubmittedComponent implements OnInit {
  @Input() heading: string;

  constructor() {}

  ngOnInit() {}
}
