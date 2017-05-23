import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KittComponent } from './kitt.component';

describe('KittComponent', () => {
  let component: KittComponent;
  let fixture: ComponentFixture<KittComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KittComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KittComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
