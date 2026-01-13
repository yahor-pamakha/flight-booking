import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { BookingService } from '../../services/booking.service';

@Component({
  selector: 'app-booking-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatDividerModule
  ],
  templateUrl: './booking-form.component.html',
  styleUrl: './booking-form.component.scss'
})
export class BookingFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly bookingService = inject(BookingService);
  private readonly router = inject(Router);

  readonly flight = this.bookingService.flight;
  readonly returnFlight = this.bookingService.returnFlight;
  readonly isRoundTrip = this.bookingService.isRoundTrip;

  readonly bookingForm: FormGroup = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    contactNumber: ['', [Validators.required, Validators.pattern(/^\+?[\d\s-]{10,}$/)]],
    numberOfPassengers: [1, [Validators.required, Validators.min(1), Validators.max(9)]]
  });

  get totalPrice(): number {
    const flight = this.flight();
    const returnFlight = this.returnFlight();
    const passengers = this.bookingForm.get('numberOfPassengers')?.value || 1;
    const flightPrice = flight ? flight.price : 0;
    const returnPrice = returnFlight ? returnFlight.price : 0;
    return (flightPrice + returnPrice) * passengers;
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  }

  onSubmit(): void {
    if (this.bookingForm.valid) {
      this.bookingService.createBooking(this.bookingForm.value);
      this.router.navigate(['/confirmation']);
    } else {
      this.bookingForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.bookingService.clearSelectedFlight();
    this.router.navigate(['/results']);
  }

  formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  }
}
