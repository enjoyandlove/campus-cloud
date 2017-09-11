import 'rxjs';
import { Http, Response, ResponseOptions, URLSearchParams } from '@angular/http';
import { TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

import { StoreService } from './store.service';

const CLUBS_CATEGORY = 0;
const SERVICES_CATEGORY = 19;
const clubs = [{ name: 'club', id: 1, category_id: CLUBS_CATEGORY }];
const services = [{ name: 'service', id: 1, category_id: SERVICES_CATEGORY }];

function createResponse(body) {
  return Observable.of(
    new Response(new ResponseOptions({ body: JSON.stringify(body) }))
  )
}

class MockRouter { }

class MockHttp {
  get() {
    return createResponse([])
  }

  getStores() {
    return createResponse([])
  }
}

describe('StoreService', () => {
  let storeService: StoreService;

  let http;

  beforeEach(() => {
    const bed = TestBed.configureTestingModule({
      providers: [
        StoreService,
        { provide: Http, useClass: MockHttp },
        { provide: Router, useClass: MockRouter }
      ]
    })

    http = bed.get(Http);
    storeService = bed.get(StoreService);
  });

  it('GET', () => {
    const search = new URLSearchParams();
    search.append('test', 'nothing');

    spyOn(StoreService.prototype, 'get').and.returnValue(createResponse([clubs, services]));

    storeService.getStores(search).subscribe(res => console.log(res));
  })
});
