const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.post('/api/checkout', (req, res) => {
    const { items, coupon } = req.body;

    let subtotal = items.reduce((acc, item) => acc + (item.price * (item.quantity || 1)), 0);

    let discount = 0;

    if (coupon === 'DESCUENTO10') {
        const regularSubtotal = items
            .filter(item => !item.onSale)
            .reduce((acc, item) => acc + (item.price * (item.quantity || 1)), 0);
        
        discount = Math.min(regularSubtotal * 0.10, 15.00);
    }

    let totalNeto = subtotal - discount;
    let shipping = totalNeto > 50 ? 0 : 5;

    res.json({
        subtotal: Number(subtotal.toFixed(2)),
        discount: Number(discount.toFixed(2)),
        shipping: Number(shipping.toFixed(2)),
        total: Number((totalNeto + shipping).toFixed(2))
    });
});

app.listen(3000, () => console.log('🚀 API de Pruebas corriendo en http://localhost:3000'));