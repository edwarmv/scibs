import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnidadesManejoComponent } from './unidades-manejo.component';

describe('UnidadesManejoComponent', () => {
  let component: UnidadesManejoComponent;
  let fixture: ComponentFixture<UnidadesManejoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnidadesManejoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnidadesManejoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
