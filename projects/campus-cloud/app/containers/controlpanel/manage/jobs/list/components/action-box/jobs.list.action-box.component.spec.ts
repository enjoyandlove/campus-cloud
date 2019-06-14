import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';

import { JobsModule } from '../../../jobs.module';
import { CPSession } from '../../../../../../../session';
import { RootStoreModule } from '../../../../../../../store';
import { JobsUtilsService } from '../../../jobs.utils.service';
import { CPI18nService } from '../../../../../../../shared/services';
import { configureTestSuite } from '../../../../../../../shared/tests';
import { JobsListActionBoxComponent } from './jobs.list.action-box.component';

describe('JobsListActionBoxComponent', () => {
  configureTestSuite();
  beforeAll((done) => {
    (async () => {
      TestBed.configureTestingModule({
        imports: [JobsModule, HttpClientModule, RouterTestingModule, RootStoreModule],
        providers: [CPSession, CPI18nService, JobsUtilsService]
      });
    })()
      .then(done)
      .catch(done.fail);
  });

  let component: JobsListActionBoxComponent;
  let fixture: ComponentFixture<JobsListActionBoxComponent>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(JobsListActionBoxComponent);
    component = fixture.componentInstance;
  }));

  it('onSearch', () => {
    spyOn(component.search, 'emit');
    component.onSearch('hello world');

    expect(component.search.emit).toHaveBeenCalledTimes(1);
    expect(component.search.emit).toHaveBeenCalledWith('hello world');
  });

  it('onFilterByEmployer', () => {
    const employer_id = 452;
    spyOn(component.listAction, 'emit');

    component.state = Object.assign({}, component.state, { employer_id });
    component.onFilterByEmployer(employer_id);

    expect(component.listAction.emit).toHaveBeenCalledTimes(1);
    expect(component.listAction.emit).toHaveBeenCalledWith(component.state);
  });
});
