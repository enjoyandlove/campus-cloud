import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpModule } from '@angular/http';

import { JobsModule } from '../../../jobs.module';
import { CPSession } from '../../../../../../../session';
import { JobsUtilsService } from '../../../jobs.utils.service';
import { CPI18nService } from '../../../../../../../shared/services';
import { JobsListActionBoxComponent } from './jobs.list.action-box.component';

describe('JobsListActionBoxComponent', () => {
  let component: JobsListActionBoxComponent;
  let fixture: ComponentFixture<JobsListActionBoxComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [
          HttpModule,
          JobsModule,
          RouterTestingModule
        ],
        providers: [
          CPSession,
          CPI18nService,
          JobsUtilsService
        ]
      })
        .compileComponents()
        .then(() => {
          fixture = TestBed.createComponent(JobsListActionBoxComponent);
          component = fixture.componentInstance;
        });
    })
  );

  it('onSearch', () => {
    spyOn(component.search, 'emit');
    component.onSearch('hello world');

    expect(component.search.emit).toHaveBeenCalledTimes(1);
    expect(component.search.emit).toHaveBeenCalledWith('hello world');
  });

  it('onFilterByEmployer', () => {
    const employer_id = 452;
    spyOn(component.listAction, 'emit');

    component.state = Object.assign({}, component.state, {employer_id});
    component.onFilterByEmployer(employer_id);

    expect(component.listAction.emit).toHaveBeenCalledTimes(1);
    expect(component.listAction.emit).toHaveBeenCalledWith(component.state);
  });

});
