import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of, throwError } from 'rxjs';

import { CPSession } from '@campus-cloud/session';
import { mockSchool } from '@campus-cloud/session/mock';
import { mockEditorContent, mockTerms } from '../tests';
import { TermsOfUseCreateComponent } from './terms-of-use-create.component';
import { configureTestSuite, CPTestModule } from '@campus-cloud/shared/tests';
import { TermsOfUsePipe } from '@controlpanel/campus-app-management/terms-of-use/pipes';
import { MockTermsOfUseService } from '@controlpanel/campus-app-management/terms-of-use/tests';
import { TermsOfUseService } from '@controlpanel/campus-app-management/terms-of-use/terms-of-use.service';

describe('TermsOfUseCreateComponent', () => {
  configureTestSuite();

  beforeAll((done) => {
    (async () => {
      TestBed.configureTestingModule({
        imports: [CPTestModule],
        declarations: [TermsOfUseCreateComponent, TermsOfUsePipe],
        providers: [{ provide: TermsOfUseService, useClass: MockTermsOfUseService }],
        schemas: [NO_ERRORS_SCHEMA]
      });
      await TestBed.compileComponents();
    })()
      .then(done)
      .catch(done.fail);
  });

  let session: CPSession;
  let fixture: ComponentFixture<TermsOfUseCreateComponent>;
  let component: TermsOfUseCreateComponent;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(TermsOfUseCreateComponent);
    component = fixture.componentInstance;

    session = TestBed.get(CPSession);
    session.g.set('school', mockSchool);

    fixture.detectChanges();

    spyOn(component.service, 'getTerms').and.returnValues(of(mockTerms));
  }));

  it('should get terms of use', () => {
    component.fetch();

    expect(component.service.getTerms).toHaveBeenCalled();
    expect(component.editor.quill.getText()).not.toBeNull();
  });

  it('should publish terms of use (error)', () => {
    spyOn(component, 'handleError');
    spyOn(component.service, 'postTerms').and.returnValues(throwError({}));

    component.publishTerms();

    expect(component.handleError).toHaveBeenCalled();
    expect(component.service.postTerms).toHaveBeenCalled();
  });

  it('should publish terms of use (success)', () => {
    spyOn(component, 'handleSuccess');
    spyOn(component.service, 'postTerms').and.returnValues(of(mockTerms));

    component.publishTerms();

    expect(component.handleSuccess).toHaveBeenCalled();
    expect(component.content).toEqual(mockEditorContent);
    expect(component.service.postTerms).toHaveBeenCalled();
  });
});
