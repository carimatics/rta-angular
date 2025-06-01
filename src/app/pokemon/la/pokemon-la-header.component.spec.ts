import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemonLAHeaderComponent } from './pokemon-la-header.component';
import { provideZonelessChangeDetection } from '@angular/core';

describe('Page', () => {
  let component: PokemonLAHeaderComponent;
  let fixture: ComponentFixture<PokemonLAHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PokemonLAHeaderComponent],
      providers: [provideZonelessChangeDetection()]
    }).compileComponents();

    fixture = TestBed.createComponent(PokemonLAHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
