import { Component, OnInit, Input } from '@angular/core';
import { CPI18nService } from '../../services';

import { environment } from '@campus-cloud/src/environments/environment';

@Component({
  selector: 'cp-onboarding',
  templateUrl: './cp-onboarding.component.html',
  styleUrls: ['./cp-onboarding.component.scss']
})
export class CPOnboardingComponent implements OnInit {
  @Input() range: number;
  @Input() currentStep: number;

  onBoardingSteps;

  constructor(private cpI18n: CPI18nService) {}

  getCurrentSlide(event: number): void {
    this.currentStep = event;
  }

  ngOnInit() {
    this.currentStep = 1;
    this.onBoardingSteps = [
      {
        id: 1,
        img: `${environment.root}src/assets/png/onboarding/step_1.png`,
        title: this.cpI18n.translate('on_boarding_step_1_title'),
        description_1: this.cpI18n.translate('on_boarding_step_1_description_1'),
        description: this.cpI18n.translate('on_boarding_step_1_description')
      },
      {
        id: 2,
        img: `${environment.root}src/assets/png/onboarding/step_2.png`,
        title: this.cpI18n.translate('on_boarding_step_2_title'),
        description: this.cpI18n.translate('on_boarding_step_2_description')
      },
      {
        id: 3,
        img: `${environment.root}src/assets/png/onboarding/step_3.png`,
        title: this.cpI18n.translate('on_boarding_step_3_title'),
        description: this.cpI18n.translate('on_boarding_step_3_description')
      },
      {
        id: 4,
        img: `${environment.root}src/assets/png/onboarding/step_4.png`,
        title: this.cpI18n.translate('on_boarding_step_4_title'),
        description: this.cpI18n.translate('on_boarding_step_4_description')
      }
    ];

    this.range = this.onBoardingSteps.length;
  }
}
