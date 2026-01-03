import { pgTable, serial, text, integer, timestamp, jsonb } from "drizzle-orm/pg-core";

export const orders = pgTable("orders", {
    id: serial("id").primaryKey(),

    // Kluczowe do powiązania płatności
    stripeSessionId: text("stripe_session_id").unique().notNull(),

    // Dane klienta
    customerEmail: text("customer_email").notNull(),
    customerName: text("customer_name"),
    customerPhone: text("customer_phone"),

    // Adres (dla kuriera) lub dane paczkomatu
    shippingAddress: jsonb("shipping_address"),
    deliveryMethod: text("delivery_method").notNull(), // 'courier' | 'inpost'
    paczkomatCode: text("paczkomat_code"),             // Np. 'WAW22A'

    // Produkt
    productSlug: text("product_slug").notNull(),
    amountTotal: integer("amount_total").notNull(), // W groszach
    currency: text("currency").notNull(),

    // Status zamówienia
    status: text("status").notNull().default("pending"), // pending -> paid -> shipped

    createdAt: timestamp("created_at").defaultNow(),
});