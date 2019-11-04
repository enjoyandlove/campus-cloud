import { AnnouncementPriority } from './../../model/announcement.interface';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';

import { Announcement } from './../../model';
import { CPSession } from '@campus-cloud/session';
import { mockSchool } from '@campus-cloud/session/mock';
import { StoreService } from '@campus-cloud/shared/services';
import { CPTestModule } from '@campus-cloud/shared/tests/test.module';
import { AnnouncementFormComponent } from './announcement-form.component';

describe('AnnouncementFormComponent', () => {
  let session: CPSession;
  let storeService: StoreService;
  let component: AnnouncementFormComponent;
  let fixture: ComponentFixture<AnnouncementFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CPTestModule, ReactiveFormsModule],
      declarations: [AnnouncementFormComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnouncementFormComponent);
    component = fixture.componentInstance;
    component.form = Announcement.form();

    session = TestBed.get(CPSession);
    session.g.set('school', mockSchool);

    storeService = TestBed.get(StoreService);
    spyOn(storeService, 'getStores').and.returnValue(of([{ label: '---', value: null }]));
    fixture.detectChanges();
  });

  it('it should disable Emergency announcement for Campus Wide announcements', () => {
    let emrgencyDisabled = false;
    component.form.get('is_school_wide').setValue(false);
    fixture.detectChanges();

    emrgencyDisabled = component.types.find(
      ({ action }) => action === AnnouncementPriority.emergency
    ).disabled;

    expect(emrgencyDisabled).toBe(false);

    component.form.get('is_school_wide').setValue(true);
    fixture.detectChanges();

    emrgencyDisabled = component.types.find(
      ({ action }) => action === AnnouncementPriority.emergency
    ).disabled;

    expect(emrgencyDisabled).toBe(true);
  });

  it('should have 3 priotity types', () => {
    const requiredPriorities = [
      AnnouncementPriority.urgent,
      AnnouncementPriority.regular,
      AnnouncementPriority.emergency
    ];
    const availablePriorities = component.types.map((t) => t.action);

    requiredPriorities.forEach((p) => {
      expect(availablePriorities.includes(p)).toBe(true, `${p} is missing`);
    });
  });

  describe('ngOnInit', () => {
    it('should selectedType based on form priority control value', () => {
      expect(component.selectedType).not.toBeDefined();

      component.form.get('priority').setValue(AnnouncementPriority.urgent);

      component.ngOnInit();

      expect(component.selectedType).toBeDefined();
      expect(component.selectedType).toBe(
        component.types.find((t) => t.action === AnnouncementPriority.urgent)
      );
    });
  });
});
