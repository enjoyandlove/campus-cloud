import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { configureTestSuite } from '../../../../../shared/tests';
import { ServicesUtilsService } from '../services.utils.service';
import { ServicesMembersComponent } from './services-members.component';

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

@Component({ selector: 'cp-clubs-members', template: '' })
class ClubsMembersStubComponent {
  @Input() storeId;
}

describe('ServicesMembersComponent', () => {
  configureTestSuite();
  beforeAll((done) => {
    (async () => {
      TestBed.configureTestingModule({
        declarations: [ClubsMembersStubComponent, ServicesMembersComponent],
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

  let fixture: ComponentFixture<ServicesMembersComponent>;
  let component: ServicesMembersComponent;

  beforeEach(
    async(() => {
      fixture = TestBed.createComponent(ServicesMembersComponent);
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
