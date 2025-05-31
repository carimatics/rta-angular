import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemonLAPage } from './page';

describe('Page', () => {
  let component: PokemonLAPage;
  let fixture: ComponentFixture<PokemonLAPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PokemonLAPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PokemonLAPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
