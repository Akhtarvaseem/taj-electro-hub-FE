export const SERVICE_CATALOG = [
  {
    id: "refrigerator",
    name: "Refrigerator",
    icon: "❄️",
    problems: [
      "Cooling issue / Not cooling",
      "Water leakage",
      "Gas refilling needed",
      "Power issue / Not turning on",
      "Abnormal noise or vibration",
      "Thermostat failure",
    ],
  },
  {
    id: "washing_machine",
    name: "Washing Machine",
    icon: "🌀",
    problems: [
      "Drum not spinning",
      "Water drainage issue",
      "Excessive noise during spin",
      "Power fault / PCB issue",
      "Door lock failure",
      "Water inlet error",
    ],
  },
  {
    id: "cooler",
    name: "Air Cooler",
    icon: "💨",
    problems: [
      "Motor fault / Not turning on",
      "Low fan speed",
      "Water pump issue",
      "Motor rewinding required",
      "Capacitor replacement",
      "Body water leakage",
    ],
  },
  {
    id: "ceiling_fan",
    name: "Ceiling Fan",
    icon: "🔌",
    problems: [
      "Low speed",
      "Humming or bearing noise",
      "Capacitor change needed",
      "Motor rewinding",
      "Wobbling / Unbalanced",
      "Switch regulator fault",
    ],
  },
  {
    id: "geyser",
    name: "Geyser / Water Heater",
    icon: "🔥",
    problems: [
      "Water not heating",
      "Thermostat fault",
      "Heating element replacement",
      "Tank or pipe water leakage",
      "MCB tripping on switch ON",
      "Indicator light not working",
    ],
  },
  {
    id: "ac",
    name: "Air Conditioner (AC)",
    icon: "❄️",
    problems: [
      "Deep jet cleaning required",
      "Gas refilling (R22/R32/R410)",
      "PCB repair / Error code",
      "Cooling fault / Fan running only",
      "Indoor unit water leakage",
      "Compressor tripping",
    ],
  },
  {
    id: "home_wiring",
    name: "Home Wiring & Repairing",
    icon: "⚡",
    problems: [
      "Short circuit diagnosis",
      "Switch / Socket replacement",
      "Frequent MCB tripping",
      "Main line fault / Sparking",
      "New electrical fitting",
      "Inverter / Battery wiring issue",
    ],
  },
];

export const VISIT_FEE = 199;

export function whatsappDispatchUrl(c, techPhone) {
  const problems = (c.selectedProblems || []).join(", ");
  const phone = techPhone || c.assignedTechPhone || "";
  const text =
    `🛠️ *TAJ Home Solutions - New Job Assignment*\n\n` +
    `• *Complaint Request No:* ${c.complaintNo || c.id}\n` +
    `• *Appliance / Service:* ${c.serviceName} (${problems})\n` +
    `• *Customer Name:* ${c.customerName}\n` +
    `• *Customer Contact No:* ${c.phone}${c.altPhone ? " / " + c.altPhone : ""}\n` +
    `• *Address:* ${c.address}${c.landmark ? " (Landmark: " + c.landmark + ")" : ""}\n` +
    `• *Fixed Visit Fee to Collect:* ₹${c.visitCharge || VISIT_FEE}\n` +
    (c.notes ? `• *Customer Note:* ${c.notes}\n` : "") +
    `\n*Note:* Please contact the customer & schedule the visit immediately.`;
  const digits = String(phone).replace(/\D/g, "").slice(-10);
  return `https://wa.me/91${digits}?text=${encodeURIComponent(text)}`;
}
