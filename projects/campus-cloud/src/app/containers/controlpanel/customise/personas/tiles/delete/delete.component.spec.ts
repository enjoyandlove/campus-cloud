import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';

import { mockTile } from '../tests/mocks';
import { TilesService } from '../tiles.service';
import { PersonasTilesModule } from '../tiles.module';
import { CPTestModule } from '@campus-cloud/shared/tests';
import { PersonasTileDeleteComponent } from './delete.component';
import { SharedModule } from '@campus-cloud/shared/shared.module';

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

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule, PersonasTilesModule, RouterTestingModule, CPTestModule],
      providers: [{ provide: TilesService, useClass: MockTilesService }]
    });

    fixture = TestBed.createComponent(PersonasTileDeleteComponent);
    comp = fixture.componentInstance;

    comp.tile = mockTile;
    comp.session.g.set('school', { id: 1 });

    fixture.detectChanges();
  }));

  it('onDelete', fakeAsync(() => {
    spyOn(comp.error, 'emit');
    spyOn(comp.deleted, 'emit');
    spyOn(comp.teardown, 'emit');

    comp.onDelete();

    tick();

    expect(comp.deleted.emit).toHaveBeenCalled();
    expect(comp.teardown.emit).toHaveBeenCalled();
    expect(comp.error.emit).not.toHaveBeenCalled();
    expect(comp.deleted.emit).toHaveBeenCalledWith(mockTile);

    spyOn(comp.service, 'deleteTile').and.returnValue(
      of(new HttpErrorResponse({ error: 'error' }))
    );
  }));

  it('onDelete errors', fakeAsync(() => {
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
  }));
});
