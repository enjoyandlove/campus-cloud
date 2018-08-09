import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { CPSession } from './../../../session';
import { SharedModule } from './../../shared.module';
import { CPPageHeaderComponent } from './cp-page-header.component';

class MockRouter {
  url: 'mock';
}

class MockActivatedRoute {
  snapshot = {
    queryParams: null
  };
}

describe('CPPageHeaderComponent', () => {
  let comp: CPPageHeaderComponent;
  let fixture: ComponentFixture<CPPageHeaderComponent>;

  // async beforeEach
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, SharedModule],
      providers: [
        CPSession,
        { provide: ActivatedRoute, useValue: MockActivatedRoute },
        { provide: Router, useValue: MockRouter }
      ]
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
    fixture.detectChanges(); // trigger initial data binding
  });

  it('should init', () => {
    expect(comp).toBeTruthy();
  });

  it('hidden set and allow_internal should not be filtered based on the users email', () => {
    const _data = {
      ...comp.data,
      children: [
        {
          amplitude: 'Banner',
          label: 'customise_banner',
          url: '/customize/banner'
        },
        {
          hidden: true,
          allow_internal: true,
          amplitude: 'Studio',
          label: 't_customise_personas',
          url: '/customize/personas'
        }
      ]
    };

    comp.data = _data;
    let result = comp.getProductionReadyFeatures();

    expect(result.length).toEqual(2);

    comp.session.g.set('user', { email: 'hello@world.com' });

    result = comp.getProductionReadyFeatures();

    expect(result.length).toEqual(1);
  });

  it('header chilren with hidden set should not be returned', () => {
    const _data = {
      ...comp.data,
      children: [
        {
          amplitude: 'Banner',
          label: 'customise_banner',
          url: '/customize/banner'
        },
        {
          hidden: true,
          amplitude: 'Studio',
          label: 't_customise_personas',
          url: '/customize/personas'
        }
      ]
    };

    comp.data = _data;
    const result = comp.getProductionReadyFeatures();

    expect(result.length).toEqual(1);
  });
});
