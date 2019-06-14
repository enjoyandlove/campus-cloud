import { TestBed, ComponentFixture } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, DebugElement } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { By } from '@angular/platform-browser';

import { CPSession } from '@app//session';
import { configureTestSuite } from '@app//shared/tests';
import { CPI18nService, StoreService } from '@app//shared/services';
import { SharedModule } from '@app//shared/shared.module';
import { mockSchool, mockUser } from '@app/session/mock';
import { ListActionBoxComponent } from './list-action-box.component';
import { CPTrackingService } from '@app//shared/services/tracking.service';

describe('ListActionBoxComponent', () => {
  configureTestSuite();

  beforeAll((done) =>
    (async () => {
      TestBed.configureTestingModule({
        imports: [SharedModule, RouterTestingModule, HttpClientModule],
        declarations: [ListActionBoxComponent],
        providers: [CPSession, CPI18nService, CPTrackingService, StoreService],
        schemas: [NO_ERRORS_SCHEMA]
      });
      await TestBed.compileComponents();
    })()
      .then(done)
      .catch(done.fail)
  );

  let de: DebugElement;
  let session: CPSession;
  let component: ListActionBoxComponent;
  let fixture: ComponentFixture<ListActionBoxComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ListActionBoxComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;

    session = TestBed.get(CPSession);

    session.g.set('user', mockUser);
    session.g.set('school', mockSchool);

    fixture.detectChanges();
  });

  it('should init', () => {
    expect(true).toBe(true);
  });

  it('should show integration button based on showIntegration', () => {
    component.canCreateEvent = true;
    component.showIntegration = true;

    fixture.detectChanges();

    const button = de.query(By.css('.integrations'));
    expect(button).not.toBeNull();
  });

  it('should show integration button based on showIntegration', () => {
    component.canCreateEvent = true;
    component.showIntegration = false;

    fixture.detectChanges();

    const button = de.query(By.css('.integrations'));
    expect(button).toBeNull();
  });
});
