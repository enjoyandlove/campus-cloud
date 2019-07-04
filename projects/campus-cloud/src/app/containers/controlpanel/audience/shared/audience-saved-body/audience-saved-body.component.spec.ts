import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of as observableOf } from 'rxjs';

import { CPSession } from '@campus-cloud/session';
import { CPI18nService } from '@campus-cloud/shared/services';
import { SharedModule } from '@campus-cloud/shared/shared.module';
import { AudienceUtilsService } from './../../audience.utils.service';
import { AudienceSavedBodyComponent } from './audience-saved-body.component';
import { AudienceService } from '@campus-cloud/containers/controlpanel/audience/audience.service';

const mockAudiences = [
  {
    id: 1,
    name: 'hello',
    count: 1,
    isList: true,
    type: 2
  }
];

class MockService {
  dummy;

  getAudiences(search, startRange, endRange) {
    this.dummy = { search, startRange, endRange };

    return observableOf(mockAudiences);
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
      providers: [
        CPSession,
        CPI18nService,
        AudienceUtilsService,
        { provide: AudienceService, useClass: MockService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });

    fixture = TestBed.createComponent(AudienceSavedBodyComponent);
    session = TestBed.get(CPSession);
    comp = fixture.componentInstance;
    session.g.set('school', { id: 1 });

    comp.importedAudience$ = observableOf(null);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(AudienceSavedBodyComponent).toBeTruthy();
  });

  it('parsedAudience', () => {
    expect(comp.utils.parsedAudience(mockAudiences).length).toBe(2);
    expect(comp.utils.parsedAudience(mockAudiences)[1]).toEqual({
      action: 1,
      label: 'hello',
      userCount: 1,
      isList: true,
      type: 2
    });

    expect(comp.utils.parsedAudience([]).length).toBe(0);
  });
});
