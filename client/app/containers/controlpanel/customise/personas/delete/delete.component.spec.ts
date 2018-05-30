import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';

import { CPSession } from './../../../../../session';
import { PersonasModule } from './../personas.module';
import { PersonasService } from './../personas.service';
import { PersonasDeleteComponent } from './delete.component';
import { CPI18nService } from './../../../../../shared/services/i18n.service';
import { MockPersonasService, mockPersonas } from '../mock/personas.service.mock';

describe('PersonasDeleteComponent', () => {
  let comp: PersonasDeleteComponent;
  let fixture: ComponentFixture<PersonasDeleteComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [PersonasModule],
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
    spyOn(comp.service, 'deletePersonaById').and.returnValue(Observable.of(comp.persona.id));

    comp.onDelete();

    expect(comp.service.deletePersonaById).toHaveBeenCalled();
    expect(comp.service.deletePersonaById).toHaveBeenCalledTimes(1);

    expect(comp.resetModal).toHaveBeenCalled();
    expect(comp.resetModal).toHaveBeenCalledTimes(1);

    expect(comp.deleted.emit).toHaveBeenCalled();
    expect(comp.deleted.emit).toHaveBeenCalledTimes(1);
  });
});
