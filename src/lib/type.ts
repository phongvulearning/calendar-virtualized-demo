export type IStaffId = string;

export type IStaff = {
  id: IStaffId;
  name: string;
};

export type IBookingId = string;
export type IBooking = {
  id: IBookingId;
  title: string;
  startDate: Date;
  status: string;
  bookingServices: IBookingService[];
};

export type IBookingMap = Map<IBookingId, IBooking>;

export type IBookingServiceId = string;

export type IBookingService = {
  id: IBookingServiceId;
  date: Date;
  start: number;
  duration: number;
  title: string;
  bookingId: IBookingId;
  staffId: IStaffId;
};

export type IBookingServiceMap = Map<IBookingServiceId, IBookingService>;

export type IStaffBookingServiceMap = Map<IStaffId, IBookingService[]>;
