import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';

import { CPSession } from '@campus-cloud/session';
import { mockAnnouncement } from './../tests/mocks';
import { mockSchool } from '@campus-cloud/session/mock';
import { CPTestModule } from '@campus-cloud/shared/tests';
import { AnnouncementsModule } from './../announcements.module';
import { AnnouncementsService } from './../announcements.service';
import { ScheduledEditComponent } from './scheduled-edit.component';

describe('ScheduledEditComponent', () => {
  let session: CPSession;
  let service: AnnouncementsService;
  let component: ScheduledEditComponent;
  let fixture: ComponentFixture<ScheduledEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore()],
      imports: [CPTestModule, AnnouncementsModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduledEditComponent);
    component = fixture.componentInstance;

    session = TestBed.get(CPSession);
    service = TestBed.get(AnnouncementsService);

    session.g.set('school', mockSchool);
    spyOn(service, 'getAnnouncementById').and.returnValue(of(mockAnnouncement));
    spyOn(service, 'updateAnnouncement');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
