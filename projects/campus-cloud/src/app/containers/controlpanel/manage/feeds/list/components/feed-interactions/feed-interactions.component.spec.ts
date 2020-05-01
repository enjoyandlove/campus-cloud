import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalService } from '@ready-education/ready-ui/overlays';

import { CPSession } from '@campus-cloud/session';
import { mockSchool } from '@campus-cloud/session/mock';
import { CPTestModule } from '@campus-cloud/shared/tests';
import { FeedInteractionsComponent } from './feed-interactions.component';

describe('FeedInteractionsComponent', () => {
  let session: CPSession;
  let component: FeedInteractionsComponent;
  let fixture: ComponentFixture<FeedInteractionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CPTestModule],
      providers: [ModalService],
      declarations: [FeedInteractionsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedInteractionsComponent);
    component = fixture.componentInstance;

    session = TestBed.inject(CPSession);
    session.g.set('school', mockSchool);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
