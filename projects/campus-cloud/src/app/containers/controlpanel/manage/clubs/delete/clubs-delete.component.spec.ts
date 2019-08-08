import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';

import { MockClubService } from '../tests';
import { ClubsService } from './../clubs.service';
import { MODAL_DATA } from '@campus-cloud/shared/services';
import { ClubsDeleteComponent } from './clubs-delete.component';
import { SharedModule } from '@campus-cloud/shared/shared.module';
import { CPDeleteModalComponent } from '@campus-cloud/shared/components';
import { configureTestSuite, CPTestModule } from '@campus-cloud/shared/tests';
import { isClubAthletic } from '@controlpanel/manage/clubs/clubs.athletics.labels';

describe('ClubsDeleteComponent', () => {
  configureTestSuite();
  beforeAll((done) => {
    (async () => {
      TestBed.configureTestingModule({
        imports: [CPTestModule, SharedModule, RouterTestingModule],
        declarations: [ClubsDeleteComponent],
        providers: [
          { provide: ClubsService, useClass: MockClubService },
          {
            provide: MODAL_DATA,
            useValue: {
              data: {
                club: {},
                isAthletic: isClubAthletic.club
              },
              onClose: () => {}
            }
          }
        ]
      });
      await TestBed.compileComponents();
    })()
      .then(done)
      .catch(done.fail);
  });

  let component: ClubsDeleteComponent;
  let deleteModal: CPDeleteModalComponent;
  let fixture: ComponentFixture<ClubsDeleteComponent>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ClubsDeleteComponent);
    component = fixture.componentInstance;
    deleteModal = fixture.debugElement.query(By.directive(CPDeleteModalComponent))
      .componentInstance;

    fixture.detectChanges();
  }));

  it('should init', () => {
    expect(component).toBeTruthy();
  });

  it('should call onDelete on cp-delete-modal deleteClick', () => {
    spyOn(component, 'onDelete');
    deleteModal.deleteClick.emit();

    expect(component.onDelete).toHaveBeenCalled();
  });

  it('should call onClose on cp-delete-modal cancelClick', () => {
    spyOn(component, 'onClose');
    deleteModal.cancelClick.emit();

    expect(component.onClose).toHaveBeenCalled();
  });
});
