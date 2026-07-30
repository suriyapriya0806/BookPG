import { featuredPgBranches, formatCurrency } from "./bookingFlow";

export const featuredPgs = featuredPgBranches.map((branch) => ({
  id: branch.id,
  name: branch.name,
  location: branch.addressLines.join(" "),
  rent: formatCurrency(branch.startingPrice),
  rating: branch.rating,
  tag: `${branch.occupancy.availableRooms} Available`,
  image: branch.image,
  amenities: branch.facilities,
  branchId: branch.id
}));

export const popularBranches = [
  { city: "Chennai", area: "Tambaram", properties: "20 Premium PGs", occupancy: "82%" },
  { city: "Chennai", area: "Velachery", properties: "18 Premium PGs", occupancy: "78%" },
  { city: "Chennai", area: "Guindy", properties: "22 Premium PGs", occupancy: "86%" },
  { city: "Chennai", area: "Sholinganallur", properties: "25 Premium PGs", occupancy: "91%" }
];

export const amenities = [
  {
    title: "Healthy Food",
    description: "Fresh breakfast, lunch, and dinner served daily."
  },
  {
    title: "High-Speed Wi-Fi",
    description: "Unlimited high-speed internet for study and work."
  },
  {
    title: "CCTV Security",
    description: "24x7 CCTV surveillance with secure premises."
  },
  {
    title: "Biometric Entry",
    description: "Secure biometric or smart access for residents."
  },
  {
    title: "Laundry Service",
    description: "Weekly laundry and washing machine facilities."
  },
  {
    title: "Housekeeping",
    description: "Regular room cleaning and maintenance support."
  },
  {
    title: "Power Backup",
    description: "24x7 electricity with generator backup."
  },
  {
    title: "RO Drinking Water",
    description: "Clean and purified drinking water available at all times."
  }
];

export const testimonials = [
  {
    name: "Ananya Rao",
    role: "Product Designer",
    quote: "The experience felt closer to booking a boutique hotel than searching for a PG. Everything was clear, calm, and polished."
  },
  {
    name: "Karthik Menon",
    role: "Software Engineer",
    quote: "I shortlisted branches in minutes and knew exactly what I was paying for. The premium rooms and amenities were represented honestly."
  },
  {
    name: "Nisha Iyer",
    role: "MBA Student",
    quote: "The location cards, safety information, and amenity details made it easy for my family to compare options confidently."
  }
];

export const faqs = [
  {
    question: "How do I book a bed in a PG?",
    answer: "Browse a branch, choose your room type and an available bed, then submit a block request. Our staff will contact you to arrange an in-person meeting, payment, and final confirmation."
  },
  {
    question: "What documents are required for booking?",
    answer: "You need a valid Aadhaar Card, a recent passport-size photo, and parent or guardian contact details. Students should provide their college information, while working professionals should provide their company details."
  },
  {
    question: "When do I make payment?",
    answer: "No online payment is required to block a bed. Payment is collected in person after our staff contacts you and confirms the booking."
  },
  {
    question: "When can I move into the PG?",
    answer: "After our staff meets you and confirms the booking in person, you will receive your room allocation and check-in date."
  }
];
