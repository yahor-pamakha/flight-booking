import { Flight } from './flight.model';

export interface BookingDetails {
  fullName: string;
  email: string;
  contactNumber: string;
  numberOfPassengers: number;
}

export interface Booking {
  referenceId: string;
  flight: Flight;
  returnFlight?: Flight;
  details: BookingDetails;
  bookingDate: Date;
  totalPrice: number;
}
