import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FlightService } from '../../services/flight.service';
import { BookingService } from '../../services/booking.service';
import { FlightCardComponent } from '../../components/flight-card/flight-card.component';
import { FilterSidebarComponent } from '../../components/filter-sidebar/filter-sidebar.component';
import { Flight, FlightFilters, RoundTripFlight } from '../../models/flight.model';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, FlightCardComponent, FilterSidebarComponent],
  templateUrl: './search-results.component.html',
  styleUrl: './search-results.component.scss'
})
export class SearchResultsComponent {
  private readonly flightService = inject(FlightService);
  private readonly bookingService = inject(BookingService);
  private readonly router = inject(Router);

  readonly flights = this.flightService.filteredFlights;
  readonly searchedFlights = this.flightService.searchedFlights;
  readonly roundTripFlights = this.flightService.roundTripFlights;
  readonly hasSearchResults = this.flightService.hasSearchResults;
  readonly isRoundTrip = this.flightService.isRoundTrip;
  readonly airlines = this.flightService.availableAirlines;
  readonly currentFilters = this.flightService.currentFilters;
  readonly searchCriteria = this.flightService.currentSearchCriteria;

  onFiltersChange(filters: Partial<FlightFilters>): void {
    this.flightService.updateFilters(filters);
  }

  onBookFlight(flight: Flight): void {
    this.bookingService.selectFlight(flight);
    this.router.navigate(['/booking']);
  }

  onBookRoundTrip(roundTrip: RoundTripFlight): void {
    this.bookingService.selectFlight(roundTrip.outbound, roundTrip.return);
    this.router.navigate(['/booking']);
  }

  onBackToSearch(): void {
    this.router.navigate(['/search']);
  }
}
