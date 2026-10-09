export interface BookingConfirmationDetails {
  bookingCode: string;
  name: string;
  phone?: string;
  email?: string;
  guests: string;
  time: string;
  date?: string;
  location: string;
  seating?: string;
  notes?: string;
}

export function formatReservationMessage(details: BookingConfirmationDetails): string {
  const lines = [
    `✨ GIBRAN & CO. — RESERVATION CONFIRMATION ✨`,
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    `📋 Booking Code: ${details.bookingCode}`,
    `👤 Guest Name: ${details.name}`,
    `👥 Guests: ${details.guests}`,
    `⏰ Time: ${details.time}`,
    `📅 Date: ${details.date || "Today / Tonight"}`,
    `📍 Location: ${details.location}`,
    details.seating ? `🪑 Seating Area: ${details.seating}` : "",
    details.notes ? `📝 Special Request: ${details.notes}` : "",
    ``,
    `📞 Concierge: +973 1729 4488`,
    `✉️ Concierge Email: concierge@gibranandco.com`,
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    `Thank you for choosing Gibran & Co. Haute Dining. We look forward to welcoming you!`,
  ].filter((line) => line !== "");

  return lines.join("\n");
}

export function createWhatsAppUrl(details: BookingConfirmationDetails, targetPhone?: string): string {
  const text = formatReservationMessage(details);
  const cleanPhone = targetPhone ? targetPhone.replace(/[^0-9]/g, "") : "";
  if (cleanPhone && cleanPhone.length >= 8) {
    return `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(text)}`;
  }
  return `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
}

export function createEmailUrl(details: BookingConfirmationDetails, targetEmail?: string): string {
  const subject = `Reservation Confirmation [${details.bookingCode}] — Gibran & Co.`;
  const body = formatReservationMessage(details);
  const recipient = (targetEmail || details.email || "").trim();
  return `mailto:${encodeURIComponent(recipient)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
