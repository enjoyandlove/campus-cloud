import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';

import { mockTile } from './../tests/mocks';
import { TilesService } from './../tiles.service';
import { CPSession } from '@campus-cloud/session';
import { PersonasTilesModule } from '../tiles.module';
import { PersonasTileComponent } from './tile.component';
import { TilesUtilsService } from './../tiles.utils.service';
import { CPI18nService } from '@campus-cloud/shared/services';
import { mockSchool } from '@campus-cloud/session/mock/school';
import { SharedModule } from '@campus-cloud/shared/shared.module';

class MockTilesService {
  dummy;

  updateTile(tileId, search) {
    this.dummy = { tileId, search };

    return of(mockTile);
  }
}

const initialState = { working: false };

describe('PersonasTileComponent', () => {
  let comp: PersonasTileComponent;
  let fixture: ComponentFixture<PersonasTileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule, PersonasTilesModule, RouterTestingModule],
      providers: [
        CPSession,
        CPI18nService,
        TilesUtilsService,
        provideMockStore(),
        { provide: TilesService, useClass: MockTilesService }
      ]
    });

    fixture = TestBed.createComponent(PersonasTileComponent);
    comp = fixture.componentInstance;
    comp.tile = mockTile;
    comp.session.g.set('school', mockSchool);
    fixture.detectChanges();
  }));

  it('should init', () => {
    expect(comp).toBeTruthy();
    expect(comp.state).toEqual(initialState);
  });

  it('errorHandler', () => {
    spyOn(comp.store, 'dispatch');
    comp.errorHandler();

    expect(comp.state.working).toBeFalsy();
    expect(comp.store.dispatch).toHaveBeenCalled();
  });

  it('onToggleTile', () => {
    spyOn(comp.edited, 'emit');
    spyOn(comp, 'errorHandler');
    spyOn(comp.service, 'updateTile').and.callThrough();

    comp.onToggleTile();

    expect(comp.edited.emit).toHaveBeenCalled();
    expect(comp.edited.emit).toHaveBeenCalledWith(mockTile);
    expect(comp.errorHandler).not.toHaveBeenCalled();

    fixture.detectChanges();
  });
});
