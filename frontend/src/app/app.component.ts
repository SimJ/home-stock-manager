import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { InventoryComponent } from "./inventory/inventory.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, InventoryComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppComponent {
  title = 'inventory';
}
