import { configureTestSuite, CPTestModule } from '@campus-cloud/shared/tests';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CheckinRegisterComponent } from '@campus-cloud/containers/callback/checkin';
import { CPI18nPipe } from '@campus-cloud/shared/pipes';
import ICheckIn from '@campus-cloud/containers/callback/checkin/checkin.interface';
import { Store, StoreModule } from '@ngrx/store';
import { baseActionClass, baseReducers, IHeader } from '@campus-cloud/store';

const simpleData: ICheckIn = {
  color: 0,
  id: 0,
  rank: 0,
  end: 0,
  type: 0,
  title: 'title',
  start: 0,
  ref_id: 0,
  status: 0,
  user_id: 0,
  location: 'location',
  extra_id: 0,
  latitude: 0,
  longitude: 0,
  extra_str: 'extra_str',
  qr_img_url: 'qr_img_url',
  poster_url: 'poster_url',
  alert_time: 0,
  is_all_day: true,
  has_invite: true,
  school_name: 'school_name',
  description: 'description',
  calendar_id: 0,
  extra_status: 0,
  has_gallery: true,
  is_recurring: true,
  has_checkout: true,
  qr_img_base64: 'qr_img_base64',
  extra_data_id: 0,
  last_edit_time: 0,
  attendees: [],
  tz_zoneinfo_str: 'tz_zoneinfo_str',
  poster_thumb_url: 'poster_thumb_url',
  event_identifier: 'event_identifier',
  app_logo_img_url: 'app_logo_img_url',
  featured_image_url: 'featured_image_url',
  app_logo_img_base64: 'app_logo_img_base64',
  rating_scale_maximum: 0,
  custom_basic_feedback_label: 'custom_basic_feedback_label',
  attend_verification_methods: [1, 3, 5, 6],
  deep_link_url: 'deep_link_url'
};
describe('CheckinRegisterComponent Tests', () => {
  configureTestSuite();

  beforeAll((done) => {
    (async () => {
      TestBed.configureTestingModule({
        imports: [
          CPTestModule,
          StoreModule.forFeature('base', baseReducers, {
            initialState: {
              ROUTER: {
                state: {
                  url: window.location.pathname,
                  params: {},
                  queryParams: {}
                },
                navigationId: 0
              }
            }
          })
        ],
        providers: [CPI18nPipe],
        declarations: [CheckinRegisterComponent],
        schemas: [NO_ERRORS_SCHEMA]
      });
      await TestBed.compileComponents();
    })()
      .then(done)
      .catch(done.fail);
  });

  let fixture: ComponentFixture<CheckinRegisterComponent>;
  let store: Store<IHeader>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckinRegisterComponent);
    store = TestBed.get(Store);
    fixture.componentInstance.data = simpleData;
    fixture.detectChanges();
  });

  it('sharable link input should be read only', function() {
    const sharableLink: HTMLElement = fixture.nativeElement.querySelector('.share-bloc input');
    const readonly = sharableLink.attributes.getNamedItem('readonly');
    expect(readonly).toBeTruthy();
  });

  it('snackbar notification should be called when we click on copy sharable link', function() {
    const dispatchSpy = spyOn(store, 'dispatch');
    const copyBtn: HTMLElement = fixture.nativeElement.querySelector(
      '.share-bloc button.share-button'
    );
    copyBtn.click();

    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledWith(
      new baseActionClass.SnackbarSuccess({
        body: 'Copied to clipboard'
      })
    );
  });
});
