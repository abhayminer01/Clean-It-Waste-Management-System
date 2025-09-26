import jsPDF from "jspdf";
import axios from "axios";
const BASE_URL = "http://localhost:5000/api"; // Your backend URL

export async function generateInvoice(paymentId) {
  try {
    // Fetch payment from backend API
    const res = await axios.get(`${BASE_URL}/payment/${paymentId}`, {
      withCredentials: true,
    });

    if (!res.data.success) {
      alert(res.data.message || "Payment not found");
      return;
    }

    const payment = res.data.payment;
    const user = payment.user;

    const doc = new jsPDF();
    let y = 20;

    doc.setFontSize(18);
    doc.text("Payment Invoice", 20, y);
    y += 12;

    doc.setFontSize(12);

    // --- User Details ---
    if (user) {
      doc.setFont(undefined, "bold");
      doc.text("User Details:", 20, y);
      doc.setFont(undefined, "normal");
      y += 8;
      if (user.full_name) doc.text(`Name: ${user.full_name}`, 20, y += 10);
      if (user.email) doc.text(`Email: ${user.email}`, 20, y += 10);
      if (user.phone) doc.text(`Phone: ${user.phone}`, 20, y += 10);

      y += 5;
      doc.line(20, y, 190, y);
      y += 5;
    }

    // --- Payment Details ---
    doc.setFont(undefined, "bold");
    doc.text("Payment Details:", 20, y);
    doc.setFont(undefined, "normal");
    y += 8;
    doc.text(`Payment ID: ${payment._id}`, 20, y += 10);
    doc.text(`Status: ${payment.status}`, 20, y += 10);
    doc.text(`Amount: ₹${(payment.amount / 100).toFixed(2)}`, 20, y += 10);
    doc.text(`Stripe Intent ID: ${payment.stripePaymentIntentId}`, 20, y += 10);

    y += 5;
    doc.line(20, y, 190, y);
    y += 5;

    // --- Pickup Details ---
    if (payment.pickup) {
      doc.setFont(undefined, "bold");
      doc.text("Pickup Details:", 20, y);
      doc.setFont(undefined, "normal");
      y += 8;
      if (payment.pickup.waste_type) doc.text(`Waste Type: ${payment.pickup.waste_type}`, 20, y += 10);
      if (payment.pickup.sheduled_date)
        doc.text(
          `Date: ${new Date(payment.pickup.sheduled_date).toLocaleDateString()}`,
          20,
          y += 10
        );
      if (payment.pickup.scheduled_time)
        doc.text(`Time Slot: ${payment.pickup.scheduled_time}`, 20, y += 10);
    }

    doc.save(`Invoice-${payment._id.slice(-6)}.pdf`);
  } catch (error) {
    console.error(error);
    alert("Failed to generate invoice");
  }
}
