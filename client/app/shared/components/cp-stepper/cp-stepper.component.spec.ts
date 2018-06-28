import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { CPSession } from '../../../session';
import { CPStepperComponent } from './cp-stepper.component';
import { AdminService, CPTrackingService } from '../../services';

class MockAdminService {
  updateAdmin(_, body: any) {
    let is_onboarding;

    is_onboarding = body.flags.is_onboarding;

    return is_onboarding;
  }
}

describe('CPStepperComponent', () => {
  let spy;
  let comp: CPStepperComponent;
  let service: AdminService;
  let fixture: ComponentFixture<CPStepperComponent>;

  const id = 123;
  const last = 4;
  const start = 1;
  const totalLength = 4;
  const body = {
    flags: {
      is_onboarding: true
    }
  };

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [CPStepperComponent],
        imports: [RouterTestingModule],
        providers: [
          CPSession,
          CPTrackingService,
          { provide: AdminService, useClass: MockAdminService }]
      })
        .overrideComponent(CPStepperComponent, {
          set: {
            template: '<div>No Template</div>'
          }
        })
        .compileComponents()
        .then(() => {
          fixture = TestBed.createComponent(CPStepperComponent);
          comp = fixture.componentInstance;
          service = TestBed.get(AdminService);
        });
    })
  );

  it('backStep() should decrement current step', () => {
    comp.backStep(2);
    expect(comp.currentStep).toEqual(1);
  });

  it('nextStep() should increment current step', () => {
    comp.totalSteps = Array.from(Array(totalLength), (_, i) => start + i);
    comp.nextStep(1);
    expect(comp.currentStep).toEqual(2);
  });

  it('should call updateAdmin() method on last step', () => {
    spy = spyOn(comp, 'updateAdmin');
    comp.totalSteps = Array.from(Array(totalLength), (_, i) => start + i);

    expect(spy).not.toHaveBeenCalled();
    comp.nextStep(last);

    expect(spy).toHaveBeenCalled();
    expect(service.updateAdmin(id, body)).toBeTruthy();
  });
});
