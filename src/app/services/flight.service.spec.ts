import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { FlightService } from './flight.service';

describe('FlightService', () => {
  let service: FlightService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()]
    });
    service = TestBed.inject(FlightService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAvailableCities', () => {
    it('should return a list of unique cities', () => {
      const cities = service.getAvailableCities();
      expect(cities.length).toBeGreaterThan(0);
      expect(new Set(cities).size).toBe(cities.length);
    });

    it('should return sorted cities', () => {
      const cities = service.getAvailableCities();
      const sortedCities = [...cities].sort();
      expect(cities).toEqual(sortedCities);
    });
  });

  describe('searchFlights', () => {
    it('should filter flights by source and destination', () => {
      service.searchFlights({
        source: 'Berlin',
        destination: 'Paris',
        departureDate: '2026-01-15',
        isRoundTrip: false
      });

      const flights = service.searchedFlights();
      expect(flights.length).toBeGreaterThan(0);
      flights.forEach(flight => {
        expect(flight.source.toLowerCase()).toBe('berlin');
        expect(flight.destination.toLowerCase()).toBe('paris');
      });
    });

    it('should return empty array for non-existent route', () => {
      service.searchFlights({
        source: 'NonExistent',
        destination: 'City',
        departureDate: '2026-01-15',
        isRoundTrip: false
      });

      const flights = service.searchedFlights();
      expect(flights.length).toBe(0);
    });
  });

  describe('updateFilters', () => {
    beforeEach(() => {
      service.searchFlights({
        source: 'Berlin',
        destination: 'Paris',
        departureDate: '2026-01-15',
        isRoundTrip: false
      });
    });

    it('should filter by airline', () => {
      const allFlights = service.searchedFlights();
      const airline = allFlights[0]?.airline;

      if (airline) {
        service.updateFilters({ airlines: [airline] });
        const filteredFlights = service.filteredFlights();

        filteredFlights.forEach(flight => {
          expect(flight.airline).toBe(airline);
        });
      }
    });

    it('should sort by price', () => {
      service.updateFilters({ sortBy: 'price' });
      const flights = service.filteredFlights();

      for (let i = 1; i < flights.length; i++) {
        expect(flights[i].price).toBeGreaterThanOrEqual(flights[i - 1].price);
      }
    });

    it('should sort by duration', () => {
      service.updateFilters({ sortBy: 'duration' });
      const flights = service.filteredFlights();

      for (let i = 1; i < flights.length; i++) {
        expect(flights[i].duration).toBeGreaterThanOrEqual(flights[i - 1].duration);
      }
    });
  });

  describe('getFlightById', () => {
    it('should return flight by id', () => {
      const flight = service.getFlightById('TEST001');
      expect(flight).toBeTruthy();
      expect(flight?.id).toBe('TEST001');
    });

    it('should return undefined for non-existent id', () => {
      const flight = service.getFlightById('INVALID');
      expect(flight).toBeUndefined();
    });
  });

  describe('resetFilters', () => {
    it('should reset all filters to default', () => {
      service.updateFilters({
        airlines: ['Lufthansa'],
        departureTimeSlots: ['morning'],
        sortBy: 'duration'
      });

      service.resetFilters();
      const filters = service.currentFilters();

      expect(filters.airlines).toEqual([]);
      expect(filters.departureTimeSlots).toEqual([]);
      expect(filters.sortBy).toBe('price');
    });
  });
});
