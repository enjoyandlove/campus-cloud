import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { StoreModule, Store } from '@ngrx/store';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { of } from 'rxjs';

import * as fromStore from '../../../store';

import { FeedsModule } from './../../../feeds.module';
import { FeedItemComponent } from './feed-item.component';
import { mockFeed } from '@controlpanel/manage/feeds/tests';
import { configureTestSuite, CPTestModule } from '@campus-cloud/shared/tests';
import { FeedDropdownComponent } from './../feed-dropdown/feed-dropdown.component';

describe('FeedItemComponent', () => {
  configureTestSuite();
  beforeAll((done) => {
    (async () => {
      TestBed.configureTestingModule({
        imports: [
          CPTestModule,
          FeedsModule,
          StoreModule.forFeature('WALLS_STATE', {
            feeds: fromStore.feedsReducer,
            bannedEmails: fromStore.bannedEmailsReducer
          })
        ],
        providers: []
      });
      await TestBed.compileComponents();
    })()
      .then(done)
      .catch(done.fail);
  });

  let de: DebugElement;
  let store: Store<fromStore.IWallsState>;
  let fixture: ComponentFixture<FeedItemComponent>;
  let component: FeedItemComponent;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(FeedItemComponent);
    component = fixture.componentInstance;

    store = TestBed.inject(Store);

    de = fixture.debugElement;
    component.feed = mockFeed;
    component.isCampusWallView = of(true);

    fixture.detectChanges();
  }));

  describe('onMoved', () => {
    it('should emit with passed param', () => {
      const expected = 'expected';
      spyOn(component.moved, 'emit');

      component.onMoved(expected);

      expect(component.moved.emit).toHaveBeenCalledWith(expected);
    });
  });

  describe('dropdown element', () => {
    it('should be visibile for non deleted threads', () => {
      component.feed = {
        ...mockFeed,
        flag: 0
      };
      fixture.detectChanges();
      const dropdown = de.query(By.directive(FeedDropdownComponent));

      expect(dropdown).not.toBeNull();
    });
  });

  describe('onSelected', () => {
    it('should launch approval modal', () => {
      component.onSelected(1);
      expect(component.isApproveModal).toBe(true);
    });

    it('should launch move modal', () => {
      component.onSelected(2);
      expect(component.isMoveModal).toBe(true);
    });

    it('should launch delete modal', () => {
      component.onSelected(3);
      expect(component.isDeleteModal).toBe(true);
    });
  });
});
