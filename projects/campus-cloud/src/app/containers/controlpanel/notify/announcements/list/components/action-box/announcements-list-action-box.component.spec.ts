import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { DebugElement } from '@angular/core';

import { CPSession } from '@campus-cloud/session';
import { configureTestSuite } from '@campus-cloud/shared/tests';
import { SharedModule } from '@campus-cloud/shared/shared.module';
import { mockUser, mockSchool } from '@campus-cloud/session/mock';
import { getElementByCPTargetValue } from '@campus-cloud/shared/utils/tests';
import { CPI18nService, CPTrackingService } from '@campus-cloud/shared/services';
import { AnnouncementsListActionBoxComponent } from './announcements-list-action-box.component';

describe('AnnouncementsListActionBoxComponent', () => {
  configureTestSuite();
  beforeAll((done) => {
    (async () => {
      TestBed.configureTestingModule({
        imports: [SharedModule, RouterTestingModule],
        declarations: [AnnouncementsListActionBoxComponent],
        providers: [CPSession, CPI18nService, CPTrackingService, Location]
      });
      await TestBed.compileComponents();
    })()
      .then(done)
      .catch(done.fail);
  });

  let de: DebugElement;
  let session: CPSession;
  let component: AnnouncementsListActionBoxComponent;
  let fixture: ComponentFixture<AnnouncementsListActionBoxComponent>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AnnouncementsListActionBoxComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;

    session = TestBed.get(CPSession);
    session.g.set('user', mockUser);
    session.g.set('school', mockSchool);

    fixture.detectChanges();
  }));

  it('should init', () => {
    expect(component).toBeTruthy();
  });

  it('should have integration link button', () => {
    const intButton = getElementByCPTargetValue(de, 'integrations');
    expect(intButton).not.toBeNull();
  });

  it('int button should navigate to integrations', () => {
    const intButton: HTMLLinkElement = getElementByCPTargetValue(de, 'integrations').nativeElement;
    const href = intButton.getAttribute('href');
    expect(href).toEqual('/integrations');
  });
});
