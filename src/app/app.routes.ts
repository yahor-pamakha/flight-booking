import { Routes } from '@angular/router';
import { bookingGuard, confirmationGuard } from './guards/booking.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'search',
    pathMatch: 'full'
  },
  {
    path: 'search',
    loadComponent: () => import('./pages/flight-search/flight-search.component')
      .then(m => m.FlightSearchComponent)
  },
  {
    path: 'results',
    loadComponent: () => import('./pages/search-results/search-results.component')
      .then(m => m.SearchResultsComponent)
  },
  {
    path: 'booking',
    loadComponent: () => import('./pages/booking-form/booking-form.component')
      .then(m => m.BookingFormComponent),
    canActivate: [bookingGuard]
  },
  {
    path: 'confirmation',
    loadComponent: () => import('./pages/confirmation/confirmation.component')
      .then(m => m.ConfirmationComponent),
    canActivate: [confirmationGuard]
  },
  {
    path: '**',
    redirectTo: 'search'
  }
];
