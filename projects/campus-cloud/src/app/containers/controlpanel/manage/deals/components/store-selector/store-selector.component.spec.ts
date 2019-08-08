import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { DealsModule } from '../../deals.module';
import { DealsService } from '../../deals.service';
import { RootStoreModule } from '@campus-cloud/store';
import { StoreSelectorComponent } from './store-selector.component';
import { configureTestSuite, CPTestModule } from '@campus-cloud/shared/tests';

class MockDealsService {
  dummy;
  getDealStores(label: string) {
    this.dummy = { label };

    return of({});
  }
}

describe('StoreSelectorComponent', () => {
  configureTestSuite();
  beforeAll((done) => {
    (async () => {
      TestBed.configureTestingModule({
        imports: [
          HttpClientModule,
          RouterTestingModule,
          DealsModule,
          RootStoreModule,
          CPTestModule
        ],
        providers: [{ provide: DealsService, useClass: MockDealsService }]
      });
      await TestBed.compileComponents();
    })()
      .then(done)
      .catch(done.fail);
  });

  let spyStores;
  let component: StoreSelectorComponent;
  let fixture: ComponentFixture<StoreSelectorComponent>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(StoreSelectorComponent);
    component = fixture.componentInstance;
    component.form = new FormBuilder().group({
      store_id: '47332'
    });

    spyStores = spyOn(component.service, 'getDealStores').and.returnValue(of([]));
  }));

  it('should call getDealStores once ngOnInit', () => {
    component.ngOnInit();
    expect(spyStores).toHaveBeenCalledTimes(1);
  });
});
