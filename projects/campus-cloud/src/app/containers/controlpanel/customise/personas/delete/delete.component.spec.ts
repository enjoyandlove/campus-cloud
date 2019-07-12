import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';

import { CPSession } from '@campus-cloud/session';
import { PersonasModule } from './../personas.module';
import { PersonasService } from './../personas.service';
import { PersonasDeleteComponent } from './delete.component';
import { mockPersonas, MockPersonasService } from '../tests';
import { CPI18nService, MODAL_DATA } from '@campus-cloud/shared/services';

describe('PersonasDeleteComponent', () => {
  let comp: PersonasDeleteComponent;
  let fixture: ComponentFixture<PersonasDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [PersonasModule, RouterTestingModule],
      providers: [
        CPSession,
        CPI18nService,
        {
          provide: PersonasService,
          useClass: MockPersonasService
        },
        {
          provide: MODAL_DATA,
          useValue: {
            onClose: () => {},
            onAction: () => {},
            data: mockPersonas[0]
          }
        }
      ]
    });

    fixture = TestBed.createComponent(PersonasDeleteComponent);
    comp = fixture.componentInstance;

    comp.session.g.set('school', { id: 157 });
    comp.persona = mockPersonas[0];
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(comp).toBeTruthy();
  });

  it('resetModal', () => {
    spyOn(comp.modal, 'onClose');

    comp.resetModal();

    expect(comp.modal.onClose).toHaveBeenCalled();
  });

  it('onDelete', () => {
    spyOn(comp.modal, 'onClose');
    spyOn(comp.modal, 'onAction');
    spyOn(comp.service, 'deletePersonaById').and.returnValue(of(comp.persona.id));

    comp.onDelete();

    expect(comp.service.deletePersonaById).toHaveBeenCalled();
    expect(comp.service.deletePersonaById).toHaveBeenCalledTimes(1);

    expect(comp.modal.onClose).toHaveBeenCalled();
    expect(comp.modal.onClose).toHaveBeenCalledTimes(1);

    expect(comp.modal.onAction).toHaveBeenCalled();
    expect(comp.modal.onAction).toHaveBeenCalledTimes(1);
  });

  it('onDelete last persona', () => {
    const spyOnerrorEvent = spyOn(comp.modal, 'onAction');

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
    const spyOnerrorEvent = spyOn(comp.modal, 'onAction');

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
    const spyOnerrorEvent = spyOn(comp.modal, 'onAction');

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
