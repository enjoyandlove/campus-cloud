import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelfRegisterComponent } from './self-register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { provideMockStore } from '@ngrx/store/testing';
import { CPI18nPipe } from '@campus-cloud/shared/pipes';
import { StoreModule } from '@ngrx/store';

const simpleData = {
    color: 0,
    id: 0,
    rank: 0,
    end: 0,
    type: 0,
    title: '',
    start: 0,
    ref_id: 0,
    status: 0,
    user_id: 0,
    location: '',
    extra_id: 0,
    latitude: 0,
    longitude: 0,
    extra_str: '',
    qr_img_url: '',
    poster_url: '',
    alert_time: 0,
    is_all_day: false,
    has_invite: false,
    school_name: '',
    description: '',
    calendar_id: 0,
    extra_status: 0,
    has_gallery: false,
    is_recurring: false,
    has_checkout: false,
    qr_img_base64: '',
    extra_data_id: 0,
    last_edit_time: 0,
    attendees: [],
    tz_zoneinfo_str: '',
    poster_thumb_url: '',
    event_identifier: '',
    app_logo_img_url: '',
    featured_image_url: '',
    app_logo_img_base64: '',
    rating_scale_maximum: 0,
    custom_basic_feedback_label: '',
    attend_verification_methods: [],
    deep_link_url: '',
};

describe('SelfRegisterComponent', () => {
  let component: SelfRegisterComponent;
  let fixture: ComponentFixture<SelfRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ ReactiveFormsModule, StoreModule ],
      declarations: [ SelfRegisterComponent, CPI18nPipe ],
      providers: [provideMockStore({
        initialState: {
        }
      }), CPI18nPipe]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelfRegisterComponent);
    component = fixture.componentInstance;
    component.data = simpleData;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
