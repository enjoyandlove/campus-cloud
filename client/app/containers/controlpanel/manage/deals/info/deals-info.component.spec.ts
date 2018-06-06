import { HttpClientModule } from '@angular/common/http';
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule } from '@ngrx/store';
import { of as observableOf } from 'rxjs';
import { DealsInfoComponent } from './deals-info.component';
import { reducers } from '../../../../../reducers';
import { CPSession } from '../../../../../session';
import { mockSchool } from '../../../../../session/mock/school';
import { CPMapsComponent } from '../../../../../shared/components/cp-maps';
import { CPI18nService } from '../../../../../shared/services';
import { CPMapsService } from '../../../../../shared/services/maps.service';
import { DealsModule } from '../deals.module';
import { DealsService } from '../deals.service';

const mockDeals = require('../mockDeals.json');

class MockDealsService {
  dummy;

  getDealById(id: number, search: any) {
    this.dummy = [id, search];

    return observableOf(mockDeals[0]);
  }
}

class MockMapService {
  init() {}

  setMarker() {}
}

describe('DealsInfoComponent', () => {
  let mapComponent: CPMapsComponent;
  let component: DealsInfoComponent;
  let fixture: ComponentFixture<DealsInfoComponent>;
  let mapFixture: ComponentFixture<CPMapsComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [
          DealsModule,
          HttpClientModule,
          RouterTestingModule,
          StoreModule.forRoot({
            HEADER: reducers.HEADER,
            SNACKBAR: reducers.SNACKBAR
          })
        ],
        providers: [
          CPSession,
          CPI18nService,
          { provide: CPMapsService, useClass: MockMapService },
          { provide: DealsService, useClass: MockDealsService }
        ]
      })
        .compileComponents()
        .then(() => {
          fixture = TestBed.createComponent(DealsInfoComponent);
          component = fixture.componentInstance;

          mapFixture = TestBed.createComponent(CPMapsComponent);
          mapComponent = mapFixture.componentInstance;

          component.dealId = 1;

          component.session.g.set('school', mockSchool);
          component.isLoading().subscribe((_) => (component.loading = false));
        });
    })
  );

  it(
    'should get deal info',
    fakeAsync(() => {
      spyOn(component, 'buildHeader');
      spyOn(mapComponent, 'drawMap');
      spyOn(component.service, 'getDealById').and.returnValue(observableOf(mockDeals[0]));

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
    })
  );
});
