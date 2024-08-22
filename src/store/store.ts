import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { IBooking, IBookingMap, IBookingService, IStaff } from "../lib/type";
import { generateInitData } from "../utils";

interface CalendarState {
  staff: IStaff[];
  bookingMap: IBookingMap;
  bookingServiceMap: Map<string, IBookingService>;
  staffBookingServicesMap: Map<string, IBookingService[]>;
  createBooking: (booking: IBooking) => void;
  deleteBooking: (booking: IBooking) => void;
  updateBooking: (booking: IBooking) => void;
  init: (bookings: IBooking[], staff: IStaff[]) => void;
}

export const bookingServicesByStaffIdSelector =
  (staffId: string) => (state: CalendarState) => {
    return state.staffBookingServicesMap.get(staffId);
  };

export const bookingByIdSelector =
  (bookingId: string) => (state: CalendarState) => {
    return state.bookingMap.get(bookingId);
  };

export const bookingServiceByIdSelector =
  (bookingServiceId: string) => (state: CalendarState) => {
    return state.bookingServiceMap.get(bookingServiceId);
  };

export const useCalendarStore = create<CalendarState>()(
  devtools((set) => ({
    staff: [],
    bookingMap: new Map(),
    bookingServiceMap: new Map(),
    staffBookingServicesMap: new Map(),
    init(bookings, staff) {
      const { bookingMap, bookingServiceMap, staffBookingServicesMap } =
        generateInitData(bookings);

      set(() => ({
        bookingMap,
        bookingServiceMap,
        staffBookingServicesMap,
        staff,
      }));
    },
    createBooking: (booking) => {
      set((state) => {
        const newBookingMap = new Map(state.bookingMap);
        newBookingMap.set(booking.id, booking);
        state.bookingMap = newBookingMap;

        const newBookingServiceMap = new Map(state.bookingServiceMap);
        const newStaffBookingServicesMap = new Map(
          state.staffBookingServicesMap
        );
        for (const bookingService of booking.bookingServices) {
          newBookingServiceMap.set(bookingService.id, bookingService);

          const oldBookingServices =
            newStaffBookingServicesMap.get(bookingService.staffId) || [];
          newStaffBookingServicesMap.set(bookingService.staffId, [
            ...oldBookingServices,
            bookingService,
          ]);
        }
        state.bookingServiceMap = newBookingServiceMap;
        state.staffBookingServicesMap = newStaffBookingServicesMap;

        return state;
      });
    },
    deleteBooking: (booking) => {
      set((state) => {
        const newBookingMap = new Map(state.bookingMap);
        newBookingMap.delete(booking.id);
        state.bookingMap = newBookingMap;

        const newBookingServiceMap = new Map(state.bookingServiceMap);
        const newStaffBookingServicesMap = new Map(
          state.staffBookingServicesMap
        );

        for (const bookingService of booking.bookingServices) {
          newBookingServiceMap.delete(bookingService.id);

          const oldBookingServices =
            newStaffBookingServicesMap.get(bookingService.staffId) || [];
          const newBookingServices = oldBookingServices.filter(
            (oldBookingService) => oldBookingService.id !== bookingService.id
          );
          newStaffBookingServicesMap.set(
            bookingService.staffId,
            newBookingServices
          );
        }
        state.bookingServiceMap = newBookingServiceMap;
        state.staffBookingServicesMap = newStaffBookingServicesMap;

        return state;
      });
    },
    updateBooking(booking) {
      set((state) => {
        const newBookingMap = new Map(state.bookingMap);
        const oldBooking = newBookingMap.get(booking.id);

        const newBookingServiceMap = new Map(state.bookingServiceMap);
        const newStaffBookingServicesMap = new Map(
          state.staffBookingServicesMap
        );

        newBookingMap.set(booking.id, booking);
        state.bookingMap = newBookingMap;

        for (const oldBookingService of oldBooking?.bookingServices || []) {
          newBookingServiceMap.delete(oldBookingService.id);

          const oldBookingServices =
            newStaffBookingServicesMap.get(oldBookingService.staffId) || [];

          const newBokingServices =
            oldBookingServices.filter(
              (oldBookingService) =>
                oldBookingService.id !== oldBookingService.id
            ) || [];

          newStaffBookingServicesMap.set(
            oldBookingService.staffId,
            newBokingServices
          );
        }

        for (const bookingService of booking.bookingServices) {
          newBookingServiceMap.set(bookingService.id, bookingService);

          const oldBookingServices =
            newStaffBookingServicesMap.get(bookingService.staffId) || [];

          newStaffBookingServicesMap.set(bookingService.staffId, [
            ...oldBookingServices,
            bookingService,
          ]);
        }
        return state;
      });
    },
  }))
);
