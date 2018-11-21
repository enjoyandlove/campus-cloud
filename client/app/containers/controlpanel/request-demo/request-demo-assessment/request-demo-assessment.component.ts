import { Component } from '@angular/core';

import { environment } from './../../../../../environments/environment';

@Component({
  selector: 'cp-request-demo-assessment',
  templateUrl: './request-demo-assessment.component.html',
  styleUrls: ['./request-demo-assessment.component.scss']
})
export class RequestDemoAssessmentComponent {
  bgImage = `${environment.root}public/png/request-demo/assess/hero.jpg`;
  trackImage = `${environment.root}public/png/request-demo/assess/ic_track.png`;
  assessImage = `${environment.root}public/png/request-demo/assess/ic_assess.png`;
  insightImage = `${environment.root}public/png/request-demo/assess/ic_get.png`;
  identifyImage = `${environment.root}public/png/request-demo/assess/ic_identify.png`;
  mailTo = "mailto:cm@readyeducation.com?subject=I'd like to learn more about OOHLALA Assessment!";
}
