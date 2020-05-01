import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SkeletonAvatarComponent } from './skeleton-avatar.component';

describe('SkeletonAvatarComponent', () => {
  let component: SkeletonAvatarComponent;
  let fixture: ComponentFixture<SkeletonAvatarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SkeletonAvatarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkeletonAvatarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
