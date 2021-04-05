import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceptMailComponent } from './accept-mail.component';

describe('AcceptMailComponent', () => {
  let component: AcceptMailComponent;
  let fixture: ComponentFixture<AcceptMailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcceptMailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AcceptMailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
