import { Injectable, signal, computed } from '@angular/core';
import { Flight, SearchCriteria, FlightFilters, TimeSlot, RoundTripFlight } from '../models/flight.model';

const HARDCODED_TEST_FLIGHTS: Flight[] = [
  {
    id: 'TEST001',
    airline: 'Lufthansa',
    flightNumber: 'LH1001',
    source: 'Berlin',
    destination: 'Paris',
    date: '2026-01-18',
    departureTime: '08:00',
    arrivalTime: '10:30',
    duration: 150,
    price: 149,
    availableSeats: 45
  },
  {
    id: 'TEST002',
    airline: 'Air France',
    flightNumber: 'AF2002',
    source: 'Berlin',
    destination: 'Paris',
    date: '2026-01-18',
    departureTime: '14:00',
    arrivalTime: '16:30',
    duration: 150,
    price: 189,
    availableSeats: 32
  },
  {
    id: 'TEST003',
    airline: 'Ryanair',
    flightNumber: 'FR3003',
    source: 'Berlin',
    destination: 'Paris',
    date: '2026-01-18',
    departureTime: '19:00',
    arrivalTime: '21:30',
    duration: 150,
    price: 79,
    availableSeats: 12
  },
  {
    id: 'TEST004',
    airline: 'Air France',
    flightNumber: 'AF4004',
    source: 'Paris',
    destination: 'Berlin',
    date: '2026-01-20',
    departureTime: '09:00',
    arrivalTime: '11:30',
    duration: 150,
    price: 159,
    availableSeats: 28
  },
  {
    id: 'TEST005',
    airline: 'Lufthansa',
    flightNumber: 'LH5005',
    source: 'Paris',
    destination: 'Berlin',
    date: '2026-01-20',
    departureTime: '15:00',
    arrivalTime: '17:30',
    duration: 150,
    price: 199,
    availableSeats: 55
  },
  {
    id: 'TEST006',
    airline: 'EasyJet',
    flightNumber: 'EJ6006',
    source: 'Paris',
    destination: 'Berlin',
    date: '2026-01-20',
    departureTime: '20:00',
    arrivalTime: '22:30',
    duration: 150,
    price: 89,
    availableSeats: 8
  },
  {
    id: 'TEST007',
    airline: 'British Airways',
    flightNumber: 'BA7007',
    source: 'London',
    destination: 'Amsterdam',
    date: '2026-01-18',
    departureTime: '10:00',
    arrivalTime: '12:15',
    duration: 135,
    price: 129,
    availableSeats: 40
  },
  {
    id: 'TEST008',
    airline: 'KLM',
    flightNumber: 'KL8008',
    source: 'Amsterdam',
    destination: 'London',
    date: '2026-01-18',
    departureTime: '16:00',
    arrivalTime: '16:15',
    duration: 135,
    price: 139,
    availableSeats: 35
  }
];

function generateFlightsData(): Flight[] {
  const routes = [
    { source: 'Berlin', destination: 'Paris', duration: 150 },
    { source: 'Paris', destination: 'Berlin', duration: 150 },
    { source: 'London', destination: 'Amsterdam', duration: 135 },
    { source: 'Amsterdam', destination: 'London', duration: 135 },
    { source: 'Madrid', destination: 'Rome', duration: 150 },
    { source: 'Rome', destination: 'Madrid', duration: 150 },
    { source: 'Frankfurt', destination: 'Vienna', duration: 90 },
    { source: 'Vienna', destination: 'Frankfurt', duration: 90 },
    { source: 'Berlin', destination: 'London', duration: 120 },
    { source: 'London', destination: 'Berlin', duration: 120 },
    { source: 'Paris', destination: 'Rome', duration: 135 },
    { source: 'Rome', destination: 'Paris', duration: 135 },
    { source: 'Amsterdam', destination: 'Frankfurt', duration: 75 },
    { source: 'Frankfurt', destination: 'Amsterdam', duration: 75 },
    { source: 'Madrid', destination: 'Paris', duration: 120 },
    { source: 'Paris', destination: 'Madrid', duration: 120 },
    { source: 'Vienna', destination: 'Rome', duration: 105 },
    { source: 'Rome', destination: 'Vienna', duration: 105 },
  ];

  const airlines = [
    { name: 'Lufthansa', code: 'LH', priceMultiplier: 1.2 },
    { name: 'Air France', code: 'AF', priceMultiplier: 1.15 },
    { name: 'Ryanair', code: 'FR', priceMultiplier: 0.7 },
    { name: 'EasyJet', code: 'EJ', priceMultiplier: 0.75 },
    { name: 'British Airways', code: 'BA', priceMultiplier: 1.3 },
    { name: 'KLM', code: 'KL', priceMultiplier: 1.1 },
    { name: 'Iberia', code: 'IB', priceMultiplier: 1.0 },
    { name: 'Austrian Airlines', code: 'OS', priceMultiplier: 1.05 },
  ];

  const departureTimes = ['06:00', '08:30', '10:00', '12:30', '14:00', '16:30', '18:00', '20:30'];

  const flights: Flight[] = [];
  let flightId = 1;

  const today = new Date();

  for (let dayOffset = 0; dayOffset < 5; dayOffset++) {
    const date = new Date(today);
    date.setDate(today.getDate() + dayOffset);
    const dateStr = date.toISOString().split('T')[0];

    for (const route of routes) {
      const numFlights = 3 + Math.floor(Math.random() * 3);
      const selectedTimes = [...departureTimes].sort(() => Math.random() - 0.5).slice(0, numFlights);

      for (const depTime of selectedTimes) {
        const airline = airlines[Math.floor(Math.random() * airlines.length)];
        const basePrice = 80 + route.duration * 0.5;
        const price = Math.round(basePrice * airline.priceMultiplier + Math.random() * 40);

        const [depHour, depMin] = depTime.split(':').map(Number);
        const arrMinutes = depHour * 60 + depMin + route.duration;
        const arrHour = Math.floor(arrMinutes / 60) % 24;
        const arrMin = arrMinutes % 60;
        const arrivalTime = `${arrHour.toString().padStart(2, '0')}:${arrMin.toString().padStart(2, '0')}`;

        flights.push({
          id: `FL${flightId.toString().padStart(4, '0')}`,
          airline: airline.name,
          flightNumber: `${airline.code}${1000 + Math.floor(Math.random() * 9000)}`,
          source: route.source,
          destination: route.destination,
          date: dateStr,
          departureTime: depTime,
          arrivalTime: arrivalTime,
          duration: route.duration,
          price: price,
          availableSeats: 5 + Math.floor(Math.random() * 100)
        });
        flightId++;
      }
    }
  }

  return flights;
}

