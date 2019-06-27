import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';

import { CPSession } from '@campus-cloud/session';
import { mockSchool } from '@campus-cloud/session/mock';
import { getLinkUrlFromResourceList } from '../../tests';
import { CampusLink } from '@controlpanel/manage/links/tile';
import { CPI18nService } from '@campus-cloud/shared/services';
import { MockIntegrationDataService } from '../../tests/mocks';
import { SharedModule } from '@campus-cloud/shared/shared.module';
import { IntegrationDataService, ContentUtilsProviders } from '../../providers';
import { ResourceTypeServiceByCategoryComponent } from '../resource-type-service-by-category';
import { ResourceSelectorTypeResourceComponent } from './resource-selector-type-resource.component';

describe('ResourceSelectorTypeResourceComponent', () => {
  let session: CPSession;
  let component: ResourceSelectorTypeResourceComponent;
  let fixture: ComponentFixture<ResourceSelectorTypeResourceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule, HttpClientModule, RouterTestingModule],
      providers: [
        CPSession,
        CPI18nService,
        ContentUtilsProviders,
        { provide: IntegrationDataService, useClass: MockIntegrationDataService }
      ],
      declarations: [ResourceSelectorTypeResourceComponent, ResourceTypeServiceByCategoryComponent]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceSelectorTypeResourceComponent);
    component = fixture.componentInstance;

    session = TestBed.get(CPSession);

    session.g.set('school', mockSchool);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have correct outputs', () => {
    expect(component.valueChanges).toBeDefined();
  });

  it('should have correct default input values', () => {
    expect(component.isEdit).toBe(false);
    expect(component.filterByWebApp).toBe(false);
    expect(component.filterByLoginStatus).toBe(false);
  });

  it('should create an empty form', () => {
    component.buildForm();

    fixture.detectChanges();

    const expected = { link_url: null, link_params: {}, link_type: 3 };

    expect(component.form.value).toEqual(expected);
  });

  describe('ngOnInit', () => {
    it('should call buildForm', () => {
      spyOn(component, 'buildForm');

      component.ngOnInit();

      expect(component.form).toBeDefined();
      expect(component.buildForm).toHaveBeenCalled();
    });

    describe('valueChanges', () => {
      let valueChangesSpy: jasmine.Spy;

      beforeEach(() => {
        valueChangesSpy = spyOn(component.valueChanges, 'emit');
        component.ngOnInit();

        valueChangesSpy.calls.reset();
      });

      it('should emit form value, when form is valid', () => {
        component.form.patchValue({ link_params: {}, link_url: CampusLink.campusPoi });

        expect(valueChangesSpy).toHaveBeenCalledWith(component.form.value);
      });

      it('should emit {link_url: null}, when form is invalid', () => {
        component.form.patchValue({ link_url: null });

        expect(valueChangesSpy).toHaveBeenCalledWith({ link_url: null });
      });
    });

    it('should set correct filters based on filterByWebApp, filterByLoginStatus', fakeAsync(() => {
      component.filterByWebApp = true;
      component.filterByLoginStatus = true;

      const getResourcesForTypeSpy: jasmine.Spy = spyOn(
        ContentUtilsProviders,
        'getResourcesForType'
      );

      fixture.detectChanges();
      component.ngOnInit();
      tick();
      const [name, validators] = getResourcesForTypeSpy.calls.mostRecent().args;

      expect(validators.length).toBe(3);
      expect(name).toEqual(ContentUtilsProviders.contentTypes.list);

      const webAppFilter = validators.find((v) => v === ContentUtilsProviders.isWebAppContent);
      const loginRequiredFilter = validators.find(
        (v) => v === ContentUtilsProviders.isWebAppContent
      );

      expect(webAppFilter).toBeDefined();
      expect(loginRequiredFilter).toBeDefined();
    }));

    it('should set form to invalid when link params is empty when required', () => {
      expect(component.form.valid).toBe(false);

      component.resourcesWithLinkParamsRequired.forEach((resource) => {
        component.form.patchValue({ link_url: resource });
        component.form.patchValue({ link_params: {} });

        expect(component.form.valid).toBe(false);
      });
    });

    it('should filter resources by webapp=true, login=true', fakeAsync(() => {
      let resultResources = [];
      const expectedResources = [
        CampusLink.dining,
        CampusLink.storeList,
        CampusLink.eventList,
        CampusLink.dealStoreList,
        CampusLink.campusPoiList,
        CampusLink.campusServiceList
      ];

      component.filterByWebApp = true;
      component.filterByLoginStatus = true;

      fixture.detectChanges();
      component.ngOnInit();
      resultResources = getLinkUrlFromResourceList(component.resources);

      tick();
      expect(component.resources).toBeDefined();
      expect(component.resources.length).toBe(7);

      resultResources.forEach((resource) => {
        expect(expectedResources.includes(resource)).toBe(true, `missing ${resource}`);
      });
    }));

    it('should filter resources by webapp=false, login=false', fakeAsync(() => {
      let resultResources = [];
      const expectedResources = [
        CampusLink.dining,
        CampusLink.jobList,
        CampusLink.storeList,
        CampusLink.timetable,
        CampusLink.directory,
        CampusLink.eventList,
        CampusLink.courseSearch,
        CampusLink.dealStoreList,
        CampusLink.campusPoiList,
        CampusLink.campusServiceList,
        CampusLink.academicCalendarList,
        CampusLink.orientationCalendarList,
        CampusLink.userOrientationCalendarList
      ];

      component.filterByWebApp = false;
      component.filterByLoginStatus = false;

      fixture.detectChanges();
      component.ngOnInit();
      resultResources = getLinkUrlFromResourceList(component.resources);
      tick();

      expect(component.resources).toBeDefined();
      expect(component.resources.length).toBe(14);
      resultResources.forEach((resource) => {
        expect(expectedResources.includes(resource)).toBe(true, `missing ${resource}`);
      });
    }));

    it('should filter resources by webapp=true, login=false', fakeAsync(() => {
      let resultResources = [];
      const expectedResources = [
        CampusLink.dining,
        CampusLink.jobList,
        CampusLink.storeList,
        CampusLink.eventList,
        CampusLink.dealStoreList,
        CampusLink.campusPoiList,
        CampusLink.campusServiceList
      ];

      component.filterByWebApp = true;
      component.filterByLoginStatus = false;

      fixture.detectChanges();
      component.ngOnInit();
      resultResources = getLinkUrlFromResourceList(component.resources);
      tick();

      expect(component.resources).toBeDefined();
      expect(component.resources.length).toBe(8);
      resultResources.forEach((resource) => {
        expect(expectedResources.includes(resource)).toBe(true, `missing ${resource}`);
      });
    }));

    it('should filter resources by webapp=false, login=true', fakeAsync(() => {
      let resultResources = [];
      const expectedResources = [
        CampusLink.dining,
        CampusLink.storeList,
        CampusLink.directory,
        CampusLink.eventList,
        CampusLink.dealStoreList,
        CampusLink.campusPoiList,
        CampusLink.campusServiceList,
        CampusLink.orientationCalendarList
      ];
      component.filterByWebApp = false;
      component.filterByLoginStatus = true;

      fixture.detectChanges();
      component.ngOnInit();
      resultResources = getLinkUrlFromResourceList(component.resources);
      tick();
      expect(component.resources).toBeDefined();
      expect(component.resources.length).toBe(9);
      resultResources.forEach((resource) => {
        expect(expectedResources.includes(resource)).toBe(true, `missing ${resource}`);
      });
    }));
  });

  describe('initResources', () => {
    it('should call updateState when isEdit is true', () => {
      spyOn(component, 'updateState');

      component.isEdit = true;
      fixture.detectChanges();

      component.initResources();

      expect(component.updateState).toHaveBeenCalled();
    });
  });
});
