import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DataExportTopBarComponent } from './top-bar.component';
import { CPTestModule } from '@campus-cloud/shared/tests/test.module';
import { CPSearchBoxComponent } from '@campus-cloud/shared/components';

describe('DataExportTopBarComponent', () => {
  let de: DebugElement;
  let component: DataExportTopBarComponent;
  let fixture: ComponentFixture<DataExportTopBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CPTestModule],
      declarations: [DataExportTopBarComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataExportTopBarComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should emit query event', () => {
    const query = 'query';
    spyOn(component.search, 'emit');
    const searchEl: CPSearchBoxComponent = de.query(By.directive(CPSearchBoxComponent))
      .componentInstance;

    searchEl.query.emit(query);
    expect(component.search.emit).toHaveBeenCalledWith(query);
  });
});
