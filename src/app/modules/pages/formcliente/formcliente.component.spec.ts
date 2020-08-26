import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormclienteComponent } from './formcliente.component';

describe('FormclienteComponent', () => {
  let component: FormclienteComponent;
  let fixture: ComponentFixture<FormclienteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormclienteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormclienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
