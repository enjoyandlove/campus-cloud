import { RouterTestingModule } from '@angular/router/testing';
import { async, TestBed, ComponentFixture } from '@angular/core/testing';

import { PersonasModule } from './../../../personas.module';
import { PersonasListActionBoxComponent } from './list-action-box.component';
import { CPI18nService } from '../../../../../../../shared/services';

describe('PersonasListActionBoxComponent', () => {
  let comp: PersonasListActionBoxComponent;
  let fixture: ComponentFixture<PersonasListActionBoxComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [PersonasModule, RouterTestingModule],
        providers: [CPI18nService]
      });

      fixture = TestBed.createComponent(PersonasListActionBoxComponent);
      comp = fixture.componentInstance;

      fixture.detectChanges();
    })
  );

  it('should Init', () => {
    expect(comp).toBeTruthy();
    expect(comp.dropdownItems.length).toBe(3);
  });

  it('onSearch', () => {
    spyOn(comp.search, 'emit');

    const expected = 'nothing';
    comp.onSearch(expected);

    expect(comp.search.emit).toHaveBeenCalledTimes(1);
    expect(comp.search.emit).toHaveBeenCalledWith(expected);
  });

  it('onSelectedFilter', () => {
    spyOn(comp.filterBy, 'emit');

    const expected = { id: 1 };
    comp.onSelectedFilter(expected);

    expect(comp.filterBy.emit).toHaveBeenCalledTimes(1);
    expect(comp.filterBy.emit).toHaveBeenCalledWith(expected.id);
  });
});
