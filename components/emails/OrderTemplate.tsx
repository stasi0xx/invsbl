import * as React from 'react';

interface OrderTemplateProps {
    orderId: number | string;
    items: any[];
    amount: string;
    deliveryMethod: string;
    paczkomat?: string;
}

export const OrderTemplate: React.FC<OrderTemplateProps> = ({
                                                                orderId,
                                                                items,
                                                                amount,
                                                                deliveryMethod,
                                                                paczkomat,
                                                            }) => (
    <div style={{ fontFamily: 'Courier New, monospace', backgroundColor: '#09090b', color: '#f4f4f5', padding: '40px' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', border: '1px solid #333', padding: '20px' }}>

            {/* HEADER */}
            <h1 style={{ fontSize: '24px', letterSpacing: '-1px', marginBottom: '10px', color: '#fff' }}>INVSBL</h1>
            <p style={{ fontSize: '12px', color: '#666', textTransform: 'uppercase', marginBottom: '40px' }}>
                Order Confirmation #{orderId}
            </p>

            {/* MESSAGE */}
            <p style={{ marginBottom: '20px', fontSize: '14px', lineHeight: '1.5' }}>
                Twoje zamówienie zostało przyjęte do realizacji.
                Gdy tylko paczka zostanie nadana, otrzymasz od nas <strong>osobny e-mail z linkiem do śledzenia</strong>.
            </p>

            {/* ITEMS TABLE */}
            <div style={{ borderTop: '1px solid #333', borderBottom: '1px solid #333', padding: '20px 0', marginBottom: '20px' }}>
                {items.map((item, index) => (
                    <div key={index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '14px' }}>
                        <span style={{ textTransform: 'uppercase' }}>{item.quantity}x {item.name}</span>
                    </div>
                ))}
            </div>

            {/* LOGISTICS */}
            <div style={{ fontSize: '12px', color: '#888', marginBottom: '40px' }}>
                <p>METODA: <span style={{ color: '#fff' }}>{deliveryMethod.toUpperCase()}</span></p>
                {paczkomat && <p>PUNKT: <span style={{ color: '#bef264' }}>{paczkomat}</span></p>}
                <p>SUMA: <span style={{ color: '#fff' }}>{amount}</span></p>
            </div>

            {/* FOOTER */}
            <div style={{ fontSize: '10px', color: '#444', textAlign: 'center' }}>
                <p>INVSBL SP. Z O.O. • WARSAW • POLAND</p>
            </div>

        </div>
    </div>
);