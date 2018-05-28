import { Observable } from 'rxjs/Observable';
import { PersonasService } from './../personas.service';
import { CPI18nService } from './../../../../../shared/services/i18n.service';
import { CPSession } from './../../../../../session/index';
import { async, TestBed, ComponentFixture } from '@angular/core/testing';

import { PersonasModule } from './../personas.module';
import { PersonasDeleteComponent } from './delete.component';
import { MockPersonasService, mockPersonas } from '../mock/personas.service.mock';

fdescribe('PersonasDeleteComponent', () => {
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
    expect(comp.resetModal).toHaveBeenCalled();
    expect(comp.deleted.emit).toHaveBeenCalled();
  });
});
