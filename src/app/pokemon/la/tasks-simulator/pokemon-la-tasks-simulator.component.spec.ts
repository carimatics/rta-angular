import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemonLATasksSimulatorComponent } from './pokemon-la-tasks-simulator.component';
import { provideZonelessChangeDetection } from '@angular/core';

describe('Page', () => {
  let component: PokemonLATasksSimulatorComponent;
  let fixture: ComponentFixture<PokemonLATasksSimulatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PokemonLATasksSimulatorComponent],
      providers: [provideZonelessChangeDetection()]
    }).compileComponents();

    fixture = TestBed.createComponent(PokemonLATasksSimulatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
