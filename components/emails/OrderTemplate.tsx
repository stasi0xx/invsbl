import * as React from 'react';

interface OrderTemplateProps {
    orderId: string;
    products: string; // Np. "CONCRETE HOODIE"
    amount: string;
    paczkomat?: string;
}

export const OrderTemplate: React.FC<OrderTemplateProps> = ({
                                                                orderId,
                                                                products,
                                                                amount,
                                                                paczkomat,
                                                            }) => (
    <div style={{ fontFamily: 'monospace', backgroundColor: '#09090b', color: '#f4f4f5', padding: '40px' }}>
        <h1 style={{ fontSize: '24px', marginBottom: '20px', textTransform: 'uppercase' }}>
            Order Confirmed
        </h1>
        <p style={{ color: '#a1a1aa', marginBottom: '40px' }}>
            Twoje zamówienie zostało przyjęte do systemu.
        </p>

        <div style={{ border: '1px solid #333', padding: '20px', marginBottom: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ color: '#a1a1aa' }}>ORDER ID</span>
                <span>{orderId}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ color: '#a1a1aa' }}>ITEM</span>
                <span>{products}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ color: '#a1a1aa' }}>TOTAL</span>
                <span style={{ color: '#d9f99d' }}>{amount}</span>
            </div>
            {paczkomat && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #333' }}>
                    <span style={{ color: '#a1a1aa' }}>PACZKOMAT</span>
                    <span style={{ fontWeight: 'bold' }}>{paczkomat}</span>
                </div>
            )}
        </div>

        <p style={{ fontSize: '12px', color: '#666', marginTop: '60px' }}>
            INVSBL / STREETWEAR / 2025
        </p>
    </div>
);