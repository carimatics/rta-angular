import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemonLAPage } from './pokemon-la-page.component';
import { provideZonelessChangeDetection } from '@angular/core';

describe('Page', () => {
  let component: PokemonLAPage;
  let fixture: ComponentFixture<PokemonLAPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PokemonLAPage],
      providers: [provideZonelessChangeDetection()]
    }).compileComponents();

    fixture = TestBed.createComponent(PokemonLAPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
