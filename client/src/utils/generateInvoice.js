import jsPDF from "jspdf";
import logo from "/withoutbg.png";

export function generateInvoice({ payment, user, pickup }) {
  const doc = new jsPDF();

  // === HEADER ===
  doc.addImage(logo, "PNG", 150, 8, 40, 40);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("INVOICE", 20, 20);

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text("Clean-It Waste Management System", 20, 28);

  // === Invoice Metadata ===
  let y = 50;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Invoice Details", 20, y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  y += 10;
  doc.text(`Invoice No: INV-${payment._id.slice(-6)}`, 20, y);
  y += 7;
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, y);

  // Separator line
  y += 5;
  doc.setDrawColor(180);
  doc.line(20, y, 190, y);
  y += 12;

  // === User Details ===
  if (user) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Billed To", 20, y);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    y += 10;
    if (user.industry_name)
      doc.text(`Industry: ${user.industry_name}`, 20, y);
    if (user.email) {
      y += 7;
      doc.text(`Email: ${user.email}`, 20, y);
    }
    if (user.address) {
      y += 7;
      doc.text(`Address: ${user.address}`, 20, y);
    }

    // Separator
    y += 10;
    doc.setDrawColor(180);
    doc.line(20, y, 190, y);
    y += 12;
  }

  // === Payment Summary ===
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Payment Summary", 20, y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  y += 10;
  doc.text(`Payment ID: ${payment._id}`, 20, y);
  y += 7;
  doc.text(`Status: ${payment.status}`, 20, y);
  y += 7;
  doc.text(`Amount Paid: 100 /-`, 20, y);
  y += 7;
  doc.text(`Stripe Intent ID: ${payment.stripePaymentIntentId}`, 20, y);

  // Separator
  y += 10;
  doc.setDrawColor(180);
  doc.line(20, y, 190, y);
  y += 12;

  // === Pickup Details ===
  if (pickup) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Pickup Details", 20, y);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    y += 10;
    if (pickup.waste_type)
      doc.text(`Waste Type: ${pickup.waste_type}`, 20, y);
    if (pickup.sheduled_date) {
      y += 7;
      doc.text(
        `Date: ${new Date(pickup.sheduled_date).toLocaleDateString()}`,
        20,
        y
      );
    }
    if (pickup.scheduled_time) {
      y += 7;
      doc.text(`Time Slot: ${pickup.scheduled_time}`, 20, y);
    }
  }

  // === FOOTER ===
  y += 25;
  doc.setFont("helvetica", "italic");
  doc.setFontSize(10);
  doc.text(
    "Thank you for choosing Clean-It. Together, we keep our city clean & green!",
    20,
    y
  );

  doc.save(`Invoice-${payment._id.slice(-6)}.pdf`);
}
