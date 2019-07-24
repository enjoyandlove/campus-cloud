import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { CPI18nService } from '@campus-cloud/shared/services';
import { SharedModule } from '@campus-cloud/shared/shared.module';
import { ILink } from '@controlpanel/customise/personas/tiles/link.interface';
import { ResourceSelectorTypeWebComponent } from './resource-selector-type-web.component';

describe('ResourceSelectorTypeWebComponent', () => {
  let component: ResourceSelectorTypeWebComponent;
  let fixture: ComponentFixture<ResourceSelectorTypeWebComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [CPI18nService],
      imports: [ReactiveFormsModule, SharedModule],
      declarations: [ResourceSelectorTypeWebComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceSelectorTypeWebComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a form', () => {
    const result = component.buildForm();
    const expected = {
      link_url: '',
      link_type: null,
      link_params: {},
      open_in_browser: null
    };

    expect(result.value).toEqual(expected);
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('should set resources', () => {
      expect(component.items).toBeDefined();
      expect(component.items.length).toBe(3);
      expect(component.resources).toBeDefined();
      expect(component.resources.length).toBe(3);
    });

    it('should filter resources based on filterByWebApp', () => {
      let resultResourcesIds = [];
      let expectedResourcesIds = [];

      component.filterByWebApp = false;
      fixture.detectChanges();
      component.ngOnInit();
      resultResourcesIds = component.resources.map((m) => m.id);
      expectedResourcesIds = ['web_link', 'external_link', 'external_web_app'];

      expect(component.items.length).toBe(3);
      expect(component.resources.length).toBe(3);
      expectedResourcesIds.forEach((resource) => {
        expect(resultResourcesIds.includes(resource)).toBe(true, `missing ${resource}`);
      });

      component.filterByWebApp = true;
      fixture.detectChanges();
      component.ngOnInit();
      resultResourcesIds = component.resources.map((m) => m.id);
      expectedResourcesIds = ['external_link'];

      expect(component.items.length).toBe(1);
      expect(component.resources.length).toBe(1);
      expectedResourcesIds.forEach((resource) => {
        expect(resultResourcesIds.includes(resource)).toBe(true, `missing ${resource}`);
      });
    });

    describe('valueChanges', () => {
      it('should emit form value when form is valid and selectedItem is defined', () => {
        const valueChangesSpy = spyOn(component.valueChanges, 'emit');
        const validForm = {
          link_type: 0,
          link_url: 'http://google.com',
          open_in_browser: 0
        };
        component.selectedItem = 'notNull';
        component.form.patchValue(validForm);

        expect(valueChangesSpy).toHaveBeenCalledWith(component.form.value);
      });

      it('should emit { link_url: "" } when invalid or selectedItem is not defined', () => {
        component.selectedItem = null;
        fixture.detectChanges();
        const valueChangesSpy = spyOn(component.valueChanges, 'emit');
        const invalidForm = {
          link_url: null,
          open_in_browser: 0
        };

        component.form.patchValue(invalidForm);

        expect(valueChangesSpy).toHaveBeenCalledWith({ ...component.form.value, link_url: '' });

        const validForm = {
          link_type: 0,
          link_url: 'http://google.com',
          open_in_browser: 0
        };

        component.form.patchValue(validForm);

        expect(valueChangesSpy).toHaveBeenCalledWith({ ...component.form.value, link_url: '' });

        component.selectedItem = 'notNull';
        fixture.detectChanges();
      });
    });
  });

  describe('updateState', () => {
    it('should set showForm to true', () => {
      component.showForm = false;
      expect(component.showForm).toBe(false);

      const testLink = {
        link_type: 0,
        link_url: 'some',
        open_in_browser: false
      } as ILink;

      component.campusLink = testLink;
      fixture.detectChanges();

      component.updateStateWith(component.getInitialFormValues());

      expect(component.showForm).toBe(true);
    });

    it('should patch form value with campusLink values', () => {
      const testLink = {
        link_type: 5,
        link_url: '',
        open_in_browser: true
      } as ILink;

      component.campusLink = testLink;
      fixture.detectChanges();

      component.updateStateWith(component.getInitialFormValues());

      const { link_url, link_type, open_in_browser } = component.form.value;

      expect(link_url).toEqual(testLink.link_url);
      expect(link_type).toEqual(testLink.link_type);
      expect(open_in_browser).toEqual(0);
    });

    it('should populate correct selectedItem', () => {
      const testLink = {
        link_type: 0,
        link_url: 'some',
        open_in_browser: false
      } as ILink;

      component.campusLink = testLink;
      fixture.detectChanges();

      component.updateStateWith(component.getInitialFormValues());
      expect(component.selectedItem.id).toBe('external_web_app');
    });
  });

  describe('onItemSelected', () => {
    it('should set form to pristine', () => {
      component.onItemSelected({ id: null });
      expect(component.form.pristine).toBe(true);
    });

    it('should set showForm value based on selection id', () => {
      component.onItemSelected({ id: null });
      expect(component.showForm).toBe(false);

      component.onItemSelected({ id: 1, meta: { open_in_browser: 1 } });
      expect(component.showForm).toBe(true);
    });

    it('should update form with new values', () => {
      {
        component.onItemSelected({ id: null });
        const { link_url, open_in_browser } = component.form.value;

        expect(link_url).toBe('');
        expect(open_in_browser).toBeNull();
      }

      {
        component.onItemSelected({ id: 1, meta: { open_in_browser: 1 } });
        const { link_url, open_in_browser } = component.form.value;

        expect(link_url).toBe('');
        expect(open_in_browser).toBe(1);
      }
    });
  });
});
