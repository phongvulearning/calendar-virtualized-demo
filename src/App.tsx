import { CalendarWrapper } from "./calendar/CalendarWrapper";
import { IBooking } from "./lib/type";
import { generateFakeBooking, generateStaff } from "./utils";

function App() {
  const staff = generateStaff(100);
  const bookings: IBooking[] = generateFakeBooking(staff);

  return <CalendarWrapper bookings={bookings} staff={staff} />;
}

export default App;
