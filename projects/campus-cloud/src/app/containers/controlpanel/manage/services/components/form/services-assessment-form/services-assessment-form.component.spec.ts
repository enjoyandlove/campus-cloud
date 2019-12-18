import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { configureTestSuite, CPTestModule } from '@campus-cloud/shared/tests';
import { ServicesModel } from '@controlpanel/manage/services/model/services.model';
import { ServicesAssessmentFormComponent } from './services-assessment-form.component';
import { RatingScale, ServiceAttendance } from '@controlpanel/manage/services/services.status';

describe('ServicesAssessmentFormComponent', () => {
  configureTestSuite();

  beforeAll((done) => {
    (async () => {
      TestBed.configureTestingModule({
        declarations: [ServicesAssessmentFormComponent],
        providers: [],
        imports: [CPTestModule],
        schemas: [NO_ERRORS_SCHEMA]
      });
      await TestBed.compileComponents();
    })()
      .then(done)
      .catch(done.fail);
  });

  let fixture: ComponentFixture<ServicesAssessmentFormComponent>;
  let component: ServicesAssessmentFormComponent;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ServicesAssessmentFormComponent);
    component = fixture.componentInstance;

    component.form = ServicesModel.form();

    fixture.detectChanges();
  }));

  it('should set service attendance ON', () => {
    component.onToggleAttendance(false);

    expect(component.form.get('default_basic_feedback_label').value).toBeNull();
    expect(component.form.get('rating_scale_maximum').value).toEqual(RatingScale.noScale);
    expect(component.form.get('service_attendance').value).toEqual(ServiceAttendance.disabled);
  });

  it('should set service attendance OFF', () => {
    const feedbackLabel = component.cpI18n.translate('services_default_feedback_question');

    component.onToggleAttendance(true);

    expect(component.form.get('rating_scale_maximum').value).toEqual(RatingScale.maxScale);
    expect(component.form.get('default_basic_feedback_label').value).toEqual(feedbackLabel);
    expect(component.form.get('service_attendance').value).toEqual(ServiceAttendance.enabled);
  });
});
