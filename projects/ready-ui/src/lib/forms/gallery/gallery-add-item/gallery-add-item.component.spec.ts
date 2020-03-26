import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GalleryAddItemComponent } from './gallery-add-item.component';

describe('GalleryAddItemComponent', () => {
  let component: GalleryAddItemComponent;
  let fixture: ComponentFixture<GalleryAddItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GalleryAddItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GalleryAddItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
