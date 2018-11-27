import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

import { CPSession } from '../../../../../session';
import { mockSection } from '../sections/__mock__';
import { PersonasModule } from '../personas.module';
import { RootStoreModule } from '../../../../../store';
import { ICampusGuide } from '../sections/section.interface';
import mockSession from '../../../../../session/mock/session';
import { CPI18nService } from '../../../../../shared/services';
import { PersonasDetailsComponent } from './details.component';
import { configureTestSuite } from '../../../../../shared/tests';

describe('PersonasDetailsComponent', () => {
  configureTestSuite();
  beforeAll((done) => {
    (async () => {
      TestBed.configureTestingModule({
        declarations: [],
        imports: [HttpClientModule, RouterTestingModule, PersonasModule, RootStoreModule],
        providers: [
          CPI18nService,
          {
            provide: CPSession,
            useValue: mockSession
          }
        ],
        schemas: [NO_ERRORS_SCHEMA]
      });
      await TestBed.compileComponents();
    })()
      .then(done)
      .catch(done.fail);
  });

  let fixture: ComponentFixture<PersonasDetailsComponent>;
  let component: PersonasDetailsComponent;

  beforeEach(
    async(() => {
      fixture = TestBed.createComponent(PersonasDetailsComponent);
      component = fixture.componentInstance;

      fixture.detectChanges();
      fixture.whenStable().then(() => {
        component.state = {
          ...component.state,
          guides: [mockSection]
        };
      });
    })
  );

  it('should return section not empty', () => {
    const sectionEmpty = component.isSectionEmpty(mockSection.id);
    expect(sectionEmpty).toBe(false);
  });

  it('should return section empty', () => {
    component.state = {
      ...component.state,
      guides: [
        ...component.state.guides.map((g: ICampusGuide) => {
          return { ...g, tiles: [] };
        })
      ]
    };
    const sectionEmpty = component.isSectionEmpty(mockSection.id);
    expect(sectionEmpty).toBe(true);
  });

  it('should delete section', () => {
    spyOn(component.sectionService, 'deleteSectionTileCategory').and.callFake(function() {
      return of({});
    });
    component.deleteEmptySection(mockSection.id);
    expect(component.sectionService.deleteSectionTileCategory).toHaveBeenCalled();
  });
});
