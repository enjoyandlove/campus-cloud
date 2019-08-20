import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';

import { CPSession } from '@campus-cloud/session';
import { SharedModule } from '@campus-cloud/shared/shared.module';
import { CPPageHeaderComponent } from './cp-page-header.component';

describe('CPPageHeaderComponent', () => {
  let _data;
  let comp: CPPageHeaderComponent;
  let fixture: ComponentFixture<CPPageHeaderComponent>;

  // async beforeEach
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientModule, SharedModule],
      providers: [CPSession]
    });

    fixture = TestBed.createComponent(CPPageHeaderComponent);
    comp = fixture.componentInstance;
    comp.session.g.set('user', { email: 'hello@oohlalamobile.com' });

    comp.data = {
      heading: 'Hello',
      children: null,
      crumbs: {
        url: null,
        label: null
      }
    };

    _data = {
      ...comp.data,
      children: [
        {
          amplitude: 'Banner',
          label: 'customise_banner',
          url: '/customize/banner'
        },
        {
          amplitude: 'Studio',
          label: 't_customise_personas',
          url: '/customize/personas'
        },
        {
          amplitude: 'Studio',
          label: 't_customise_personas',
          url: '/customize/personas'
        }
      ]
    };

    fixture.detectChanges(); // trigger initial data binding
  });

  it('should have extra children', () => {
    comp.data = _data;
    comp.maxChildren = 1;

    comp.ngOnChanges();

    expect(comp.extraChildren.length).toEqual(2);
  });

  it('should not have extra children', () => {
    comp.data = _data;

    comp.ngOnChanges();

    expect(comp.extraMenu).toBeNull();
    expect(comp.extraChildren).toEqual([]);
  });
});
