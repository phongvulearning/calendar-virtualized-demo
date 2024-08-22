import {
  IBooking,
  IBookingMap,
  IBookingService,
  IBookingServiceMap,
  IStaff,
  IStaffBookingServiceMap,
} from "../lib/type";

export function convertMinutuesToHourMinutes(minutes: number, time12 = false) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (time12) {
    const ampm = hours >= 12 ? "PM" : "AM";
    const hours12 = hours % 12;
    return `${hours === 0 ? 12 : hours12}:${
      minutes < 10 ? "0" + mins : mins
    } ${ampm}`;
  } else {
    return `${hours < 10 ? "0" + hours : hours}:${
      mins < 10 ? "0" + mins : mins
    }`;
  }
}

export function generateSlot(start: number, end: number, slotInterval: number) {
  const slots = [];

  for (let i = start; i < end; i += slotInterval) {
    slots.push(i);
  }
  return slots;
}

export function generateStaff(count: number): IStaff[] {
  const staffs: IStaff[] = [];

  for (let i = 0; i < count; i++) {
    staffs.push({
      id: i.toString(),
      name: `Staff ${i}`,
    });
  }

  return staffs;
}

export function generateBookingServices(
  staffId: string,
  start: number,
  end: number
): IBookingService[] {
  const bookingServices: IBookingService[] = [];

  for (let i = start; i < end; i += 60) {
    bookingServices.push({
      id: `${i}-${staffId}`,
      date: new Date(i),
      start: i,
      duration: 30,
      title: `IBooking ${i}`,
      staffId,
      bookingId: `${i}-${staffId}`,
    });
  }

  return bookingServices;
}

export function generateBookingServicesByStaff(
  staff: IStaff[]
): IStaffBookingServiceMap {
  const bookingServicesByStaff: IStaffBookingServiceMap = new Map();

  staff.forEach((staff) => {
    bookingServicesByStaff.set(
      staff.id,
      generateBookingServices(staff.id, 360, 1280)
    );
  });

  return bookingServicesByStaff;
}

export function generateFakeBooking(staff: IStaff[]): IBooking[] {
  const bookings: IBooking[] = [];
  for (let i = 0; i < staff.length; i++) {
    const bookingServices = generateBookingServices(staff[i].id, 360, 1280);
    bookings.push({
      id: `${staff[i].id}-${i}-booking`,
      title: `IBooking ${i}`,
      status: "confirmed",
      startDate: new Date(),
      bookingServices,
    });
  }

  return bookings;
}

type GenerateInitDataRes = {
  bookingMap: IBookingMap;
  staffBookingServicesMap: IStaffBookingServiceMap;
  bookingServiceMap: IBookingServiceMap;
};

export function generateInitData(bookings: IBooking[]): GenerateInitDataRes {
  const result: GenerateInitDataRes = {
    bookingMap: new Map(),
    staffBookingServicesMap: new Map(),
    bookingServiceMap: new Map(),
  };

  bookings.forEach((booking) => {
    result.bookingMap.set(booking.id, booking);

    for (const bookingService of booking.bookingServices) {
      result.bookingServiceMap.set(bookingService.id, bookingService);
      const bookingServices = result.staffBookingServicesMap.get(
        bookingService.staffId
      );

      result.staffBookingServicesMap.set(bookingService.staffId, [
        ...(bookingServices || []),
        bookingService,
      ]);
    }
  });

  return result;
}
