import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemonLATasksSimulatorPage } from './pokemon-la-tasks-simulator-page.component';
import { provideZonelessChangeDetection } from '@angular/core';

describe('Page', () => {
  let component: PokemonLATasksSimulatorPage;
  let fixture: ComponentFixture<PokemonLATasksSimulatorPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PokemonLATasksSimulatorPage],
      providers: [provideZonelessChangeDetection()]
    }).compileComponents();

    fixture = TestBed.createComponent(PokemonLATasksSimulatorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
