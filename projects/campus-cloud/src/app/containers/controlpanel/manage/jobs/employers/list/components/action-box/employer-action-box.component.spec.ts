import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';

import { CPTestModule } from '@campus-cloud/shared/tests';
import { EmployerModule } from '../../../employer.module';
import { EmployerActionBoxComponent } from './employer-action-box.component';

describe('EmployerActionBoxComponent', () => {
  let spy;
  let component: EmployerActionBoxComponent;
  let fixture: ComponentFixture<EmployerActionBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CPTestModule, EmployerModule, RouterTestingModule]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(EmployerActionBoxComponent);
        component = fixture.componentInstance;
        spyOn(component.cpTracking, 'getEventProperties');
        fixture.detectChanges();
      });
  }));

  it('onSearch', () => {
    spyOn(component.search, 'emit');

    component.onSearch('nothing');

    expect(component.search.emit).toHaveBeenCalledTimes(1);
    expect(component.search.emit).toHaveBeenCalledWith('nothing');
  });

  it('onLaunchCreateModal', () => {
    spy = spyOn(component.launchCreateModal, 'emit');

    const createButton = fixture.debugElement.query(By.css('.cp-card .cpbtn')).nativeElement;

    createButton.click();
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
