import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormDuplicateComponent } from './form-duplicate.component';
import { CPI18nPipe } from '@campus-cloud/shared/pipes';
import { NO_ERRORS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { FormsService } from '@controlpanel/contact-trace/forms';
import { CPSession } from '@campus-cloud/session';

@Pipe({ name: 'cpI18n' })
export class CPI18nPipeMock implements PipeTransform {
  transform(key: string, context?: any): any {
    return key;
  }
}

describe('FormDuplicateComponent', () => {
  let component: FormDuplicateComponent;
  let fixture: ComponentFixture<FormDuplicateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        FormDuplicateComponent,
        CPI18nPipeMock
      ],
      providers: [
        {
          provide: CPI18nPipe,
          useClass: CPI18nPipeMock
        },
        {
          provide: FormsService,
          useValue: jasmine.createSpyObj('FormsService', ['getForm'])
        }, {
          provide: CPSession,
          useValue: jasmine.createSpyObj('CPSession', ['g'])
        }],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormDuplicateComponent);
    component = fixture.componentInstance;
    component._form = {
      name: 'test name',
      id: 12
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
