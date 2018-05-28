/*tslint:disable:max-line-length */
import { AudienceService } from './../../../../../containers/controlpanel/audience/audience.service';
import { Observable } from 'rxjs/Observable';
import { CPI18nService } from './../../../../../shared/services/i18n.service';
import { CPSession } from './../../../../../session/index';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { AudienceSavedBodyComponent } from './audience-saved-body.component';
import { SharedModule } from '../../../../../shared/shared.module';

const mockAudiences = [
  {
    id: 1,
    name: 'hello',
    count: 1
  }
];

class MockService {
  dummy;

  getAudiences(search, startRange, endRange) {
    this.dummy = { search, startRange, endRange };

    return Observable.of(mockAudiences);
  }
}

describe('AudienceSavedBodyComponent', () => {
  let session: CPSession;
  let comp: AudienceSavedBodyComponent;
  let fixture: ComponentFixture<AudienceSavedBodyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [AudienceSavedBodyComponent],
      providers: [CPSession, CPI18nService, { provide: AudienceService, useClass: MockService }],
      schemas: [NO_ERRORS_SCHEMA]
    });

    fixture = TestBed.createComponent(AudienceSavedBodyComponent);
    session = TestBed.get(CPSession);
    comp = fixture.componentInstance;
    session.g.set('school', { id: 1 });

    comp.importedAudience$ = Observable.of(null);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(AudienceSavedBodyComponent).toBeTruthy();
  });

  it('parsedAudience', () => {
    expect(comp.parsedAudience(mockAudiences).length).toBe(2);
    expect(comp.parsedAudience(mockAudiences)[1]).toEqual({
      action: 1,
      label: 'hello',
      userCount: 1
    });

    expect(comp.parsedAudience([]).length).toBe(0);
  });
});
