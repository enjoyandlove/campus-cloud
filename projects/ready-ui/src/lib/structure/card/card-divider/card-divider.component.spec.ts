import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardDividerComponent } from './card-divider.component';

describe('CardDividerComponent', () => {
  let component: CardDividerComponent;
  let fixture: ComponentFixture<CardDividerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardDividerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardDividerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
