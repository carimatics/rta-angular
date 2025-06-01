import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-pokemon',
  imports: [
    RouterOutlet
  ],
  template: `<router-outlet />`,
})
export class PokemonPage {

}

export default PokemonPage;
