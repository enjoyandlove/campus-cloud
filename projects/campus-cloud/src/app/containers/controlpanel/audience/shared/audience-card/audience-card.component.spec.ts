import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

import { getAudienceState } from '@campus-cloud/store/base';
import { CPI18nService } from '@campus-cloud/shared/services';
import { AudienceCardComponent } from './audience-card.component';
import { SharedModule } from '@campus-cloud/shared/shared.module';

describe('AudienceCardComponent', () => {
  let storeSpy: jasmine.Spy;
  let comp: AudienceCardComponent;
  let fixture: ComponentFixture<AudienceCardComponent>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [AudienceCardComponent],
      providers: [CPI18nService, provideMockStore()],
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(AudienceCardComponent);
    comp = fixture.componentInstance;
    storeSpy = spyOn(comp.store, 'select');
  });

  it('should listen for audience changes', () => {
    storeSpy.and.returnValue(
      of({ audience_id: 1, new_audience_active: false, saved_audience_active: true })
    );

    fixture.detectChanges();

    expect(storeSpy).toHaveBeenCalled();
    expect(storeSpy).toHaveBeenCalledWith(getAudienceState);
  });

  it('onFilters should emit selectedFilters', () => {
    spyOn(comp.selectedFilters, 'emit');
    const expected = 'nothing';

    comp.onFilters(expected);
    expect(comp.selectedFilters.emit).toHaveBeenCalledTimes(1);
    expect(comp.selectedFilters.emit).toHaveBeenCalledWith(expected);
  });

  it('onUsers should emit selectedUsers', () => {
    spyOn(comp.selectedUsers, 'emit');
    const expected = 'nothing';

    comp.onUsers(expected);
    expect(comp.selectedUsers.emit).toHaveBeenCalledTimes(1);
    expect(comp.selectedUsers.emit).toHaveBeenCalledWith(expected);
  });

  it('should onSelectedAudience', () => {
    spyOn(comp.selectedAudience, 'emit');

    let mockAudience = {
      action: null,
      label: 'Hello World',
      userCount: 3
    };

    comp.onSelectedAudience(mockAudience);

    expect(comp.selectedAudience.emit).toHaveBeenCalledTimes(1);
    expect(comp.selectedAudience.emit).toHaveBeenCalledWith(mockAudience);

    expect(comp.message).toBe(comp.cpI18n.translate('campus_wide'));

    mockAudience = { ...mockAudience, action: 1 };

    comp.onSelectedAudience(mockAudience);

    const expected = `${mockAudience.userCount} ${comp.cpI18n.translate('users_found')}`;

    expect(comp.message).toBe(expected);
  });
});
