import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemonLAPageComponent } from './page.component';
import { provideZonelessChangeDetection } from '@angular/core';

describe('Page', () => {
  let component: PokemonLAPageComponent;
  let fixture: ComponentFixture<PokemonLAPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PokemonLAPageComponent],
      providers: [provideZonelessChangeDetection()]
    }).compileComponents();

    fixture = TestBed.createComponent(PokemonLAPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
