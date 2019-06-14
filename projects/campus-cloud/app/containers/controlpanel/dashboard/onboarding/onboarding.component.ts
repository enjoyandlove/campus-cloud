import { Component, OnInit } from '@angular/core';

import { environment } from '@campus-cloud/environments/environment';

@Component({
  selector: 'cp-onboarding',
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.scss']
})
export class DashboardOnboardingComponent implements OnInit {
  onboardingImg = `${environment.root}assets/default/onboarding.jpg`;

  constructor() {}

  ngOnInit() {}
}
