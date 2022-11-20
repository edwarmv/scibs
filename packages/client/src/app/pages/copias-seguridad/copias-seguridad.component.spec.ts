import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CopiasSeguridadComponent } from './copias-seguridad.component';

describe('CopiasSeguridadComponent', () => {
  let component: CopiasSeguridadComponent;
  let fixture: ComponentFixture<CopiasSeguridadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CopiasSeguridadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CopiasSeguridadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
