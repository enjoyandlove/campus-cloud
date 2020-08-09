import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EnvService, MockEnvService } from '@campus-cloud/config/env';
import { CPTrackingService } from '@campus-cloud/shared/services';
import { RouterTestingModule } from '@angular/router/testing';

import { QrListNoContentComponent } from './list-no-content.component';
import { CPI18nPipe } from '@campus-cloud/shared/pipes';

describe('QrListNoContentComponent', () => {
  let component: QrListNoContentComponent;
  let fixture: ComponentFixture<QrListNoContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [CPTrackingService, { provide: EnvService, useClass: MockEnvService }],
      declarations: [QrListNoContentComponent, CPI18nPipe]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QrListNoContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
