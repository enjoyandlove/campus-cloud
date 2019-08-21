import { CPI18nService } from './../../../../../../shared/services/i18n.service';
import { TestBed, ComponentFixture } from '@angular/core/testing';

import { EngagementModule } from './../../engagement.module';
import { EngagementStatsComponent } from './engagement-stats.component';

import { configureTestSuite } from '../../../../../../shared/tests';

describe('EngagementStatsComponent', () => {
  configureTestSuite();

  beforeAll((done) =>
    (async () => {
      TestBed.configureTestingModule({
        imports: [EngagementModule],
        providers: [CPI18nService]
      });

      await TestBed.compileComponents();
    })()
      .then(done)
      .catch(done.fail)
  );

  let component: EngagementStatsComponent;
  let fixture: ComponentFixture<EngagementStatsComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EngagementStatsComponent);
    component = fixture.componentInstance;
  });
});
