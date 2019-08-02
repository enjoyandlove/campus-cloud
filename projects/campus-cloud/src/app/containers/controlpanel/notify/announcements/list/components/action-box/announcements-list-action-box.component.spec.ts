import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { DebugElement } from '@angular/core';

import { CPSession } from '@campus-cloud/session';
import { mockUser, mockSchool } from '@campus-cloud/session/mock';
import { configureTestSuite, CPTestModule } from '@campus-cloud/shared/tests';
import { getElementByCPTargetValue } from '@campus-cloud/shared/utils/tests';
import { AnnouncementsListActionBoxComponent } from './announcements-list-action-box.component';

describe('AnnouncementsListActionBoxComponent', () => {
  configureTestSuite();
  beforeAll((done) => {
    (async () => {
      TestBed.configureTestingModule({
        imports: [CPTestModule, RouterTestingModule],
        declarations: [AnnouncementsListActionBoxComponent],
        providers: [Location]
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
