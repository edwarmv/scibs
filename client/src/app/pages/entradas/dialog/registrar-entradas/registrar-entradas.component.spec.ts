import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarEntradasComponent } from './registrar-entradas.component';

describe('RegistrarEntradasComponent', () => {
  let component: RegistrarEntradasComponent;
  let fixture: ComponentFixture<RegistrarEntradasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistrarEntradasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrarEntradasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
