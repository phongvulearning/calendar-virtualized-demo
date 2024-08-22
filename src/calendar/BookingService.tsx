import { memo } from "react";
import { bookingServiceByIdSelector, useCalendarStore } from "../store/store";

type BookingServiceProps = {
  bookingServiceId: string;
  slotInterval: number;
  rowHeight: number;
};

const MemoziedBookingService = ({
  bookingServiceId,
  slotInterval,
  rowHeight,
}: BookingServiceProps) => {
  const bookingService = useCalendarStore(
    bookingServiceByIdSelector(bookingServiceId)
  );

  if (!bookingService) return null;

  const top = getTop(slotInterval, rowHeight, bookingService.start);
  const height = getHeight(slotInterval, rowHeight, bookingService.duration);
  return (
    <div
      style={{ top, height }}
      className="absolute w-full bg-green-200 border rounded"
    >
      {bookingService.title}
    </div>
  );
};

export const BookingService = memo(MemoziedBookingService);

function getTop(
  slotInterval: number,
  rowHeight: number,
  start: number,
  offset = 360
) {
  const actualStart = start - offset;
  const onePerPx = rowHeight / slotInterval;

  return onePerPx * actualStart;
}

function getHeight(slotInterval: number, rowHeight: number, duration: number) {
  const onePerPx = rowHeight / slotInterval;

  return onePerPx * duration;
}
