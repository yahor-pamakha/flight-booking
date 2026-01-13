import { Injectable, signal, computed } from '@angular/core';
import { Flight } from '../models/flight.model';
import { Booking, BookingDetails } from '../models/booking.model';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private readonly selectedFlight = signal<Flight | null>(null);
  private readonly selectedReturnFlight = signal<Flight | null>(null);
  private readonly currentBooking = signal<Booking | null>(null);
  private readonly bookings = signal<Booking[]>([]);

  readonly flight = computed(() => this.selectedFlight());
  readonly returnFlight = computed(() => this.selectedReturnFlight());
  readonly isRoundTrip = computed(() => this.selectedReturnFlight() !== null);
  readonly booking = computed(() => this.currentBooking());
  readonly allBookings = computed(() => this.bookings());

  selectFlight(flight: Flight, returnFlight?: Flight): void {
    this.selectedFlight.set(flight);
    this.selectedReturnFlight.set(returnFlight ?? null);
  }

  clearSelectedFlight(): void {
    this.selectedFlight.set(null);
    this.selectedReturnFlight.set(null);
  }

  createBooking(details: BookingDetails): Booking {
    const flight = this.selectedFlight();
    const returnFlight = this.selectedReturnFlight();
    if (!flight) {
      throw new Error('No flight selected');
    }

    const flightPrice = returnFlight ? flight.price + returnFlight.price : flight.price;

    const booking: Booking = {
      referenceId: this.generateReferenceId(),
      flight,
      returnFlight: returnFlight ?? undefined,
      details,
      bookingDate: new Date(),
      totalPrice: flightPrice * details.numberOfPassengers
    };

    this.currentBooking.set(booking);
    this.bookings.update(bookings => [...bookings, booking]);
    this.selectedFlight.set(null);
    this.selectedReturnFlight.set(null);

    return booking;
  }

  getBookingByReference(referenceId: string): Booking | undefined {
    return this.bookings().find(b => b.referenceId === referenceId);
  }

  clearCurrentBooking(): void {
    this.currentBooking.set(null);
  }

  private generateReferenceId(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = 'FB-';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
}
