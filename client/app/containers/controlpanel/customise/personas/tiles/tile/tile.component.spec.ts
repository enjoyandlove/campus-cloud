import { of } from 'rxjs';
import { StoreModule } from '@ngrx/store';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TilesService } from './../tiles.service';
import { TilesUtilsService } from './../tiles.utils.service';
import { PersonasTileComponent } from './tile.component';
import { CPSession } from '../../../../../../session';
import { CPI18nService } from '../../../../../../shared/services';
import { SharedModule } from '../../../../../../shared/shared.module';
import { PersonasTilesModule } from '../tiles.module';

class MockTilesService {
  dummy;

  updateTile(tileId, search) {
    this.dummy = { tileId, search };

    return of(tileId);
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

  xit('onToggleTile', () => {
    comp.onToggleTile();

    expect(comp.state.working).toBeTruthy();
  });
});
