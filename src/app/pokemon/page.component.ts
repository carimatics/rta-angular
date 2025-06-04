import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-pokemon-page',
  imports: [RouterOutlet],
  template: `<router-outlet />`,
})
export class PokemonPageComponent {}

export default PokemonPageComponent;
