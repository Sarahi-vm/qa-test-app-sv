import React, { useState } from 'react';

// Catálogo maestro para que el usuario o candidato juegue con los escenarios
const PRODUCTOS_DISPONIBLES = [
    { id: 1, name: "Teclado Mecánico", price: 40, onSale: false, stock: 5 },
    { id: 2, name: "Mouse Gamer (Oferta)", price: 20, onSale: true, stock: 10 },
    { id: 3, name: "Monitor Premium", price: 200, onSale: false, stock: 2 }
];

export function CartComponent() {
    const [items, setItems] = useState([]);
    const [coupon, setCoupon] = useState('');
    const [summary, setSummary] = useState(null);

    const handleAddProduct = (producto) => {
        setItems(prevItems => {
            const existe = prevItems.find(item => item.id === producto.id);
            if (existe) {
                if (existe.quantity + 1 > producto.stock) {
                    alert('No hay stock suficiente')
                    return
                }
                return prevItems.map(item =>
                    item.id === producto.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prevItems, { ...producto, quantity: 1 }];
        });
    };

    const handleQuantityChange = (id, valor) => {

        const prod = PRODUCTOS_DISPONIBLES.find(item => item.id === id)

        if (valor > prod.stock) {
            alert("No hay suficiente stock. Máximo: " + prod.stock)
            return
        }

        setItems(prevItems => {
            if (valor == 0) {
                return prevItems.filter(item => item.id !== id)
            }

            return prevItems.map(item =>
                item.id === id ? { ...item, quantity: parseInt(valor) } : item
            )
        });
    };

    const handleClearCart = () => {
        setItems([]);
        setSummary(null);
    };

    const handleCheckout = async () => {
        const response = await fetch('http://localhost:3000/api/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items, coupon })
        });
        const data = await response.json();
        setSummary(data);
    };

    return (
        <div style={{ padding: '30px', fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ color: '#333' }}>QA Testing Sandbox 🛒</h1>
            <p style={{ color: '#666' }}>Utiliza este panel para construir tus casos de prueba lógicos, de límites y de volumen.</p>

            {/* PANEL DE PRODUCTOS DISPONIBLES */}
            <div style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px', marginBottom: '25px', border: '1px solid #ddd' }}>
                <h3 style={{ marginTop: 0 }}>1. Catálogo de Productos (Haz clic para añadir)</h3>
                <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                    {PRODUCTOS_DISPONIBLES.map(prod => {
                        const carritoItem = items.find(item => item.id === prod.id);

                        return (
                            <button
                                data-testid="cart-product"
                                disabled={carritoItem?.quantity >= prod.stock}
                                key={prod.id}
                                onClick={() => handleAddProduct(prod)}
                                style={{ padding: '10px', cursor: 'pointer', borderRadius: '5px', border: '1px solid #999', backgroundColor: '#fff' }}
                            >
                                <strong>{prod.name}</strong> <br />
                                Precio: ${prod.price} {prod.onSale && <span style={{ color: 'red' }}>(Oferta)</span>} <br />
                                <small style={{ color: '#777' }}>Stock Máx: {prod.stock}</small>
                            </button>
                        )
                    })}
                </div>
            </div>

            <div style={{ padding: '10px', backgroundColor: '#e6f7ff', borderRadius: '5px', marginBottom: '20px' }}>
                <p style={{ margin: 0, color: '#0050b3' }}>
                    <strong>Último artículo interactuado:</strong> {items[items?.length - 1]?.name}
                </p>
            </div>

            {/* VISTA DEL CARRITO */}
            <h3>2. Tu Carrito Actual</h3>
            {items.length === 0 ? (
                <p style={{ padding: '15px', backgroundColor: '#fffbe6', color: '#d46b08', borderRadius: '5px' }}>
                    El carrito está completamente vacío.
                </p>
            ) : (
                <div style={{ marginBottom: '20px' }}>
                    {items.map(item => (
                        <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '10px 0', borderBottom: '1px solid #eee' }}>
                            <span style={{ width: '200px' }}>{item.name} {item.onSale && <strong style={{ color: 'red' }}>%</strong>}</span>
                            <span>Precio: ${item.price}</span>
                            <div>
                                <label>Cant: </label>
                                <input
                                    type="number"
                                    value={isNaN(item.quantity) ? '' : item.quantity}
                                    onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                                    style={{ width: '60px', padding: '5px' }}
                                />
                            </div>
                        </div>
                    ))}
                    <button
                        onClick={handleClearCart}
                        style={{ marginTop: '15px', backgroundColor: '#ff4d4f', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer' }}
                    >
                        Vaciar Carrito
                    </button>
                </div>
            )}

            {/* CONTROLES DE CHECKOUT */}
            <div style={{ marginTop: '30px', borderTop: '2px solid #ccc', paddingTop: '20px' }}>
                <input
                    type="text"
                    placeholder="Cupón (ej: DESCUENTO10)"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    style={{ padding: '8px', marginRight: '10px', width: '200px' }}
                />
                <button
                    disabled={items.length === 0}
                    onClick={handleCheckout}
                    style={{ opacity: items.length === 0 ? 0.5 : 1, padding: '8px 16px', backgroundColor: '#52c41a', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                    Calcular Total
                </button>
            </div>

            {/* RESUMEN DE PAGOS */}
            {summary && (
                <div style={{ marginTop: '20px', backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '6px', border: '1px solid #e8e8e8' }}>
                    <h4 style={{ marginTop: 0 }}>3. Respuesta del Servidor (API Response)</h4>
                    <p>Subtotal: <strong>${summary.subtotal}</strong></p>
                    <p>Descuento Aplicado: <strong style={{ color: 'green' }}>-${summary.discount}</strong></p>
                    <p>Costo de Envío: <strong>${summary.shipping}</strong></p>
                    <hr />
                    <p id="total-price" style={{ fontSize: '20px', margin: 0 }}>Total Cargado: <strong style={{ color: '#1890ff' }}>${summary.total}</strong></p>
                </div>
            )}
        </div>
    );
}