import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemonPage } from './pokemon-page.component';
import { provideZonelessChangeDetection } from '@angular/core';

describe('Page', () => {
  let component: PokemonPage;
  let fixture: ComponentFixture<PokemonPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PokemonPage],
      providers: [provideZonelessChangeDetection()]
    }).compileComponents();

    fixture = TestBed.createComponent(PokemonPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
