import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemonLATasksSimulatorPage } from './page';

describe('Page', () => {
  let component: PokemonLATasksSimulatorPage;
  let fixture: ComponentFixture<PokemonLATasksSimulatorPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PokemonLATasksSimulatorPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PokemonLATasksSimulatorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
