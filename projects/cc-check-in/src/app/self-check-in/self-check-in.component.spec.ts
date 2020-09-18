import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelfCheckInComponent } from './self-check-in.component';
import { CPI18nPipe } from '@campus-cloud/shared/pipes';
import { provideMockStore } from '@ngrx/store/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule } from '@ngrx/store';
import { CheckinUtilsService } from '@campus-cloud/containers/callback/checkin/checkin.utils.service';
import { CPI18nService } from '@campus-cloud/shared/services';
import { SelfCheckInCallbackService } from '@projects/cc-check-in/src/app/self-check-in/services/self-check-in-callback.service';
import { SelfCheckInService } from '@projects/cc-check-in/src/app/self-check-in/services/self-check-in.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { EnvService } from '@campus-cloud/config/env';

describe('SelfCheckInComponent', () => {
  let component: SelfCheckInComponent;
  let fixture: ComponentFixture<SelfCheckInComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule, StoreModule],
      declarations: [SelfCheckInComponent, CPI18nPipe],
      providers: [
        provideMockStore({
          initialState: {}
        }),
        CPI18nPipe,
        CheckinUtilsService,
        CPI18nService,
        SelfCheckInService,
        SelfCheckInCallbackService,
        EnvService
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelfCheckInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
