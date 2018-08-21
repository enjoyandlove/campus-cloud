import { HttpErrorResponse } from '@angular/common/http';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { mockTile } from './../__mock__';
import { CPSession } from './../../../../../../session/index';
import { SharedModule } from './../../../../../../shared/shared.module';
import { TilesService } from './../tiles.service';
import { PersonasTileDeleteComponent } from './delete.component';
import { CPI18nService } from '../../../../../../shared/services';
import { PersonasTilesModule } from '../tiles.module';

class MockTilesService {
  dummy;

  deleteTile(tileId, search) {
    this.dummy = { tileId, search };

    return of(tileId);
  }
}

describe('PersonasTileDeleteComponent', () => {
  let comp: PersonasTileDeleteComponent;
  let fixture: ComponentFixture<PersonasTileDeleteComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [SharedModule, PersonasTilesModule, RouterTestingModule],
        providers: [CPSession, CPI18nService, { provide: TilesService, useClass: MockTilesService }]
      });

      fixture = TestBed.createComponent(PersonasTileDeleteComponent);
      comp = fixture.componentInstance;

      comp.tile = mockTile;
      comp.session.g.set('school', { id: 1 });

      fixture.detectChanges();
    })
  );

  it('should init', () => {
    expect(comp).toBeTruthy();
  });

  it(
    'onDelete',
    fakeAsync(() => {
      spyOn(comp.error, 'emit');
      spyOn(comp.deleted, 'emit');
      spyOn(comp.teardown, 'emit');

      comp.onDelete();

      tick();

      expect(comp.deleted.emit).toHaveBeenCalled();
      expect(comp.teardown.emit).toHaveBeenCalled();
      expect(comp.error.emit).not.toHaveBeenCalled();
      expect(comp.deleted.emit).toHaveBeenCalledWith(mockTile);

      spyOn(comp.service, 'deleteTile').and.returnValue(new HttpErrorResponse({ error: 'error' }));
    })
  );

  it(
    'onDelete errors',
    fakeAsync(() => {
      spyOn(comp.error, 'emit');
      spyOn(comp.deleted, 'emit');
      spyOn(comp.teardown, 'emit');

      const error = new HttpErrorResponse({ error: 'error' });

      spyOn(comp.service, 'deleteTile').and.returnValue(throwError(error));

      comp.onDelete();

      tick();

      expect(comp.error.emit).toHaveBeenCalled();
      expect(comp.teardown.emit).toHaveBeenCalled();
      expect(comp.deleted.emit).not.toHaveBeenCalled();
      expect(comp.error.emit).toHaveBeenCalledWith(error);
    })
  );
});
