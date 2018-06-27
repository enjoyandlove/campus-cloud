import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { CPSession } from '../../../session';
import { AdminService, CPTrackingService } from '../../services';
import { amplitudeEvents } from '../../constants/analytics';

@Component({
  selector: 'cp-stepper',
  templateUrl: './cp-stepper.component.html',
  styleUrls: ['./cp-stepper.component.scss']
})
export class CPStepperComponent implements OnInit {
  @Input() range: number;
  @Input() currentStep: number;

  @Output() currentSlide: EventEmitter<any> = new EventEmitter();

  disabled = false;
  start: number;
  totalSteps;

  constructor(
    private session: CPSession,
    private adminService: AdminService,
    private cpTracking: CPTrackingService
  ) {}

  backStep(step: number) {
    this.currentStep = --step;
    this.currentSlide.emit(this.currentStep);
  }

  nextStep(step: number) {
    if (++step <= this.totalSteps.length) {
      this.currentStep = step;
      this.currentSlide.emit(this.currentStep);
    } else {
      this.updateAdmin();
    }
  }

  updateAdmin() {
    this.disabled = true;
    const body = {
      flags: {
        is_onboarding: true
      }
    };

    this.adminService.updateAdmin(this.session.g.get('user').id, body).subscribe((response) => {
      this.session.g.set('user', response);
      this.cpTracking.amplitudeEmitEvent(amplitudeEvents.CAROSEL_WHEEL);
      $('#openOnboardingModal').modal('hide');
    });
  }

  ngOnInit() {
    this.start = 1;
    this.totalSteps = Array.from(Array(this.range), (_, i) => this.start + i);
  }
}
