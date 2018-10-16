import { HttpErrorResponse } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { CPSession } from './../../../../../session';
import { CPI18nService } from './../../../../../shared/services/i18n.service';
import { PersonasModule } from './../personas.module';
import { PersonasService } from './../personas.service';
import { PersonasDeleteComponent } from './delete.component';
import { mockPersonas, MockPersonasService } from '../mock/personas.service.mock';

describe('PersonasDeleteComponent', () => {
  let comp: PersonasDeleteComponent;
  let fixture: ComponentFixture<PersonasDeleteComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [PersonasModule, RouterTestingModule],
        providers: [
          CPSession,
          CPI18nService,
          {
            provide: PersonasService,
            useClass: MockPersonasService
          }
        ]
      });

      fixture = TestBed.createComponent(PersonasDeleteComponent);
      comp = fixture.componentInstance;

      comp.session.g.set('school', { id: 157 });
      comp.persona = mockPersonas[0];
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(comp).toBeTruthy();
    expect(comp.personaName).toBe("Student's Tile");
  });

  it('resetModal', () => {
    spyOn(comp.teardown, 'emit');

    comp.resetModal();

    expect(comp.buttonData.disabled).toBeFalsy();
    expect(comp.teardown.emit).toHaveBeenCalled();
  });

  it('onDelete', () => {
    spyOn(comp, 'resetModal');
    spyOn(comp.deleted, 'emit');
    spyOn(comp.service, 'deletePersonaById').and.returnValue(of(comp.persona.id));

    comp.onDelete();

    expect(comp.service.deletePersonaById).toHaveBeenCalled();
    expect(comp.service.deletePersonaById).toHaveBeenCalledTimes(1);

    expect(comp.resetModal).toHaveBeenCalled();
    expect(comp.resetModal).toHaveBeenCalledTimes(1);

    expect(comp.deleted.emit).toHaveBeenCalled();
    expect(comp.deleted.emit).toHaveBeenCalledTimes(1);
  });

  it('onDelete last persona', () => {
    const spyOnerrorEvent = spyOn(comp.errorEvent, 'emit');

    spyOn(comp.service, 'deletePersonaById').and.returnValue(
      throwError(new HttpErrorResponse({ error: { response: 'last persona' } }))
    );

    comp.onDelete();

    expect(spyOnerrorEvent).toHaveBeenCalled();
    expect(spyOnerrorEvent).toHaveBeenCalledWith(
      'A school must have at least one experience enabled.'
    );
  });

  it('onDelete users associated', () => {
    const spyOnerrorEvent = spyOn(comp.errorEvent, 'emit');

    spyOn(comp.service, 'deletePersonaById').and.returnValue(
      throwError(new HttpErrorResponse({ error: { response: 'users associated' } }))
    );

    comp.onDelete();

    expect(spyOnerrorEvent).toHaveBeenCalled();
    expect(spyOnerrorEvent).toHaveBeenCalledWith(
      'This experience has users associated, so you cannot delete it.'
    );
  });

  it('onDelete users persona non-empty', () => {
    const spyOnerrorEvent = spyOn(comp.errorEvent, 'emit');

    spyOn(comp.service, 'deletePersonaById').and.returnValue(
      throwError(new HttpErrorResponse({ error: { response: 'persona non-empty' } }))
    );

    comp.onDelete();

    expect(spyOnerrorEvent).toHaveBeenCalled();
    expect(spyOnerrorEvent).toHaveBeenCalledWith(
      comp.cpI18n.translate('t_personas_delete_error_persona_non_empty')
    );
  });
});
