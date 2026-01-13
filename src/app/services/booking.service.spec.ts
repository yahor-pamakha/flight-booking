import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { BookingService } from './booking.service';
import { Flight } from '../models/flight.model';

describe('BookingService', () => {
  let service: BookingService;

  const mockFlight: Flight = {
    id: 'FL001',
    airline: 'Lufthansa',
    flightNumber: 'LH1234',
    source: 'Berlin',
    destination: 'Paris',
    date: '2026-01-18',
    departureTime: '08:00',
    arrivalTime: '10:30',
    duration: 150,
    price: 189,
    availableSeats: 45
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()]
    });
    service = TestBed.inject(BookingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('selectFlight', () => {
    it('should set the selected flight', () => {
      service.selectFlight(mockFlight);
      expect(service.flight()).toEqual(mockFlight);
    });
  });

  describe('clearSelectedFlight', () => {
    it('should clear the selected flight', () => {
      service.selectFlight(mockFlight);
      service.clearSelectedFlight();
      expect(service.flight()).toBeNull();
    });
  });

  describe('createBooking', () => {
    beforeEach(() => {
      service.selectFlight(mockFlight);
    });

    it('should create a booking with correct details', () => {
      const bookingDetails = {
        fullName: 'John Doe',
        email: 'john@example.com',
        contactNumber: '+1234567890',
        numberOfPassengers: 2
      };

      const booking = service.createBooking(bookingDetails);

      expect(booking.flight).toEqual(mockFlight);
      expect(booking.details).toEqual(bookingDetails);
      expect(booking.totalPrice).toBe(mockFlight.price * 2);
      expect(booking.referenceId).toMatch(/^FB-[A-Z0-9]{8}$/);
    });

    it('should set current booking after creation', () => {
      const bookingDetails = {
        fullName: 'Jane Doe',
        email: 'jane@example.com',
        contactNumber: '+0987654321',
        numberOfPassengers: 1
      };

      service.createBooking(bookingDetails);
      const currentBooking = service.booking();

      expect(currentBooking).toBeTruthy();
      expect(currentBooking?.details.fullName).toBe('Jane Doe');
    });

    it('should add booking to all bookings', () => {
      const bookingDetails = {
        fullName: 'Test User',
        email: 'test@example.com',
        contactNumber: '+1111111111',
        numberOfPassengers: 3
      };

      service.createBooking(bookingDetails);
      const allBookings = service.allBookings();

      expect(allBookings.length).toBe(1);
      expect(allBookings[0].details.fullName).toBe('Test User');
    });

    it('should clear selected flight after booking', () => {
      const bookingDetails = {
        fullName: 'Test User',
        email: 'test@example.com',
        contactNumber: '+1111111111',
        numberOfPassengers: 1
      };

      service.createBooking(bookingDetails);
      expect(service.flight()).toBeNull();
    });

    it('should throw error if no flight selected', () => {
      service.clearSelectedFlight();

      expect(() => {
        service.createBooking({
          fullName: 'Test',
          email: 'test@test.com',
          contactNumber: '+123',
          numberOfPassengers: 1
        });
      }).toThrowError('No flight selected');
    });
  });

  describe('getBookingByReference', () => {
    it('should return booking by reference id', () => {
      service.selectFlight(mockFlight);
      const booking = service.createBooking({
        fullName: 'Test User',
        email: 'test@example.com',
        contactNumber: '+1111111111',
        numberOfPassengers: 1
      });

      const foundBooking = service.getBookingByReference(booking.referenceId);
      expect(foundBooking).toEqual(booking);
    });

    it('should return undefined for non-existent reference', () => {
      const foundBooking = service.getBookingByReference('INVALID-REF');
      expect(foundBooking).toBeUndefined();
    });
  });

  describe('clearCurrentBooking', () => {
    it('should clear current booking', () => {
      service.selectFlight(mockFlight);
      service.createBooking({
        fullName: 'Test User',
        email: 'test@example.com',
        contactNumber: '+1111111111',
        numberOfPassengers: 1
      });

      service.clearCurrentBooking();
      expect(service.booking()).toBeNull();
    });
  });
});
