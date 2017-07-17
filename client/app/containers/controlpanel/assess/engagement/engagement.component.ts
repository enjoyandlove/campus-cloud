import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'cp-engagement',
  templateUrl: './engagement.component.html',
  styleUrls: ['./engagement.component.scss']
})
export class EngagementComponent implements OnInit {
  constructor() { }

  ngOnInit() {
    console.log('Engagement Component Init');
  }
}
