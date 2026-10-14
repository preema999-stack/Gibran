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
  selectedDishes?: Array<{ name: string; quantity: number; price: number }>;
}

export function formatReservationMessage(details: BookingConfirmationDetails): string {
  const dishesBlock =
    details.selectedDishes && details.selectedDishes.length > 0
      ? [
          ``,
          `🍽️ *Table Selection / Pre-ordered Dishes:*`,
          ...details.selectedDishes.map(
            (d) => `• ${d.quantity}x ${d.name} (AED ${d.price * d.quantity})`
          ),
          `💰 *Estimated Dishes Total:* AED ${details.selectedDishes.reduce(
            (sum, d) => sum + d.price * d.quantity,
            0
          )}`,
        ]
      : [];

  const lines = [
    `🌿 *TABLE RESERVATION INQUIRY*`,
    `🍽️ *Gibran & Co.*`,
    ``,
    `Hello! I have just submitted a table reservation through your website. Here are my booking details:`,
    `----------------------------------------`,
    `📋 *Booking Reference:* ${details.bookingCode}`,
    `👤 *Guest Name:* ${details.name}`,
    `👥 *Party Size:* ${details.guests}`,
    `📅 *Date:* ${details.date || "Today / Tonight"}`,
    `⏰ *Time:* ${details.time}`,
    `📍 *Location:* ${(details.location || "").replace(/—/g, "-")}`,
    details.seating ? `✨ *Seating Preference:* ${details.seating}` : "",
    details.notes ? `📝 *Special Request:* ${details.notes}` : "",
    details.phone ? `📱 *Contact Phone:* ${details.phone}` : "",
    details.email ? `✉️ *Email:* ${details.email}` : "",
    ...dishesBlock,
    `----------------------------------------`,
    `✨ Please confirm our table reservation. Looking forward to dining with you!`,
  ].filter((line) => line !== "");

  return lines.join("\n");
}

export const RESTAURANT_WHATSAPP_NUMBER = "917994129471";
export const RESTAURANT_WHATSAPP_DISPLAY = "+91 79941 29471";
export const RESTAURANT_EMAIL = "concierge@gibran.com";

export function formatWhatsAppPhone(phone?: string): string {
  if (!phone) return RESTAURANT_WHATSAPP_NUMBER;
  const clean = phone.replace(/[^0-9]/g, "");
  if (clean.length === 10) return `91${clean}`;
  if (clean.length >= 8) return clean;
  return RESTAURANT_WHATSAPP_NUMBER;
}

export function createWhatsAppUrl(
  details?: BookingConfirmationDetails,
  targetPhone: string = RESTAURANT_WHATSAPP_NUMBER
): string {
  const phone = formatWhatsAppPhone(targetPhone);
  if (details) {
    const text = formatReservationMessage(details);
    return `https://api.whatsapp.com/send/?phone=${phone}&text=${encodeURIComponent(text)}`;
  }
  return `https://api.whatsapp.com/send/?phone=${phone}`;
}

export function createEmailUrl(
  details: BookingConfirmationDetails,
  targetEmail: string = RESTAURANT_EMAIL
): string {
  const subject = `New Table Reservation [${details.bookingCode}] - ${details.name}`;
  const body = formatReservationMessage(details);
  const recipient = (targetEmail || RESTAURANT_EMAIL).trim();
  return `mailto:${encodeURIComponent(recipient)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
