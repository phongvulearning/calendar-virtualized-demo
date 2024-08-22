import { memo, useEffect } from "react";
import { IBooking, IStaff } from "../lib/type";
import { useCalendarStore } from "../store/store";
import { Calendar } from "./Calendar";

type CalendarWrapperProps = {
  bookings: IBooking[];
  staff: IStaff[];
};

const MemoziedCalendarWrapper = ({ bookings, staff }: CalendarWrapperProps) => {
  const init = useCalendarStore((s) => s.init);

  useEffect(() => {
    init(bookings, staff);
  }, [bookings, init, staff]);

  return (
    <div className="w-screen h-screen bg-gray-100  max-h-[-webkit-fill-available] overflow-hidden">
      <Calendar
        slotInterval={5}
        rowHeight={50}
        headerHeight={84}
        staff={staff}
        columnCount={staff.length}
      />
    </div>
  );
};

export const CalendarWrapper = memo(MemoziedCalendarWrapper);
