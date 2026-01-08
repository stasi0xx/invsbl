import * as React from 'react';

interface TrackingTemplateProps {
    orderId: string | number;
    trackingNumber: string;
    trackingUrl: string;
}

export const TrackingTemplate: React.FC<TrackingTemplateProps> = ({
                                                                      orderId,
                                                                      trackingNumber,
                                                                      trackingUrl,
                                                                  }) => (
    <div style={{ fontFamily: 'Courier New, monospace', backgroundColor: '#09090b', color: '#f4f4f5', padding: '40px' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', border: '1px solid #333', padding: '20px' }}>

            {/* HEADER */}
            <h1 style={{ fontSize: '24px', letterSpacing: '-1px', marginBottom: '10px', color: '#fff' }}>INVSBL</h1>
            <p style={{ fontSize: '12px', color: '#666', textTransform: 'uppercase', marginBottom: '40px' }}>
                Shipping Update #{orderId}
            </p>

            {/* MESSAGE */}
            <h2 style={{ color: '#bef264', textTransform: 'uppercase', fontSize: '18px', marginBottom: '20px' }}>
                Paczka w drodze
            </h2>
            <p style={{ marginBottom: '20px', fontSize: '14px', lineHeight: '1.5' }}>
                Twoje zamówienie zostało nadane i jest w drodze do Ciebie (lub do wybranego Paczkomatu).
            </p>

            {/* TRACKING INFO */}
            <div style={{ backgroundColor: '#111', padding: '20px', marginBottom: '30px', border: '1px dashed #444' }}>
                <p style={{ fontSize: '10px', color: '#888', marginBottom: '5px' }}>NUMER PRZESYŁKI:</p>
                <p style={{ fontSize: '16px', color: '#fff', letterSpacing: '2px', fontFamily: 'monospace' }}>
                    {trackingNumber}
                </p>
            </div>

            {/* BUTTON */}
            <a
                href={trackingUrl}
                style={{
                    display: 'block',
                    backgroundColor: '#f4f4f5',
                    color: '#000',
                    textDecoration: 'none',
                    padding: '15px',
                    textAlign: 'center',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    fontSize: '14px',
                    marginBottom: '40px'
                }}
            >
                Śledź przesyłkę
            </a>

            {/* FOOTER */}
            <div style={{ fontSize: '10px', color: '#444', textAlign: 'center' }}>
                <p>INVSBL SP. Z O.O. • WARSAW • POLAND</p>
            </div>

        </div>
    </div>
);