import { CheckCircle2 } from "lucide-react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";

const BlockRequestSuccess = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const booking = state?.booking;

  if (!booking) return <Navigate to="/booking-status" replace />;

  return (
    <main className="min-h-[calc(100vh-65px)] bg-paper/70 px-4 py-10 sm:px-6 lg:px-8">
      <section className="mx-auto grid max-w-2xl place-items-center py-10">
        <Card className="w-full text-center hover:translate-y-0">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-50 text-emerald-700">
            <CheckCircle2 className="h-9 w-9" />
          </span>
          <p className="mt-6 text-xs font-bold uppercase tracking-[0.32em] text-gold">Block Request</p>
          <h1 className="mt-3 text-3xl font-semibold text-ink">Block Request Submitted</h1>
          <p className="mx-auto mt-5 max-w-lg text-left leading-7 text-secondary">
            Your selected bed has been temporarily blocked.<br /><br />
            Our staff will contact you shortly to verify your booking.<br /><br />
            Payment and final confirmation will be completed during your visit.
          </p>
          <Button className="mt-8 w-full sm:w-auto" onClick={() => navigate("/booking-status", { state: { booking } })}>
            View Booking Status
          </Button>
        </Card>
      </section>
    </main>
  );
};

export default BlockRequestSuccess;
