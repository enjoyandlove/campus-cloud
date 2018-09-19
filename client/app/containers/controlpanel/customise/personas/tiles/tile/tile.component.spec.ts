import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule } from '@ngrx/store';
import { of } from 'rxjs';

import { mockTile } from './../__mock__';
import { TilesService } from './../tiles.service';
import { CPSession } from '../../../../../../session';
import { PersonasTilesModule } from '../tiles.module';
import { PersonasTileComponent } from './tile.component';
import { TilesUtilsService } from './../tiles.utils.service';
import { CPI18nService } from '../../../../../../shared/services';
import { mockSchool } from './../../../../../../session/mock/school';
import { SharedModule } from '../../../../../../shared/shared.module';

class MockTilesService {
  dummy;

  updateTile(tileId, search) {
    this.dummy = { tileId, search };

    return of(mockTile);
  }
}

const initialState = { working: false, hover: false };

describe('PersonasTileComponent', () => {
  let comp: PersonasTileComponent;
  let fixture: ComponentFixture<PersonasTileComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [SharedModule, PersonasTilesModule, RouterTestingModule, StoreModule.forRoot({})],
        providers: [
          CPSession,
          CPI18nService,
          TilesUtilsService,
          { provide: TilesService, useClass: MockTilesService }
        ]
      });

      fixture = TestBed.createComponent(PersonasTileComponent);
      comp = fixture.componentInstance;
      comp.tile = mockTile;
      comp.session.g.set('school', mockSchool);
      fixture.detectChanges();
    })
  );

  it('should init', () => {
    expect(comp).toBeTruthy();
    expect(comp.state).toEqual(initialState);
  });

  it('toggleHover', () => {
    comp.toggleHover(true);
    expect(comp.state.hover).toBeTruthy();

    comp.toggleHover(false);
    expect(comp.state.hover).toBeFalsy();
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
