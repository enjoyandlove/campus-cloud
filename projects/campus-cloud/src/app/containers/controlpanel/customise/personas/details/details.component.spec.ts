import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

import { CPSession } from '@campus-cloud/session';
import { mockSection } from '../sections/__mock__';
import { PersonasModule } from '../personas.module';
import { RootStoreModule } from '@campus-cloud/store';
import { ICampusGuide } from '../sections/section.interface';
import { PersonasDetailsComponent } from './details.component';
import { mockSchool, mockUser } from '@campus-cloud/session/mock';
import { configureTestSuite, CPTestModule } from '@campus-cloud/shared/tests';

describe('PersonasDetailsComponent', () => {
  configureTestSuite();
  beforeAll((done) => {
    (async () => {
      TestBed.configureTestingModule({
        declarations: [],
        imports: [
          CPTestModule,
          HttpClientModule,
          RouterTestingModule,
          PersonasModule,
          RootStoreModule
        ],
        schemas: [NO_ERRORS_SCHEMA]
      });
      await TestBed.compileComponents();
    })()
      .then(done)
      .catch(done.fail);
  });

  let session: CPSession;
  let fixture: ComponentFixture<PersonasDetailsComponent>;
  let component: PersonasDetailsComponent;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PersonasDetailsComponent);
    component = fixture.componentInstance;

    session = TestBed.get(CPSession);
    session.g.set('user', mockUser);
    session.g.set('school', mockSchool);

    component.state = {
      ...component.state,
      guides: [mockSection]
    };
  }));

  it('should return section not empty', () => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const sectionEmpty = component.isSectionEmpty(mockSection.id);
      expect(sectionEmpty).toBe(false);
    });
  });

  it('should return section empty', () => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
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
  });

  it('should delete section', () => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      spyOn(component.sectionService, 'deleteSectionTileCategory').and.callFake(function() {
        return of({});
      });
      component.deleteEmptySection(mockSection.id);
      expect(component.sectionService.deleteSectionTileCategory).toHaveBeenCalled();
    });
  });
});
