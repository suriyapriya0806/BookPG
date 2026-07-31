import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { CheckCircle2, Clock, XCircle } from "lucide-react";
import Badge from "../../components/ui/Badge";
import Card from "../../components/ui/Card";
import { loadBookings } from "../../data/adminBookings";
import { formatCurrency } from "../../data/bookingFlow";
import { useAuth } from "../../context/AuthContext";

const statusContent = {
  BLOCKED: {
    icon: Clock,
    iconBg: "bg-blue-50 text-blue-700",
    title: "Bed Blocked Successfully",
    subtitle: "Your bed is blocked successfully. After confirmation, your payment will be handled by the Admin for verification."
  },
  CONFIRMED: {
    icon: CheckCircle2,
    iconBg: "bg-emerald-50 text-emerald-700",
    title: "Booking Confirmed",
    subtitle: "Your booking has been confirmed. Get ready for your stay!"
  },
  REJECTED: {
    icon: XCircle,
    iconBg: "bg-red-50 text-red-700",
    title: "Booking Rejected",
    subtitle: "Your booking could not be confirmed at this time."
  }
};

const getBookingDetails = (booking) => {
  if (!booking) return [];
  return [
    ["Branch", booking.branch?.name || booking.branchName || booking.branch || ""],
    ["Room", booking.room?.name ? `Room ${booking.room.name}` : booking.roomNumber ? `Room ${booking.roomNumber}` : ""],
    ["Bed", booking.bed?.label || booking.bedName || booking.selectedBed || ""],
    ["Monthly Rent", booking.monthlyRent ? formatCurrency(booking.monthlyRent) : ""],
    ["Move-in Date", booking.moveInDate ? new Date(booking.moveInDate).toLocaleDateString("en-IN") : ""],
    ["Current Status", booking.bookingStatus || booking.status || "Blocked"]
  ].filter(([, value]) => value);
};

const NextSteps = () => (
  <Card className="mt-6 hover:translate-y-0">
    <h2 className="text-xl font-semibold text-ink">Next Steps</h2>
    <ul className="mt-5 grid gap-4 text-sm leading-6 text-secondary">
      {[
        "Our staff will contact you shortly.",
        "Please visit the PG on the scheduled date.",
        "Payment will be collected during your visit.",
        "After verification, your booking will be confirmed by the Admin."
      ].map((step) => (
        <li key={step} className="flex gap-3">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
          <span>{step}</span>
        </li>
      ))}
    </ul>
  </Card>
);

const BookingStatus = () => {
  const { state } = useLocation();
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const confirmedBooking = state?.booking;

  useEffect(() => {
    const guestBookings = loadBookings().filter((booking) => !user?.email || booking.email === user.email);
    setBookings(guestBookings);
  }, [user?.email]);

  if (confirmedBooking) {
    const status = confirmedBooking.bookingStatus?.toUpperCase() || confirmedBooking.status || "BLOCKED";
    const content = statusContent[status] || statusContent.BLOCKED;
    const Icon = content.icon;
    const summaryRows = getBookingDetails(confirmedBooking);

    return (
      <main className="bg-paper/70">
        <section className="border-b border-line bg-white">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <p className="text-xs font-bold uppercase tracking-[0.32em] text-gold">Booking Status</p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight text-ink sm:text-5xl">{content.title}</h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-secondary">
              {status === "BLOCKED"
                ? `Your bed has been blocked successfully. Our team will contact you at ${user?.phone || "the number on file"} to confirm, and after confirmation your payment will be handled by the Admin for verification.`
                : content.subtitle}
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <Card className="text-center hover:translate-y-0">
            <span className={`mx-auto grid h-16 w-16 place-items-center rounded-full ${content.iconBg}`}>
              <Icon className="h-9 w-9" />
            </span>
            <h2 className="mt-6 text-3xl font-semibold text-ink">{content.title}</h2>
            <p className="mt-3 text-secondary">Reference: {confirmedBooking.id || confirmedBooking._id || "Booking recorded"}</p>

            <div className="mt-8 grid gap-4 text-left text-sm sm:grid-cols-2">
              {summaryRows.map(([label, value]) => (
                <div key={label} className="rounded-xl border border-line bg-white px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted">{label}</p>
                  <p className="mt-1 font-semibold text-ink">{value}</p>
                </div>
              ))}
            </div>

          </Card>
          <NextSteps />
        </section>
      </main>
    );
  }

  return (
    <main className="bg-paper/70">
      <section className="border-b border-line bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.32em] text-gold">Booking Status</p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight text-ink sm:text-5xl">Track Your Booking</h1>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="space-y-3">
        {bookings.length === 0 && <Card className="hover:translate-y-0">No bookings found. Browse branches to block a bed.</Card>}
        {bookings.map((booking) => {
          const details = getBookingDetails(booking);
          return (
          <Card key={booking.id || booking._id} className="hover:translate-y-0">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-semibold text-ink">{booking.branch?.name || booking.branchName || "Branch"}</p>
                <p className="mt-1 text-sm text-secondary">Booking reference: {booking.id || booking._id || "-"}</p>
              </div>
              <Badge value={booking.bookingStatus || booking.status} />
            </div>
            <div className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
              {details.map(([label, value]) => (
                <div key={label} className="rounded-xl border border-line bg-white px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted">{label}</p>
                  <p className="mt-1 font-semibold text-ink">{value}</p>
                </div>
              ))}
            </div>
            <NextSteps />
          </Card>
          );
        })}
        </div>
      </section>
    </main>
  );
};

export default BookingStatus;
