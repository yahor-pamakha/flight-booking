import { Component, input, output, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { FlightFilters, TimeSlot, TIME_SLOTS } from '../../models/flight.model';

@Component({
  selector: 'app-filter-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatRadioModule,
    MatCheckboxModule,
    MatDividerModule
  ],
  templateUrl: './filter-sidebar.component.html',
  styleUrl: './filter-sidebar.component.scss'
})
export class FilterSidebarComponent {
  readonly airlines = input.required<string[]>();
  readonly currentFilters = input.required<FlightFilters>();
  readonly filtersChange = output<Partial<FlightFilters>>();

  readonly timeSlots = TIME_SLOTS;

  readonly selectedAirlines = signal<string[]>([]);
  readonly selectedTimeSlots = signal<TimeSlot[]>([]);
  readonly sortBy = signal<'price' | 'duration'>('price');

  constructor() {
    effect(() => {
      const filters = this.currentFilters();
      this.selectedAirlines.set([...filters.airlines]);
      this.selectedTimeSlots.set([...filters.departureTimeSlots]);
      this.sortBy.set(filters.sortBy);
    });
  }

  onAirlineChange(airline: string, checked: boolean): void {
    const current = this.selectedAirlines();
    if (checked) {
      this.selectedAirlines.set([...current, airline]);
    } else {
      this.selectedAirlines.set(current.filter(a => a !== airline));
    }
    this.emitFilters();
  }

  onTimeSlotChange(slot: TimeSlot, checked: boolean): void {
    const current = this.selectedTimeSlots();
    if (checked) {
      this.selectedTimeSlots.set([...current, slot]);
    } else {
      this.selectedTimeSlots.set(current.filter(s => s !== slot));
    }
    this.emitFilters();
  }

  onSortChange(sortBy: 'price' | 'duration'): void {
    this.sortBy.set(sortBy);
    this.emitFilters();
  }

  isAirlineSelected(airline: string): boolean {
    return this.selectedAirlines().includes(airline);
  }

  isTimeSlotSelected(slot: TimeSlot): boolean {
    return this.selectedTimeSlots().includes(slot);
  }

  private emitFilters(): void {
    this.filtersChange.emit({
      airlines: this.selectedAirlines(),
      departureTimeSlots: this.selectedTimeSlots(),
      sortBy: this.sortBy()
    });
  }
}
