import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { configureTestSuite } from '@shared/tests';
import { SharedModule } from '@shared/shared.module';
import { DashboardOnboardingComponent } from './onboarding.component';

describe('DashboardOnboardingComponent', () => {
  configureTestSuite();
  beforeAll((done) =>
    (async () => {
      await TestBed.configureTestingModule({
        imports: [SharedModule, RouterTestingModule],
        declarations: [DashboardOnboardingComponent]
      }).compileComponents();
    })()
      .then(done)
      .catch(done.fail)
  );

  let component: DashboardOnboardingComponent;
  let fixture: ComponentFixture<DashboardOnboardingComponent>;

  beforeEach(
    async(() => {
      fixture = TestBed.createComponent(DashboardOnboardingComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
