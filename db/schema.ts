import { pgTable, serial, text, integer, timestamp, jsonb } from "drizzle-orm/pg-core";

export const orders = pgTable("orders", {
    id: serial("id").primaryKey(),
    stripeSessionId: text("stripe_session_id").unique().notNull(),

    // Dane klienta
    customerEmail: text("customer_email").notNull(),
    customerName: text("customer_name"),
    customerPhone: text("customer_phone"),

    // Logistyka
    shippingAddress: jsonb("shipping_address"),
    deliveryMethod: text("delivery_method").notNull(), // 'courier' | 'inpost'
    paczkomatCode: text("paczkomat_code"),

    // NOWOŚĆ: Numer listu przewozowego (do śledzenia)
    trackingNumber: text("tracking_number"),

    // ZMIANA: Zamiast jednego sluga, trzymamy tablicę produktów (JSON)
    // Struktura: [{ name: "Hoodie [L]", price: 34900, quantity: 1, image: "..." }]
    items: jsonb("items").notNull(),

    amountTotal: integer("amount_total").notNull(),
    currency: text("currency").notNull(),
    status: text("status").notNull().default("paid"), // paid, shipped, delivered

    createdAt: timestamp("created_at").defaultNow(),
});