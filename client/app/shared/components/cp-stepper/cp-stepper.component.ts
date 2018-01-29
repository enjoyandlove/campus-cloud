import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { CPSession } from '../../../session';
import { AdminService } from '../../services';

@Component({
  selector: 'cp-stepper',
  templateUrl: './cp-stepper.component.html',
  styleUrls: ['./cp-stepper.component.scss']
})

export class CPStepperComponent implements OnInit {
  @Input() range: number;
  @Input() currentStep: number;

  @Output() currentSlide: EventEmitter<any> = new EventEmitter();

  start: number;
  totalSteps;

  constructor(private session: CPSession,
              private adminService: AdminService) {
  }

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
    const body = {
      flags: {
        is_onboarding: true
      }
    };

    this.adminService.updateAdmin(this.session.g.get('user').id, body).subscribe(
      (response) => {
        this.session.g.set('user', response);
        $('#openOnboardingModal').modal('hide');
      }
    );
  }

  ngOnInit() {
    this.start = 1;
    this.totalSteps = Array.from(Array(this.range), (_, i) => this.start + i);
  }
}
