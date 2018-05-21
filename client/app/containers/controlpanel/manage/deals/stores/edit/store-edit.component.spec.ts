import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { URLSearchParams, HttpModule } from '@angular/http';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs/Observable';
import { FormBuilder } from '@angular/forms';

import { StoreModule } from '../store.module';
import { StoreService } from '../store.service';
import { CPSession } from './../../../../../../session';
import { mockSchool } from '../../../../../../session/mock/school';
import { StoreEditComponent } from './store-edit.component';
import { CPI18nService } from '../../../../../../shared/services/i18n.service';

class MockStoreService {
  dummy;

  editStore(body: any, search: any) {
    this.dummy = [search];

    return Observable.of(body);
  }
}

describe('DealsStoreEditComponent', () => {
  let spy;
  let search;
  let component: StoreEditComponent;
  let fixture: ComponentFixture<StoreEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpModule,
        StoreModule,
        RouterTestingModule
      ],
      providers: [
        CPSession,
        FormBuilder,
        CPI18nService,
        { provide: StoreService, useClass: MockStoreService },
      ]
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(StoreEditComponent);
      component = fixture.componentInstance;

      search = new URLSearchParams();
      component.session.g.set('school', mockSchool);
      search.append('school_id', component.session.g.get('school').id.toString());

      component.store = {
        'id': 1,
        'city': 'Karachi',
        'province': 'Sindh',
        'country': 'Pakistan',
        'postal_code': '',
        'address': 'Clifton',
        'latitude': '',
        'longitude': '',
        'website': 'www.oohlalamobile.com',
        'name': 'Hello World!',
        'description': 'This is description',
        'logo_url': 'dummy.jpeg'
      };

      component.ngOnInit();
    });
  }));

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
    spy = spyOn(component.service, 'editStore')
      .and.returnValue(Observable.of(component.store));

    component.onSubmit();

    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledTimes(1);

    expect(component.edited.emit).toHaveBeenCalledTimes(1);
    expect(component.edited.emit).toHaveBeenCalledWith(component.store);

    expect(component.resetModal).toHaveBeenCalled();
    expect(component.resetModal).toHaveBeenCalledTimes(1);
  });

});
