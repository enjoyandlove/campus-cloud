import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';

import { CPSession } from '@campus-cloud/session';
import { mockSchool } from '@campus-cloud/session/mock';
import { CampusLink } from '@controlpanel/manage/links/tile';
import { SharedModule } from '@campus-cloud/shared/shared.module';
import { CPI18nService, StoreService } from '@campus-cloud/shared/services';
import { ContentUtilsProviders } from '@campus-cloud/libs/studio/providers';
import { TilesService } from '@controlpanel/customise/personas/tiles/tiles.service';
import { MockTilesService, MockStoreService, getLinkUrlFromResourceList } from '../../tests';
import { ResourceSelectorTypeSingleComponent } from './resource-selector-type-single.component';

const invalidFormEmitValue = { link_url: null };

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
  });

  it('should have correct default input values', () => {
    expect(component.isEdit).toBe(false);
    expect(component.filterByWebApp).toBe(false);
    expect(component.filterByLoginStatus).toBe(false);
  });

  it('should create an empty form', () => {
    component.buildForm();

    fixture.detectChanges();

    const expected = { link_url: null, link_params: null, link_type: 3 };

    expect(component.form.value).toEqual(expected);
  });

  describe('ngOnInit', () => {
    it('should call buildForm', () => {
      spyOn(component, 'buildForm');

      component.ngOnInit();

      expect(component.form).toBeDefined();
      expect(component.buildForm).toHaveBeenCalled();
    });

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

        expect(valueChangesSpy).toHaveBeenCalledWith(invalidFormEmitValue);
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
      );

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