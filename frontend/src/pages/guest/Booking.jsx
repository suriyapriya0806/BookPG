import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import { useAuth } from "../../context/AuthContext";
import { bookingBranches, bookingRooms } from "../../data/bookingFlow";
import { createGuestBlockBooking } from "../../data/adminBookings";
import { addBlockNotification } from "../../lib/liveBlocks";

const Booking = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const [phone, setPhone] = useState(user?.phone || "");
  const [moveInDate, setMoveInDate] = useState("");
  const [message, setMessage] = useState("");

  const room = useMemo(
    () => bookingRooms.find((item) => item.id === state?.roomId) || null,
    [state?.roomId]
  );
  const branch = useMemo(
    () => bookingBranches.find((item) => item.id === state?.branchId) || (room ? bookingBranches.find((item) => item.id === room.branchId) : null),
    [room, state?.branchId]
  );
  const selectedBed = state?.selectedBed || null;

  const submit = () => {
    setMessage("");
    if (!phone.trim() || !moveInDate || !selectedBed || !room || !branch) {
      setMessage("Please provide your phone number and move-in date before blocking this bed.");
      return;
    }
    const updatedGuest = { ...user, phone: phone.trim() };
    localStorage.setItem("pg_user", JSON.stringify(updatedGuest));
    setUser(updatedGuest);
    const booking = createGuestBlockBooking({ guest: updatedGuest, phone: phone.trim(), branch, room, bed: selectedBed, moveInDate });
    addBlockNotification(updatedGuest, booking);
    navigate("/block-request-submitted", { state: { booking } });
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <Card>
        <h1 className="text-2xl font-bold">Block This Bed</h1>
        <p className="mt-2 text-slate-600">Temporarily reserve your selected bed while our staff contacts you.</p>
        {message && <p className="mt-4 rounded-md bg-amber-50 p-3 text-sm text-amber-700">{message}</p>}
        <div className="mt-5 space-y-4">
          <Input label="Name" value={user?.name || "Guest"} disabled />
          <Input label="Email" type="email" value={user?.email || ""} disabled />
          <Input label="Phone Number *" type="tel" placeholder="Enter your phone number" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <Input label="Move-in Date *" type="date" value={moveInDate} onChange={(e) => setMoveInDate(e.target.value)} />
        </div>
        <div className="mt-5 rounded-xl bg-gold/10 p-4 text-sm leading-6 text-secondary">
          <p className="font-semibold text-ink">Selected: {branch?.name || "Branch"} · Room {room?.number || "-"} · {selectedBed?.label || "No bed selected"}</p>
          <p className="mt-2">Your bed will be temporarily blocked. Our staff will contact you to arrange an in-person meeting, payment, and final confirmation.</p>
        </div>
        <Button className="mt-5" disabled={!moveInDate || !phone.trim() || !selectedBed || !room || !branch} onClick={submit}>Block Bed</Button>
      </Card>
    </main>
  );
};

export default Booking;
