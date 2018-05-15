import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpModule } from '@angular/http';

import { JobsModule } from '../../jobs.module';
import { CPSession } from '../../../../../../session';
import { EmployerCardComponent } from './employer-card.component';
import { JobsUtilsService } from '../../jobs.utils.service';
import { CPI18nService } from '../../../../../../shared/services';
import { FormBuilder } from '@angular/forms';

describe('EmployerCardComponent', () => {
  let component: EmployerCardComponent;
  let fixture: ComponentFixture<EmployerCardComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [
          HttpModule,
          JobsModule,
          RouterTestingModule
        ],
        providers: [
          CPSession,
          CPI18nService,
          JobsUtilsService
        ]
      })
        .compileComponents()
        .then(() => {
          fixture = TestBed.createComponent(EmployerCardComponent);
          component = fixture.componentInstance;

          const fb = new FormBuilder();

          component.form = fb.group({
            store_id: [null]
          });

          component.employerForm = fb.group({
            name: [null],
            logo_url: [null]
          });
        });
    }));

  it('onTabClick - existing employer', () => {
    const id = 'existing';
    spyOn(component.isNewEmployer, 'emit');
    component.onTabClick({id});

    const store_id = component.form.controls['store_id'];
    const name = component.employerForm.controls['name'];
    const logo = component.employerForm.controls['logo_url'];

    expect(name.valid).toBeTruthy();
    expect(logo.valid).toBeTruthy();
    expect(store_id.valid).toBeFalsy();
    expect(component.isNewEmployer.emit).toHaveBeenCalledTimes(1);
    expect(component.isNewEmployer.emit).toHaveBeenCalledWith(false);
  });

  it('onTabClick - new employer', () => {
    const id = 'new';
    spyOn(component.isNewEmployer, 'emit');
    component.onTabClick({id});

    const store_id = component.form.controls['store_id'];
    const name = component.employerForm.controls['name'];
    const logo = component.employerForm.controls['logo_url'];

    expect(name.valid).toBeFalsy();
    expect(logo.valid).toBeFalsy();
    expect(store_id.valid).toBeTruthy();
    expect(component.isNewEmployer.emit).toHaveBeenCalledTimes(1);
    expect(component.isNewEmployer.emit).toHaveBeenCalledWith(true);
  });

  it('toggle isStoreRequired', () => {
    let store;

    component.isStoreRequired(false);
    store = component.form.controls['store_id'];

    expect(store.valid).toBeTruthy();

    component.isStoreRequired(true);
    component.form.controls['store_id'].setValue(null);
    store = component.form.controls['store_id'];

    expect(store.valid).toBeFalsy();
  });

  it('toggle setRequiredField', () => {
    let name;
    let logo;

    component.setRequiredField(false);
    name = component.employerForm.controls['name'];
    logo = component.employerForm.controls['logo_url'];

    expect(name.valid).toBeTruthy();
    expect(logo.valid).toBeTruthy();

    component.setRequiredField(true);
    component.form.controls['store_id'].setValue(null);
    name = component.employerForm.controls['name'];
    logo = component.employerForm.controls['logo_url'];

    expect(name.valid).toBeFalsy();
    expect(logo.valid).toBeFalsy();
  });
});
