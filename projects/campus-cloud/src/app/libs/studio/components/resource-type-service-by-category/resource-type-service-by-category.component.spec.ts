import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';

import { CPSession } from '@app/session';
import { mockSchool } from '@app/session/mock';
import { CPI18nService } from '@shared/services';
import { MockTilesService } from '../../tests/mocks';
import { SharedModule } from '@shared/shared.module';
import { TilesService } from '@controlpanel/customise/personas/tiles/tiles.service';
import { ResourceTypeServiceByCategoryComponent } from './resource-type-service-by-category.component';

describe('ResourceTypeServiceByCategoryComponent', () => {
  let session: CPSession;
  let component: ResourceTypeServiceByCategoryComponent;
  let fixture: ComponentFixture<ResourceTypeServiceByCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule, HttpClientModule, RouterTestingModule],
      providers: [CPSession, CPI18nService],
      declarations: [ResourceTypeServiceByCategoryComponent]
    }).overrideComponent(ResourceTypeServiceByCategoryComponent, {
      set: {
        providers: [{ provide: TilesService, useClass: MockTilesService }]
      }
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceTypeServiceByCategoryComponent);
    component = fixture.componentInstance;

    session = TestBed.get(CPSession);

    session.g.set('school', mockSchool);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load categories on ngOnInit', () => {
    spyOn(component, 'loadCategories');

    component.ngOnInit();

    expect(component.loadCategories).toHaveBeenCalled();
  });

  it('should have two options in dropdown', () => {
    expect(component.options.length).toBe(2);
  });

  it('should emit "selected"', () => {
    spyOn(component.selected, 'emit');

    component.doEmit();

    const expected = {
      link_params: {
        category_ids: []
      }
    };
    expect(component.selected.emit).toHaveBeenCalledWith(expected);
  });
});
