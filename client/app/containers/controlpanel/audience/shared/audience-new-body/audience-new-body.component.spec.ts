import { Observable } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AudienceType } from './../../audience.status';
import { CPSession } from './../../../../../session/index';
import { CPI18nService } from '../../../../../shared/services';
import { AudienceSharedModule } from './../audience.shared.module';
import { SharedModule } from '../../../../../shared/shared.module';
import { AudienceSharedService } from '../audience.shared.service';
import { AudienceNewBodyComponent } from './audience-new-body.component';

class MockAudienceSharedService {
  dummy;

  getUserCount(data, search) {
    this.dummy = { data, search };

    return Observable.of({ count: 130 });
  }
}

describe('AudienceNewBodyComponent', () => {
  let comp: AudienceNewBodyComponent;
  let fixture: ComponentFixture<AudienceNewBodyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule, AudienceSharedModule],
      providers: [
        CPI18nService,
        CPSession,
        { provide: AudienceSharedService, useClass: MockAudienceSharedService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(AudienceNewBodyComponent, {
      set: {
        template: '<div>No Template</div>'
      }
    });

    fixture = TestBed.createComponent(AudienceNewBodyComponent);
    comp = fixture.componentInstance;
  });

  it('should create', () => {
    expect(AudienceNewBodyComponent).toBeTruthy();
  });

  it('ngOnInit', () => {
    spyOn(comp.audienceType, 'emit');
    expect(comp.state.custom).toBeTruthy();
    expect(comp.state.dynamic).toBeFalsy();

    fixture.detectChanges();

    expect(comp.state.custom).toBeFalsy();
    expect(comp.state.dynamic).toBeTruthy();
    expect(comp.audienceTypes.length).toBe(2);
    expect(comp.selectedType).toBe(comp.audienceTypes[1]);

    expect(comp.audienceType.emit).toHaveBeenCalledTimes(1);

    expect(comp.message).not.toBeDefined();

    comp.audience = { count: 3 };

    comp.ngOnInit();

    expect(comp.message).toBeDefined();
  });

  it('onFilters', () => {
    const expected = 'hello';

    spyOn(comp, 'getUserCount');
    spyOn(comp.filters, 'emit');

    comp.onFilters(expected);

    expect(comp.getUserCount).toHaveBeenCalledTimes(1);

    expect(comp.filters.emit).toHaveBeenCalledTimes(1);
    expect(comp.filters.emit).toHaveBeenCalledWith(expected);
  });

  it('onUsers', () => {
    const expected = 'hello';

    spyOn(comp.users, 'emit');

    comp.onUsers(expected);

    expect(comp.message).toBeDefined();

    expect(comp.users.emit).toHaveBeenCalledTimes(1);
    expect(comp.users.emit).toHaveBeenCalledWith(expected);
  });

  it('onTypeSelected', () => {
    spyOn(comp.audienceType, 'emit');

    comp.onTypeSelected({ action: AudienceType.custom });

    expect(comp.message).toBeNull();
    expect(comp.state.custom).toBeTruthy();
    expect(comp.state.dynamic).toBeFalsy();
    expect(comp.audienceType.emit).toHaveBeenCalledTimes(1);
  });
});
