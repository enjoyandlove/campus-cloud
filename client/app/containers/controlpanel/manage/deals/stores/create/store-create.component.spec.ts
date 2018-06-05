import { HttpClientModule, HttpParams } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of as observableOf } from 'rxjs';
import { CPSession } from './../../../../../../session';
import { StoreCreateComponent } from './store-create.component';
import { mockSchool } from '../../../../../../session/mock/school';
import { CPI18nService } from '../../../../../../shared/services/i18n.service';
import { StoreModule } from '../store.module';
import { StoreService } from '../store.service';

class MockStoreService {
  dummy;

  createStore(body: any, search: any) {
    this.dummy = [search];

    return observableOf(body);
  }
}

describe('DealsStoreCreateComponent', () => {
  let spy;
  let component: StoreCreateComponent;
  let fixture: ComponentFixture<StoreCreateComponent>;

  const newStore = {
    id: 1,
    name: 'Hello World!',
    description: 'This is description',
    logo_url: 'image.jpeg'
  };

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
          fixture = TestBed.createComponent(StoreCreateComponent);
          component = fixture.componentInstance;

          component.session.g.set('school', mockSchool);

          component.ngOnInit();
        });
    })
  );

  it('form validation - missing required fields - should fail', () => {
    expect(component.storeForm.valid).toBeFalsy();
  });

  it('form validation - should pass', () => {
    component.storeForm.controls['name'].setValue('hello world');
    component.storeForm.controls['logo_url'].setValue('dummy.png');

    expect(component.storeForm.valid).toBeTruthy();
  });

  it('form validation - max length 120 - should pass', () => {
    const charCount120 = 'a'.repeat(120);

    component.storeForm.controls['name'].setValue(charCount120);
    component.storeForm.controls['logo_url'].setValue('dummy.png');

    expect(component.storeForm.valid).toBeTruthy();
  });

  it('form validation - max length 120 - should fail', () => {
    const charCount121 = 'a'.repeat(121);

    component.storeForm.controls['name'].setValue(charCount121);
    component.storeForm.controls['logo_url'].setValue('dummy.png');

    expect(component.storeForm.valid).toBeFalsy();
  });

  it('save button should be disabled', () => {
    expect(component.buttonData.disabled).toBeTruthy();
  });

  it('save button should be enabled', () => {
    component.storeForm.controls['name'].setValue('hello world');
    component.storeForm.controls['logo_url'].setValue('dummy.png');

    expect(component.buttonData.disabled).toBeFalsy();
  });

  it('should create store', () => {
    spyOn(component.created, 'emit');
    spyOn(component, 'resetModal');
    spy = spyOn(component.service, 'createStore').and.returnValue(observableOf(newStore));

    component.storeForm = component.fb.group({
      name: ['Hello World!'],
      logo_url: ['dummy.jpeg'],
      description: ['This is description']
    });

    component.onSubmit();

    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledTimes(1);

    expect(component.created.emit).toHaveBeenCalledTimes(1);
    expect(component.created.emit).toHaveBeenCalledWith(newStore);

    expect(component.resetModal).toHaveBeenCalled();
    expect(component.resetModal).toHaveBeenCalledTimes(1);
  });
});
