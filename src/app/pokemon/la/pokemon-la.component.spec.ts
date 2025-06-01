import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemonLAComponent } from './pokemon-la.component';
import { provideZonelessChangeDetection } from '@angular/core';

describe('Page', () => {
  let component: PokemonLAComponent;
  let fixture: ComponentFixture<PokemonLAComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PokemonLAComponent],
      providers: [provideZonelessChangeDetection()]
    }).compileComponents();

    fixture = TestBed.createComponent(PokemonLAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
