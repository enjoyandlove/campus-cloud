import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { configureTestSuite } from '../../../../../shared/tests';
import { ServicesUtilsService } from '../services.utils.service';
import { ServicesFeedsComponent } from './services-feeds.component';

const mockServices = require('../mock.json');

const mockRoute = {
  snapshot: {
    data: {
      service: mockServices[0]
    }
  }
};

class MockUtils {
  buildServiceHeader(service) {
    return service;
  }
}

@Component({ selector: 'cp-feeds', template: '' })
class FeedsStubComponent {
  @Input() groupId;
  @Input() groupType;
}

describe('ServicesFeedsComponent', () => {
  configureTestSuite();
  beforeAll((done) => {
    (async () => {
      TestBed.configureTestingModule({
        declarations: [FeedsStubComponent, ServicesFeedsComponent],
        imports: [RouterTestingModule],
        providers: [
          {
            provide: ServicesUtilsService,
            useClass: MockUtils
          },
          {
            provide: ActivatedRoute,
            useValue: mockRoute
          }
        ]
      });
      await TestBed.compileComponents();
    })()
      .then(done)
      .catch(done.fail);
  });

  let fixture: ComponentFixture<ServicesFeedsComponent>;
  let component: ServicesFeedsComponent;

  beforeEach(
    async(() => {
      fixture = TestBed.createComponent(ServicesFeedsComponent);
      component = fixture.componentInstance;
    })
  );

  it('should init with service', () => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.service).toBeDefined();
      expect(component.storeId).toEqual(mockServices[0].store_id);
    });
  });
});
