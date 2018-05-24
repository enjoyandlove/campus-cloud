import { SharedModule } from './../../../../../shared/shared.module';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { AudienceCardComponent } from './audience-card.component';
import { CPI18nService } from './../../../../../shared/services/i18n.service';

import { reducer } from '../../../../../reducers/audience.reducer';

describe('AudienceCardComponent', () => {
  let comp: AudienceCardComponent;
  let fixture: ComponentFixture<AudienceCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule, StoreModule.forRoot({}), StoreModule.forFeature('AUDIENCE', reducer)],
      declarations: [AudienceCardComponent],
      providers: [CPI18nService],
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(AudienceCardComponent);
    comp = fixture.componentInstance;
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
    expect(comp.selectedAudience.emit).toHaveBeenCalledWith(mockAudience.action);

    expect(comp.message).toBe(comp.cpI18n.translate('campus_wide'));

    mockAudience = { ...mockAudience, action: 1 };

    comp.onSelectedAudience(mockAudience);

    const expected = `${mockAudience.userCount} ${comp.cpI18n.translate('users_found')}`;

    expect(comp.message).toBe(expected);
  });
});
