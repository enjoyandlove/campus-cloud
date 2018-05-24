import { async, TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpModule, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { DebugElement } from '@angular/core';
import { StoreModule } from '@ngrx/store';

import { DealsModule } from '../deals.module';
import { DealsService } from '../deals.service';
import { CPSession } from '../../../../../session';
import { DealsInfoComponent } from './deals-info.component';
import { CPI18nService } from '../../../../../shared/services';
import { mockSchool } from '../../../../../session/mock/school';
import { headerReducer, snackBarReducer } from '../../../../../reducers';
import { CPMapsService } from '../../../../../shared/services/maps.service';
import { CPMapsComponent } from '../../../../../shared/components/cp-maps';

const mockDeals = require('../mockDeals.json');

class MockDealsService {
  dummy;

  getDealById(id: number, search: any) {
    this.dummy = [id, search];

    return Observable.of(mockDeals[0]);
  }
}

class MockMapService {
  init() {}

  setMarker() {}

}

describe('DealsInfoComponent', () => {
  let search;
  let mapComponent: CPMapsComponent;
  let component: DealsInfoComponent;
  let fixture: ComponentFixture<DealsInfoComponent>;
  let mapFixture: ComponentFixture<CPMapsComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [
          HttpModule,
          DealsModule,
          RouterTestingModule,
          StoreModule.forRoot({
            HEADER: headerReducer,
            SNACKBAR: snackBarReducer
          })
        ],
        providers: [
          CPSession,
          CPI18nService,
          { provide: CPMapsService, useClass: MockMapService },
          { provide: DealsService, useClass: MockDealsService },
        ]
      })
        .compileComponents()
        .then(() => {
          fixture = TestBed.createComponent(DealsInfoComponent);
          component = fixture.componentInstance;

          mapFixture = TestBed.createComponent(CPMapsComponent);
          mapComponent = mapFixture.componentInstance;

          component.dealId = 1;
          search = new URLSearchParams();
          component.session.g.set('school', mockSchool);
          component.isLoading().subscribe((_) => (component.loading = false));
          search.append('school_id', component.session.g.get('school').id);
        });
    })
  );

  it('should get deal info', fakeAsync(() => {
    spyOn(component, 'buildHeader');
    spyOn(mapComponent, 'drawMap');
    spyOn(component.service, 'getDealById').and.returnValue(Observable.of(mockDeals[0]));

    const deal = mockDeals[0];
    const bannerDe: DebugElement = fixture.debugElement;
    const bannerEl: HTMLElement = bannerDe.nativeElement;
    component.ngOnInit();
    tick();

    fixture.detectChanges();
    tick(10);

    const dealElement = bannerEl.querySelector('div.row div.deals');
    const dealTitle = dealElement.querySelector('div.row .resource-banner__title');
    const start = dealElement.querySelector('div.deals__details .start');
    const expiration = dealElement.querySelector('div.deals__details .expiration');
    const location = dealElement.querySelector('div.deals__details .location');
    const description = dealElement.querySelector('div.row .description');

    expect(dealTitle.textContent).toEqual(deal.title);
    expect(start.textContent).toEqual('May 15th 2019, 6:49 am');
    expect(expiration.textContent).toEqual('May 15th 2020, 6:49 am');
    expect(location.textContent).toEqual(deal.store_address);
    expect(description.textContent).toEqual(deal.description);
  }));

});
