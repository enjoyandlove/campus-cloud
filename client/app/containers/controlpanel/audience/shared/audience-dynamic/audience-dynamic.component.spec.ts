import { Observable } from 'rxjs/Observable';
import { AudienceSharedModule } from './../audience.shared.module';
import { AudienceSharedService } from './../audience.shared.service';
import { CPSession } from './../../../../../session/index';
import { TestBed, ComponentFixture, tick, fakeAsync } from '@angular/core/testing';
import { SharedModule } from '../../../../../shared/shared.module';
import { AudienceDynamicComponent } from './audience-dynamic.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CPI18nService } from '../../../../../shared/services';

class MockService {
  dummy;

  getFilters(search) {
    this.dummy = search;

    return Observable.of([
      {
        id: 1,
        label: 'hello',
        choices: []
      }
    ]);
  }
}

fdescribe('AudienceDynamicComponent', () => {
  let session: CPSession;
  let comp: AudienceDynamicComponent;
  let fixture: ComponentFixture<AudienceDynamicComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule, ReactiveFormsModule, AudienceSharedModule],
      providers: [
        CPSession,
        FormBuilder,
        CPI18nService,
        { provide: AudienceSharedService, useClass: MockService }
      ]
    });

    fixture = TestBed.createComponent(AudienceDynamicComponent);
    comp = fixture.componentInstance;
    session = TestBed.get(CPSession);
    session.g.set('school', { id: 1 });
  });

  it('should mount', () => {
    expect(comp).toBeTruthy();
  });

  it('should fetch on ngOnInit', () => {
    spyOn(comp, 'fetch');

    comp.ngOnInit();

    expect(comp.fetch).toHaveBeenCalledTimes(1);
  });

  it(
    'should call preloadFilter data if audience is provided',
    fakeAsync(() => {
      comp.audience = { name: 'some random object' };

      spyOn(comp, 'preloadFilters');
      spyOn(comp, 'addFilterGroup');

      comp.fetch();

      tick();

      expect(comp.preloadFilters).toHaveBeenCalledTimes(1);
      expect(comp.addFilterGroup).not.toHaveBeenCalled();
    })
  );

  it('preloadFilters', () => {
    comp.selectedItem = [];

    comp.filtersData = [
      {
        count: 0,
        type: 1,
        id: 351,
        filters: [{ attr_id: 40, choices_text: ['TRUE', 'FALSE'], choices: [49, 50] }],
        name: '## A new Dynamic List'
      }
    ];
    comp.audience = {
      count: 0,
      users: [],
      filters: [{ attr_id: 40, choices_text: ['TRUE', 'FALSE'], choices: [49, 50] }],
      type: 1,
      id: 351,
      name: '## A new Dynamic List'
    };

    fixture.detectChanges();

    // comp.preloadFilters();

    console.log(comp.state);
  });
});
