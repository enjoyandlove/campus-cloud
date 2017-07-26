import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'cp-request-demo-assessment',
  templateUrl: './request-demo-assessment.component.html',
  styleUrls: ['./request-demo-assessment.component.scss']
})
export class RequestDemoAssessmentComponent implements OnInit {
  demoUrl = 'http://confirm.oohlalamobile.com/oohlala-assessment/';

  constructor( ) { }

  ngOnInit() { }
}
