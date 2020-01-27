import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { FeedSearchComponent } from './feed-search.component';
import { CPTestModule } from '@campus-cloud/shared/tests/test.module';

describe('FeedSearchComponent', () => {
  let de: DebugElement;
  let formBuilder: FormBuilder;
  let component: FeedSearchComponent;
  let fixture: ComponentFixture<FeedSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CPTestModule, ReactiveFormsModule],
      declarations: [FeedSearchComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedSearchComponent);
    component = fixture.componentInstance;
    formBuilder = TestBed.get(FormBuilder);
    de = fixture.debugElement;

    component.form = formBuilder.group({
      query: ['']
    });

    fixture.detectChanges();
  });

  describe('emitValue', () => {
    it('should emit current query, regardless of its value', () => {
      const spy = spyOn(component.feedSearch, 'emit');

      component.query.next('');
      component.emitValue();
      expect(spy).toHaveBeenCalledWith('');

      component.query.next('12');
      component.emitValue();
      expect(spy).toHaveBeenCalledWith('12');

      component.query.next('123');
      component.emitValue();
      expect(spy).toHaveBeenCalledWith('123');
    });

    it('should be called when hitting enter on input field', () => {
      const spy = spyOn(component, 'emitValue');
      const input: HTMLInputElement = de.query(By.css('input[type="search"]')).nativeElement;

      input.focus();
      input.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter' }));
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('clear button', () => {
    it('should only be visble when input is not empty', () => {
      let button: HTMLButtonElement;

      component.query$.subscribe(() => {
        component.input.next('');
        button = de.query(By.css('button.unstyled-button')).nativeElement;
        expect(button.hidden).toBe(true);

        component.input.next('123');
        button = de.query(By.css('button.unstyled-button')).nativeElement;
        expect(button.hidden).toBe(false);
      });
    });
  });

  describe('query$', () => {
    it('should emit feedSearch when, querys length is zero or greater than 3', () => {
      const spy = spyOn(component.feedSearch, 'emit');

      component.query$.subscribe(() => {
        // skip first
        component.query.next('');
        expect(spy).not.toHaveBeenCalled();

        component.query.next('123');
        expect(spy).toHaveBeenCalledWith('123');

        component.query.next('');
        expect(spy).toHaveBeenCalledWith('');
      });
    });
  });
});
