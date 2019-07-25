import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { CPSession } from '@campus-cloud/session';
import { configureTestSuite } from '@campus-cloud/shared/tests';
import { CPTrackingService } from '@campus-cloud/shared/services';
import { CPDatePipe, CPI18nPipe } from '@campus-cloud/shared/pipes';
import { CPHelpDeskComponent, CPHelpDeskPipes } from '@campus-cloud/shared/components';

describe('CPHelpDeskComponent', () => {
  configureTestSuite();

  beforeAll((done) => {
    (async () => {
      TestBed.configureTestingModule({
        imports: [RouterTestingModule],
        providers: [CPSession, CPDatePipe, CPTrackingService],
        declarations: [CPHelpDeskComponent, CPI18nPipe, CPHelpDeskPipes]
      });
      await TestBed.compileComponents();
    })()
      .then(done)
      .catch(done.fail);
  });

  let fixture: ComponentFixture<CPHelpDeskComponent>;
  let component: CPHelpDeskComponent;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CPHelpDeskComponent);
    component = fixture.componentInstance;
  }));

  it('should init', () => {
    expect(component).toBeTruthy();
  });
});
