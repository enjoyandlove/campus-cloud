import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CPSession } from '@campus-cloud/session';
import { mockSchool } from '@campus-cloud/session/mock/school';
import { HealthPassComponent } from './health-pass.component';
import { configureTestSuite, CPTestModule } from '@campus-cloud/shared/tests';
import { CPI18nPipe } from '@campus-cloud/shared/pipes';
import { EState } from '@controlpanel/contact-trace/health-pass/health-pass.interface';
import { HealthPassService } from '@controlpanel/contact-trace/health-pass/services/health-pass.service';
import { provideMockStore } from '@ngrx/store/testing';

describe('HealthPassComponent', () => {
  configureTestSuite();

  beforeAll((done) => {
    (async () => {
      TestBed.configureTestingModule({
        declarations: [HealthPassComponent],
        imports: [CPTestModule],
        providers: [CPI18nPipe, HealthPassService, provideMockStore({
          initialState: {
            healthPassSettings: {
              healthPass: {
                healthPassList: []
              },
              notificationTemplate: {
                templates: []
              }
            }
          }
        })]
      });
      await TestBed.compileComponents();
    })()
      .then(done)
      .catch(done.fail);
  });

  let session: CPSession;
  let component: HealthPassComponent;
  let fixture: ComponentFixture<HealthPassComponent>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(HealthPassComponent);
    component = fixture.componentInstance;

    session = TestBed.get(CPSession);
    session.g.set('school', mockSchool);

    fixture.detectChanges();
  }));

  it('should assign icon for health pass list', function() {
    const inputList = [
      {
        state: EState.green
      },
      {
        state: EState.red
      },
      {
        state: EState.yellow
      },
      {
        state: EState.no
      }
    ];
    const expectedResult = [
      {
        state: EState.green,
        icon: '/assets/svg/contact-trace/health-pass/health-pass-green.svg',
        title: 'Green Health Pass'
      },
      {
        state: EState.red,
        icon: '/assets/svg/contact-trace/health-pass/health-pass-red.svg',
        title: 'Red Health Pass'
      },
      {
        state: EState.yellow,
        icon: '/assets/svg/contact-trace/health-pass/health-pass-yellow.svg',
        title: 'Yellow Health Pass'
      },
      {
        state: EState.no,
        icon: '/assets/svg/contact-trace/health-pass/health-pass-no.svg',
        title: 'No Health Pass'
      }
    ];
    const result = component.assignIcons(inputList);
    expect(result).toEqual(expectedResult);
  });
});
