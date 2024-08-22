import { memo } from "react";
import { IStaff } from "../lib/type";
import {
  bookingServicesByStaffIdSelector,
  useCalendarStore,
} from "../store/store";
import { BookingService } from "./BookingService";

type DrawBookingServicesProps = {
  staffDetail: IStaff;
  slotInterval: number;
  rowHeight: number;
};

const MemoziedDrawBookingServices = ({
  staffDetail,
  ...rest
}: DrawBookingServicesProps) => {
  const bookingServices = useCalendarStore(
    bookingServicesByStaffIdSelector(staffDetail.id)
  );

  return bookingServices?.map((bookingService) => (
    <BookingService
      key={bookingService.id}
      bookingServiceId={bookingService.id}
      {...rest}
    />
  ));
};

export const DrawBookingServices = memo(MemoziedDrawBookingServices);
