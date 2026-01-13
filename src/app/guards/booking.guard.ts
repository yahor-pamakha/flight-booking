import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { BookingService } from '../services/booking.service';

export const bookingGuard: CanActivateFn = () => {
  const bookingService = inject(BookingService);
  const router = inject(Router);

  if (bookingService.flight()) {
    return true;
  }

  router.navigate(['/search']);
  return false;
};

export const confirmationGuard: CanActivateFn = () => {
  const bookingService = inject(BookingService);
  const router = inject(Router);

  if (bookingService.booking()) {
    return true;
  }

  router.navigate(['/search']);
  return false;
};
