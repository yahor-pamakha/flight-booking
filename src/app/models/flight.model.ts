export interface Flight {
  id: string;
  airline: string;
  flightNumber: string;
  source: string;
  destination: string;
  date: string;
  departureTime: string;
  arrivalTime: string;
  duration: number;
  price: number;
  availableSeats: number;
}

export interface RoundTripFlight {
  outbound: Flight;
  return: Flight;
  totalPrice: number;
}

export interface SearchCriteria {
  source: string;
  destination: string;
  departureDate: string;
  isRoundTrip: boolean;
  returnDate?: string;
}

export interface FlightFilters {
  airlines: string[];
  departureTimeSlots: TimeSlot[];
  sortBy: 'price' | 'duration';
}

export type TimeSlot = 'morning' | 'afternoon' | 'evening';

export const TIME_SLOTS: { value: TimeSlot; label: string; range: string }[] = [
  { value: 'morning', label: 'Morning', range: '06:00 - 12:00' },
  { value: 'afternoon', label: 'Afternoon', range: '12:00 - 18:00' },
  { value: 'evening', label: 'Evening', range: '18:00 - 24:00' }
];
