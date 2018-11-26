import { configureTestSuite } from '../../../../../shared/tests';
import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { PersonasDetailsComponent } from './details.component';
import { RouterTestingModule } from '@angular/router/testing';
import { mockPersonas } from '../__mock__/personas.mock';
import { mockSection } from '../sections/__mock__';

const personas = mockPersonas;
const section = mockSection;

describe('PersonasDetailsComponent', () => {
  configureTestSuite();
  beforeAll((done) => {
    (async () => {
      TestBed.configureTestingModule({
        declarations: [PersonasDetailsComponent],
        imports: [RouterTestingModule],
        providers: []
      });
      await TestBed.compileComponents();
    })()
      .then(done)
      .catch(done.fail);
  });

  let fixture: ComponentFixture<PersonasDetailsComponent>;
  let component: PersonasDetailsComponent;

  beforeEach(
    async(() => {
      fixture = TestBed.createComponent(PersonasDetailsComponent);
      component = fixture.componentInstance;

      component.state = {
        ...component.state,
        guides: [section]
      };
    })
  );

  it('should return section empty', () => {});

  it('should call delete section', () => {});
});
