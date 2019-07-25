import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';

import { CPSession } from '@campus-cloud/session';
import { mockSchool } from '@campus-cloud/session/mock';
import { SharedModule } from '@campus-cloud/shared/shared.module';
import { CampusLink } from '@controlpanel/customise/personas/tiles/tile';
import { CPI18nService, StoreService } from '@campus-cloud/shared/services';
import { ContentUtilsProviders } from '@campus-cloud/libs/studio/providers';
import { ILink } from '@controlpanel/customise/personas/tiles/link.interface';
import { TilesService } from '@controlpanel/customise/personas/tiles/tiles.service';
import { MockTilesService, MockStoreService, getLinkUrlFromResourceList } from '../../tests';
import { ResourceSelectorTypeSingleComponent } from './resource-selector-type-single.component';

describe('ResourceSelectorTypeSingleComponent', () => {
  let session: CPSession;
  let component: ResourceSelectorTypeSingleComponent;
  let fixture: ComponentFixture<ResourceSelectorTypeSingleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule, HttpClientModule, RouterTestingModule],
      providers: [
        CPSession,
        CPI18nService,
        ContentUtilsProviders,
        { provide: StoreService, useClass: MockStoreService }
      ],
      declarations: [ResourceSelectorTypeSingleComponent]
    }).overrideComponent(ResourceSelectorTypeSingleComponent, {
      set: {
        providers: [{ provide: TilesService, useClass: MockTilesService }]
      }
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceSelectorTypeSingleComponent);
    component = fixture.componentInstance;

    session = TestBed.get(CPSession);

    session.g.set('school', mockSchool);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();

    expect(component.form).toBeDefined();
    expect(component.items.length).toBe(3);
  });

  it('should have correct default input values', () => {
    expect(component.isEdit).toBe(false);
    expect(component.filterByWebApp).toBe(false);
    expect(component.filterByLoginStatus).toBe(false);
  });

  it('should create an empty form', () => {
    const result = component.buildForm().value;

    const expected = { link_url: null, link_params: null, link_type: 3 };

    expect(result).toEqual(expected);
  });

  describe('getInitialFormValues', () => {
    it('should return first available resource type details when isEdit is false', () => {
      const expected = {
        link_type: 3,
        ...component.items[0].meta
      };

      const result = component.getInitialFormValues();
      expect(expected).toEqual(result);
    });

    it('should return first available resource type details when isEdit is true but campusLink not in resource list', () => {
      component.isEdit = true;
      component.campusLink = {
        link_type: 4,
        link_params: null,
        link_url: CampusLink.appOpen
      } as ILink;
      fixture.detectChanges();

      const expected = {
        link_type: 3,
        ...component.items[0].meta
      };

      const result = component.getInitialFormValues();
      expect(expected).toEqual(result);
    });

    it('should update form with campusLink values when isEdit is true and campusLink found in resource list', () => {
      const expected = {
        link_type: 3,
        link_params: null,
        link_url: CampusLink.subscribableCalendar
      } as ILink;

      component.isEdit = true;
      component.campusLink = expected;

      fixture.detectChanges();

      const result = component.getInitialFormValues();
      expect(result).toEqual(expected);
    });
  });

  describe('updateStateWith', () => {
    it('should update form values with first resource type details', () => {
      component.isEdit = false;
      component.selectedStore = 'notNull';

      const expected = {
        link_type: 3,
        link_params: component.items[0].meta.link_params,
        link_url: component.items[0].meta.link_url
      } as ILink;

      fixture.detectChanges();
      component.updateStateWith(component.getInitialFormValues());

      expect(component.form.value).toEqual(expected);
    });

    it('should define selectedType', () => {
      component.selectedType = null;

      fixture.detectChanges();
      component.updateStateWith(component.getInitialFormValues());
      expect(component.selectedType).toBeDefined();
    });
  });

  describe('onItemClicked', () => {
    const selectedItem = {
      id: 'campus_service',
      label: 'Campus Service',
      meta: {
        link_params: {},
        link_url: 'oohlala://campus_service'
      }
    };

    it('should call resetHosts$', () => {
      expect(component.resetHosts$.value).toBe(false);
      component.onItemClicked(selectedItem);
      expect(component.resetHosts$.value).toBe(true);
    });

    it('should update subMenuOptions with selected item values', () => {
      const expected = { action: 1, label: 'dummy' };
      component.storesByType = {
        [selectedItem.id]: [expected]
      };
      fixture.detectChanges();
      component.onItemClicked(selectedItem);
      fixture.detectChanges();
      const result: any = component.subMenuOptions;
      expect(result[0]).toEqual(expected);
    });

    it('should update selectedStore with selected item values', () => {
      const expected = { action: 1, label: 'dummy' };
      component.storesByType = {
        [selectedItem.id]: [expected]
      };
      fixture.detectChanges();
      component.onItemClicked(selectedItem);
      fixture.detectChanges();
      const result: any = component.selectedStore;
      expect(result).toEqual(expected);
    });

    it('should patch the form with selected item values', () => {
      const expected = { action: 1, label: 'dummy' };
      component.storesByType = {
        [selectedItem.id]: [expected]
      };
      fixture.detectChanges();
      component.onItemClicked(selectedItem);
      fixture.detectChanges();
      const result = component.form.get('link_url').value;

      expect(result).toBe(selectedItem.meta.link_url);
    });
  });

  describe('ngOnInit', () => {
    it('should populate storesByType with all hosts available', () => {
      spyOn(component, 'loadStores');
      spyOn(component, 'loadServices');
      spyOn(component, 'loadCalendars');

      component.ngOnInit();

      expect(component.storesByType).toBeDefined();
      expect(component.loadStores).toHaveBeenCalled();
      expect(component.loadServices).toHaveBeenCalled();
      expect(component.loadCalendars).toHaveBeenCalled();
      expect(Object.keys(component.storesByType).length).toBe(3);
    });

    describe('valueChanges', () => {
      let valueChangesSpy: jasmine.Spy;

      beforeEach(() => {
        valueChangesSpy = spyOn(component.valueChanges, 'emit');
        component.ngOnInit();

        valueChangesSpy.calls.reset();
      });

      it('should emit with { link_url: null }, when form is invalid', () => {
        component.form.patchValue({ link_params: null });

        expect(valueChangesSpy).toHaveBeenCalledWith({
          ...component.form.value,
          link_url: null
        });
      });

      it('should emit form value, when form is valid', () => {
        component.form.patchValue({ link_params: {}, link_url: CampusLink.storeList });

        expect(valueChangesSpy).toHaveBeenCalledWith(component.form.value);
      });
    });

    it('should set correct fiters based on filterByWebApp, filterByLoginStatus', () => {
      component.filterByWebApp = true;
      component.filterByLoginStatus = true;

      const getResourcesForTypeSpy: jasmine.Spy = spyOn(
        ContentUtilsProviders,
        'getResourcesForType'
      ).and.callThrough();

      component.ngOnInit();
      const [name, validators] = getResourcesForTypeSpy.calls.mostRecent().args;

      expect(validators.length).toBe(2);
      expect(name).toEqual(ContentUtilsProviders.contentTypes.single);

      const webAppFilter = validators.find((v) => v === ContentUtilsProviders.isWebAppContent);
      const loginRequiredFilter = validators.find(
        (v) => v === ContentUtilsProviders.isWebAppContent
      );

      expect(webAppFilter).toBeDefined();
      expect(loginRequiredFilter).toBeDefined();
    });

    it('should set correct resources based on filterByWebApp, filterByLoginStatus', () => {
      let resultResources = [];
      let expectedResources = [];
      component.filterByWebApp = true;
      component.filterByLoginStatus = true;

      fixture.detectChanges();
      component.ngOnInit();

      resultResources = getLinkUrlFromResourceList(component.resources);
      expectedResources = [CampusLink.store, CampusLink.campusService];

      expect(component.resources.length).toBe(2);
      resultResources.forEach((resource) => {
        expect(expectedResources.includes(resource)).toBe(true, `missing ${resource}`);
      });

      component.filterByWebApp = false;
      component.filterByLoginStatus = false;

      fixture.detectChanges();
      component.ngOnInit();
      resultResources = getLinkUrlFromResourceList(component.resources);
      expectedResources = [
        CampusLink.store,
        CampusLink.campusService,
        CampusLink.subscribableCalendar
      ];

      expect(component.resources).toBeDefined();
      expect(component.resources.length).toBe(3);
      resultResources.forEach((resource) => {
        expect(expectedResources.includes(resource)).toBe(true, `missing ${resource}`);
      });

      component.filterByWebApp = true;
      component.filterByLoginStatus = false;

      fixture.detectChanges();
      component.ngOnInit();
      resultResources = getLinkUrlFromResourceList(component.resources);
      expectedResources = [CampusLink.store, CampusLink.campusService];

      expect(component.resources).toBeDefined();
      expect(component.resources.length).toBe(2);
      resultResources.forEach((resource) => {
        expect(expectedResources.includes(resource)).toBe(true, `missing ${resource}`);
      });

      component.filterByWebApp = false;
      component.filterByLoginStatus = true;

      fixture.detectChanges();
      component.ngOnInit();
      resultResources = getLinkUrlFromResourceList(component.resources);
      expectedResources = [
        CampusLink.store,
        CampusLink.campusService,
        CampusLink.subscribableCalendar
      ];

      expect(component.resources).toBeDefined();
      expect(component.resources.length).toBe(3);
      resultResources.forEach((resource) => {
        expect(expectedResources.includes(resource)).toBe(true, `missing ${resource}`);
      });
    });
  });
});
