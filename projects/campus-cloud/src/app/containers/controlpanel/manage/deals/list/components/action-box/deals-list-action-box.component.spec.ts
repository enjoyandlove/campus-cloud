import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';

import { DealsModule } from '../../../deals.module';
import { CPSession } from '../../../../../../../session';
import { RootStoreModule } from '../../../../../../../store';
import { CPI18nService } from '../../../../../../../shared/services';
import { DealsListActionBoxComponent } from './deals-list-action-box.component';

describe('DealsListActionBoxComponent', () => {
  let component: DealsListActionBoxComponent;
  let fixture: ComponentFixture<DealsListActionBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [DealsModule, HttpClientModule, RouterTestingModule, RootStoreModule],
      providers: [CPSession, CPI18nService]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(DealsListActionBoxComponent);
        component = fixture.componentInstance;
      });
  }));

  it('onSearch', () => {
    spyOn(component.search, 'emit');
    component.onSearch('hello world');

    expect(component.search.emit).toHaveBeenCalledTimes(1);
    expect(component.search.emit).toHaveBeenCalledWith('hello world');
  });

  it('onFilterByStore', () => {
    const store_id = 452;
    spyOn(component.listAction, 'emit');

    component.state = Object.assign({}, component.state, { store_id });
    component.onFilterByStore(store_id);

    expect(component.listAction.emit).toHaveBeenCalledTimes(1);
    expect(component.listAction.emit).toHaveBeenCalledWith(component.state);
  });
});
