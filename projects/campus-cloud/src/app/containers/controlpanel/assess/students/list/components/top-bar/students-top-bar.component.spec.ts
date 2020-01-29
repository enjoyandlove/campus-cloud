import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CheckboxComponent } from '@ready-education/ready-ui/forms';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { skip } from 'rxjs/operators';
import { of } from 'rxjs';

import { CPSession } from '@campus-cloud/session';
import { mockSchool } from '@campus-cloud/session/mock';
import { configureTestSuite, CPTestModule } from '@campus-cloud/shared/tests';
import { StudentsService } from '@controlpanel/assess/students/students.service';
import { StudentsTopBarComponent } from '@controlpanel/assess/students/list/components';
import { CPDropdownComponent, CPSearchBoxComponent } from '@campus-cloud/shared/components';

describe('StudentsTopBarComponent', () => {
  configureTestSuite();
  beforeAll((done) => {
    (async () => {
      TestBed.configureTestingModule({
        declarations: [StudentsTopBarComponent],
        providers: [StudentsService],
        imports: [CPTestModule]
      });
      await TestBed.compileComponents();
    })()
      .then(done)
      .catch(done.fail);
  });

  let de: DebugElement;
  let session: CPSession;
  let getListSpy: jasmine.Spy;
  let getExperiencesSpy: jasmine.Spy;
  let component: StudentsTopBarComponent;
  let fixture: ComponentFixture<StudentsTopBarComponent>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(StudentsTopBarComponent);
    component = fixture.componentInstance;

    de = fixture.debugElement;
    session = TestBed.get(CPSession);
    session.g.set('school', mockSchool);

    getListSpy = spyOn(component.service, 'getLists');
    getExperiencesSpy = spyOn(component.service, 'getExperiences');

    getListSpy.and.returnValue(of([]));
    getExperiencesSpy.and.returnValue(of([]));

    fixture.detectChanges();
  }));

  it('should populate dropdown with audiences and experiences', () => {
    const mockList = { id: 1, name: 'List Name' };
    const mockAudience = { id: 1, name: 'Audience Name' };

    getListSpy.and.returnValue(of([mockList]));
    getExperiencesSpy.and.returnValue(of([mockAudience]));

    component.ngOnInit();

    component.dropdownItems$.pipe(skip(1)).subscribe((response) => expect(response.length).toBe(5));
  });

  describe('filter output', () => {
    let checkbox: CheckboxComponent;
    let search: CPSearchBoxComponent;
    let dropdown: CPDropdownComponent;

    beforeEach(() => {
      search = de.query(By.directive(CPSearchBoxComponent)).componentInstance;
      dropdown = de.query(By.directive(CPDropdownComponent)).componentInstance;
      checkbox = de.query(By.directive(CheckboxComponent)).componentInstance;
    });

    it('should emit component state on CPSearchBoxComponent query', () => {
      spyOn(component.filter, 'emit');
      search.query.emit('query');

      const { search_str } = component.state;

      expect(search_str).toBe('query');

      expect(component.filter.emit).toHaveBeenCalled();
    });

    it('should emit component state on CPDropdownComponent selected', () => {
      const expected = { id: 1, label: 'One', queryParam: 'Some' };
      spyOn(component.filter, 'emit');
      dropdown.selected.emit(expected as any);

      const { filterBy } = component.state;

      expect(filterBy).toBe(expected);

      expect(component.filter.emit).toHaveBeenCalled();
    });

    it('should emit component state on CheckboxComponent changed', () => {
      spyOn(component.filter, 'emit');
      checkbox.changed.emit(true);

      const { muted } = component.state;

      expect(muted).toBe(true);

      expect(component.filter.emit).toHaveBeenCalled();
    });
  });
});