const FLIGHTS_DATA: Flight[] = [...HARDCODED_TEST_FLIGHTS, ...generateFlightsData()];

@Injectable({
  providedIn: 'root'
})
export class FlightService {
  private readonly allFlights: Flight[] = FLIGHTS_DATA;

  private readonly searchCriteria = signal<SearchCriteria | null>(null);
  private readonly filters = signal<FlightFilters>({
    airlines: [],
    departureTimeSlots: [],
    sortBy: 'price'
  });

  readonly isRoundTrip = computed(() => this.searchCriteria()?.isRoundTrip ?? false);

  readonly hasSearchResults = computed(() => {
    if (this.isRoundTrip()) {
      return this.searchedFlights().length > 0 && this.returnFlights().length > 0;
    }
    return this.searchedFlights().length > 0;
  });

  readonly searchedFlights = computed(() => {
    const criteria = this.searchCriteria();
    if (!criteria) return [];

    return this.allFlights.filter(flight =>
      flight.source.toLowerCase() === criteria.source.toLowerCase() &&
      flight.destination.toLowerCase() === criteria.destination.toLowerCase() &&
      flight.date === criteria.departureDate
    );
  });

  readonly returnFlights = computed(() => {
    const criteria = this.searchCriteria();
    if (!criteria || !criteria.isRoundTrip || !criteria.returnDate) return [];

    return this.allFlights.filter(flight =>
      flight.source.toLowerCase() === criteria.destination.toLowerCase() &&
      flight.destination.toLowerCase() === criteria.source.toLowerCase() &&
      flight.date === criteria.returnDate
    );
  });

  readonly filteredFlights = computed(() => {
    let flights = this.searchedFlights();
    const currentFilters = this.filters();

    if (currentFilters.airlines.length > 0) {
      flights = flights.filter(f => currentFilters.airlines.includes(f.airline));
    }

    if (currentFilters.departureTimeSlots.length > 0) {
      flights = flights.filter(f => {
        const hour = parseInt(f.departureTime.split(':')[0], 10);
        return currentFilters.departureTimeSlots.some(slot => this.isInTimeSlot(hour, slot));
      });
    }

    flights = [...flights].sort((a, b) => {
      if (currentFilters.sortBy === 'price') {
        return a.price - b.price;
      }
      return a.duration - b.duration;
    });

    return flights;
  });

  readonly filteredReturnFlights = computed(() => {
    let flights = this.returnFlights();
    const currentFilters = this.filters();

    if (currentFilters.airlines.length > 0) {
      flights = flights.filter(f => currentFilters.airlines.includes(f.airline));
    }

    flights = [...flights].sort((a, b) => {
      if (currentFilters.sortBy === 'price') {
        return a.price - b.price;
      }
      return a.duration - b.duration;
    });

    return flights;
  });

  readonly roundTripFlights = computed((): RoundTripFlight[] => {
    const criteria = this.searchCriteria();
    if (!criteria || !criteria.isRoundTrip) return [];

    const outboundFlights = this.filteredFlights();
    const returnFlights = this.filteredReturnFlights();

    const combinations: RoundTripFlight[] = [];

    for (const outbound of outboundFlights) {
      for (const returnFlight of returnFlights) {
        combinations.push({
          outbound,
          return: returnFlight,
          totalPrice: outbound.price + returnFlight.price
        });
      }
    }

    return combinations.sort((a, b) => a.totalPrice - b.totalPrice);
  });

  readonly availableAirlines = computed(() => {
    const outbound = this.searchedFlights();
    const returnF = this.returnFlights();
    const allFlights = [...outbound, ...returnF];
    return [...new Set(allFlights.map(f => f.airline))].sort();
  });

  readonly currentFilters = computed(() => this.filters());
  readonly currentSearchCriteria = computed(() => this.searchCriteria());

  private isInTimeSlot(hour: number, slot: TimeSlot): boolean {
    switch (slot) {
      case 'morning': return hour >= 6 && hour < 12;
      case 'afternoon': return hour >= 12 && hour < 18;
      case 'evening': return hour >= 18 && hour < 24;
      default: return false;
    }
  }

  searchFlights(criteria: SearchCriteria): void {
    this.searchCriteria.set(criteria);
    this.resetFilters();
  }

  updateFilters(filters: Partial<FlightFilters>): void {
    this.filters.update(current => ({ ...current, ...filters }));
  }

  resetFilters(): void {
    this.filters.set({
      airlines: [],
      departureTimeSlots: [],
      sortBy: 'price'
    });
  }

  getFlightById(id: string): Flight | undefined {
    return this.allFlights.find(f => f.id === id);
  }

  getAvailableCities(): string[] {
    const sources = this.allFlights.map(f => f.source);
    const destinations = this.allFlights.map(f => f.destination);
    return [...new Set([...sources, ...destinations])].sort();
  }
}
