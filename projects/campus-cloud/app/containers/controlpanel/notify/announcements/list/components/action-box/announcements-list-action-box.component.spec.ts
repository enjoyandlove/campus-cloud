import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { DebugElement } from '@angular/core';

import { CPSession } from '@app/session';
import { configureTestSuite } from '@shared/tests';
import { SharedModule } from '@shared/shared.module';
import { mockUser, mockSchool } from '@app/session/mock';
import { getElementByCPTargetValue } from '@shared/utils/tests';
import { CPI18nService, CPTrackingService } from '@shared/services';
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
