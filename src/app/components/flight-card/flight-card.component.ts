import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { Flight } from '../../models/flight.model';

@Component({
  selector: 'app-flight-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatChipsModule, MatDividerModule],
  templateUrl: './flight-card.component.html',
  styleUrl: './flight-card.component.scss'
})
export class FlightCardComponent {
  readonly flight = input.required<Flight>();
  readonly returnFlight = input<Flight | null>(null);
  readonly isRoundTrip = input<boolean>(false);
  readonly bookFlight = output<Flight>();

  readonly totalPrice = computed(() => {
    const outbound = this.flight();
    const ret = this.returnFlight();
    if (this.isRoundTrip() && ret) {
      return outbound.price + ret.price;
    }
    return outbound.price;
  });

  formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  }

  onBook(): void {
    this.bookFlight.emit(this.flight());
  }
}
