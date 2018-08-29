import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';

import { of as observableOf } from 'rxjs';

import { StoreSelectorComponent } from './store-selector.component';
import { DealsService } from '../../deals.service';
import { DealsModule } from '../../deals.module';

class MockDealsService {
  dummy;
  getDealStores(label: string) {
    this.dummy = { label };

    return observableOf({});
  }
}

describe('StoreSelectorComponent', () => {
  let spyStores;
  let component: StoreSelectorComponent;
  let fixture: ComponentFixture<StoreSelectorComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [DealsModule],
        providers: [{ provide: DealsService, useClass: MockDealsService }]
      })
        .compileComponents()
        .then(() => {
          fixture = TestBed.createComponent(StoreSelectorComponent);
          component = fixture.componentInstance;
          component.form = new FormBuilder().group({
            store_id: '47332'
          });

          spyStores = spyOn(component.service, 'getDealStores').and.returnValue(observableOf({}));
        });
    })
  );

  it('should call getDealStores once ngOnInit', () => {
    component.ngOnInit();
    expect(spyStores).toHaveBeenCalledTimes(1);
    expect(spyStores).toHaveBeenCalledWith('select');
  });
});
