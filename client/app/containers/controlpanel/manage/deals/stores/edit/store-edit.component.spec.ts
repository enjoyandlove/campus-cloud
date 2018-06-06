import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of as observableOf } from 'rxjs';
import { CPSession } from './../../../../../../session';
import { StoreEditComponent } from './store-edit.component';
import { mockSchool } from '../../../../../../session/mock/school';
import { CPI18nService } from '../../../../../../shared/services/i18n.service';
import { StoreModule } from '../store.module';
import { StoreService } from '../store.service';

class MockStoreService {
  dummy;

  editStore(body: any, search: any) {
    this.dummy = [search];

    return observableOf(body);
  }
}

describe('DealsStoreEditComponent', () => {
  let spy;
  let component: StoreEditComponent;
  let fixture: ComponentFixture<StoreEditComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientModule, StoreModule, RouterTestingModule],
        providers: [
          CPSession,
          FormBuilder,
          CPI18nService,
          { provide: StoreService, useClass: MockStoreService }
        ]
      })
        .compileComponents()
        .then(() => {
          fixture = TestBed.createComponent(StoreEditComponent);
          component = fixture.componentInstance;

          component.session.g.set('school', mockSchool);

          component.store = {
            id: 1,
            city: 'Karachi',
            province: 'Sindh',
            country: 'Pakistan',
            postal_code: '',
            address: 'Clifton',
            latitude: '',
            longitude: '',
            website: 'www.oohlalamobile.com',
            name: 'Hello World!',
            description: 'This is description',
            logo_url: 'dummy.jpeg'
          };

          component.ngOnInit();
        });
    })
  );

  it('form validation - should fail', () => {
    component.storeForm.controls['name'].setValue(null);
    expect(component.storeForm.valid).toBeFalsy();
  });

  it('form validation - should pass', () => {
    expect(component.storeForm.valid).toBeTruthy();
  });

  it('form validation - max length 120 - should fail', () => {
    const charCount121 = 'a'.repeat(121);

    component.storeForm.controls['name'].setValue(charCount121);
    expect(component.storeForm.valid).toBeFalsy();
  });

  it('save button should be disabled', () => {
    component.storeForm.controls['name'].setValue(null);
    expect(component.buttonData.disabled).toBeTruthy();
  });

  it('save button should be enabled', () => {
    expect(component.buttonData.disabled).toBeFalsy();
  });

  it('should edit store', () => {
    spyOn(component.edited, 'emit');
    spyOn(component, 'resetModal');
    spy = spyOn(component.service, 'editStore').and.returnValue(observableOf(component.store));

    component.onSubmit();

    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledTimes(1);

    expect(component.edited.emit).toHaveBeenCalledTimes(1);
    expect(component.edited.emit).toHaveBeenCalledWith(component.store);

    expect(component.resetModal).toHaveBeenCalled();
    expect(component.resetModal).toHaveBeenCalledTimes(1);
  });
});
