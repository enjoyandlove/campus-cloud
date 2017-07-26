import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'cp-request-demo-assessment',
  templateUrl: './request-demo-assessment.component.html',
  styleUrls: ['./request-demo-assessment.component.scss']
})
export class RequestDemoAssessmentComponent implements OnInit {
  demoUrl = 'http://confirm.oohlalamobile.com/oohlala-assessment/';

  bgImage = require('../../../../../public/png/request-demo/assess/hero.jpg');
  trackImage = require('../../../../../public/png/request-demo/assess/ic_track.png');
  assessImage = require('../../../../../public/png/request-demo/assess/ic_assess.png');
  insightImage = require('../../../../../public/png/request-demo/assess/ic_get.png');
  identifyImage = require('../../../../../public/png/request-demo/assess/ic_identify.png');


  constructor( ) { }

  ngOnInit() { }
}
