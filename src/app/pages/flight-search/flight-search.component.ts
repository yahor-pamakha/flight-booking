import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FlightService } from '../../services/flight.service';
import { SearchCriteria } from '../../models/flight.model';

@Component({
  selector: 'app-flight-search',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './flight-search.component.html',
  styleUrl: './flight-search.component.scss'
})
export class FlightSearchComponent {
  private readonly flightService = inject(FlightService);
  private readonly router = inject(Router);

  readonly availableCities = this.flightService.getAvailableCities();

  source = signal('');
  destination = signal('');
  sourceInput = signal('');
  destinationInput = signal('');

  get filteredSourceCities(): string[] {
    const input = this.sourceInput().toLowerCase();
    const dest = this.destination();
    return this.availableCities.filter(city =>
      city.toLowerCase().includes(input) && city !== dest
    );
  }

  get filteredDestinationCities(): string[] {
    const input = this.destinationInput().toLowerCase();
    const src = this.source();
    return this.availableCities.filter(city =>
      city.toLowerCase().includes(input) && city !== src
    );
  }

  swapCities(): void {
    const currentSource = this.source();
    const currentDestination = this.destination();
    this.source.set(currentDestination);
    this.destination.set(currentSource);
    this.sourceInput.set(currentDestination);
    this.destinationInput.set(currentSource);
  }

  onSourceSelected(city: string): void {
    this.source.set(city);
    this.sourceInput.set(city);
  }

  onDestinationSelected(city: string): void {
    this.destination.set(city);
    this.destinationInput.set(city);
  }
  departureDate = signal<Date | null>(null);
  isRoundTrip = signal(false);
  returnDate = signal<Date | null>(null);

  readonly minDate = new Date();

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  onSearch(): void {
    if (!this.source() || !this.destination() || !this.departureDate()) {
      return;
    }

    const criteria: SearchCriteria = {
      source: this.source(),
      destination: this.destination(),
      departureDate: this.formatDate(this.departureDate()!),
      isRoundTrip: this.isRoundTrip(),
      returnDate: this.isRoundTrip() && this.returnDate()
        ? this.formatDate(this.returnDate()!)
        : undefined
    };

    this.flightService.searchFlights(criteria);
    this.router.navigate(['/results']);
  }

  onRoundTripChange(checked: boolean): void {
    this.isRoundTrip.set(checked);
    if (!checked) {
      this.returnDate.set(null);
    }
  }
}
