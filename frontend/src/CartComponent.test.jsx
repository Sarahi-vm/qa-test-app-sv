import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CartComponent } from './CartComponent';

describe('CartComponent', () => {
    beforeEach(() => {
        vi.restoreAllMocks();
        vi.spyOn(window, 'alert').mockImplementation(() => { });
    });

    it('debe renderizar el catálogo de productos y el mensaje de carrito vacío', () => {
        render(<CartComponent />);

        // Verificar título
        expect(screen.getByText('QA Testing Sandbox 🛒')).toBeInTheDocument();

        // Verificar productos del catálogo
        const products = screen.getAllByTestId('cart-product');
        expect(products.length).toBeGreaterThan(1);

        // Verificar estado de carrito vacío
        expect(screen.getByText('El carrito está completamente vacío.')).toBeInTheDocument();

        // El botón de checkout debe estar deshabilitado
        const checkoutButton = screen.getByRole('button', { name: /calcular total/i });
        expect(checkoutButton).toBeDisabled();
    });

    it('debe permitir añadir productos al carrito y actualizar el último artículo interactuado', () => {
        render(<CartComponent />);

        const tecladoBtn = screen.getByRole('button', { name: /Teclado Mecánico/i });
        fireEvent.click(tecladoBtn);

        // Ya no debe estar vacío.
        expect(screen.queryByText('El carrito está completamente vacío.')).not.toBeInTheDocument();

        // Debe aparecer en la sección de carrito actual
        const itemEnCarrito = screen.getByText('Teclado Mecánico');
        expect(itemEnCarrito).toBeInTheDocument();

        expect(screen.getByText(/Último artículo interactuado:/i)).toHaveTextContent('Teclado Mecánico');
    });

    it('debe limitar la cantidad agregada al stock disponible (límite de 5 para Teclado)', () => {
        const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => { });
        render(<CartComponent />);

        const tecladoBtn = screen.getByRole('button', { name: /Teclado Mecánico/i });

        // Intentar hacer click 6 veces (stock es 5)
        for (let i = 0; i < 6; i++) {
            fireEvent.click(tecladoBtn);
        }

        // La cantidad en el input del carrito debe ser 5
        const cantidadInput = screen.getByLabelText('Cant:');
        expect(cantidadInput.value).toBe('5');

        // El botón del catálogo para Teclado Mecánico debe deshabilitarse al alcanzar el stock máximo
        expect(tecladoBtn).toBeDisabled();
    });

    it('debe permitir cambiar la cantidad manualmente y validar el stock', () => {
        const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => { });
        render(<CartComponent />);

        const tecladoBtn = screen.getByRole('button', { name: /Teclado Mecánico/i });
        fireEvent.click(tecladoBtn);

        const cantidadInput = screen.getByLabelText('Cant:');

        // Cambiar cantidad a 3 (válido)
        fireEvent.change(cantidadInput, { target: { value: '3' } });
        expect(cantidadInput.value).toBe('3');

        // Intentar cambiar cantidad a 6 (excede stock)
        fireEvent.change(cantidadInput, { target: { value: '6' } });
        expect(alertSpy).toHaveBeenCalledWith('No hay suficiente stock. Máximo: 5');
        // Debe quedarse en la cantidad anterior válida (3)
        expect(cantidadInput.value).toBe('3');
    });

    it('debe eliminar el producto del carrito si la cantidad se establece en 0', () => {
        render(<CartComponent />);

        const tecladoBtn = screen.getByRole('button', { name: /Teclado Mecánico/i });
        fireEvent.click(tecladoBtn);

        const cantidadInput = screen.getByLabelText('Cant:');

        // Cambiar a 0
        fireEvent.change(cantidadInput, { target: { value: '0' } });

        // El carrito debe estar vacío de nuevo
        expect(screen.getByText('El carrito está completamente vacío.')).toBeInTheDocument();
    });

    it('debe vaciar todo el carrito al presionar "Vaciar Carrito"', () => {
        render(<CartComponent />);

        const tecladoBtn = screen.getByRole('button', { name: /Teclado Mecánico/i });
        const mouseBtn = screen.getByRole('button', { name: /Mouse Gamer/i });

        fireEvent.click(tecladoBtn);
        fireEvent.click(mouseBtn);

        const vaciarBtn = screen.getByRole('button', { name: /vaciar carrito/i });
        fireEvent.click(vaciarBtn);

        expect(screen.getByText('El carrito está completamente vacío.')).toBeInTheDocument();
    });

    it('debe realizar la llamada a la API de checkout y renderizar el resumen de pagos', async () => {
        // Simulamos la respuesta de fetch
        const mockSummaryResponse = {
            subtotal: 40.00,
            discount: 0.00,
            shipping: 5.00,
            total: 45.00
        };

        const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue({
            json: async () => mockSummaryResponse
        });

        render(<CartComponent />);

        // Agregar un Teclado
        const tecladoBtn = screen.getByRole('button', { name: /Teclado Mecánico/i });
        fireEvent.click(tecladoBtn);

        // Escribir un cupón
        const couponInput = screen.getByPlaceholderText('Cupón (ej: DESCUENTO10)');
        fireEvent.change(couponInput, { target: { value: 'DESCUENTO10' } });

        // Presionar Calcular Total
        const checkoutButton = screen.getByRole('button', { name: /calcular total/i });
        fireEvent.click(checkoutButton);

        // Verificar la llamada a la API
        expect(fetchSpy).toHaveBeenCalledWith('http://localhost:3000/api/checkout', expect.objectContaining({
            method: 'POST',
            body: JSON.stringify({
                items: [{ id: 1, name: 'Teclado Mecánico', price: 40, onSale: false, stock: 5, quantity: 1 }],
                coupon: 'DESCUENTO10'
            })
        }));

        // Verificar que aparezca la respuesta en pantalla
        await waitFor(() => {
            expect(screen.getByText('3. Respuesta del Servidor (API Response)')).toBeInTheDocument();
            expect(screen.getByText('Subtotal:')).toBeInTheDocument();
            expect(screen.getByText('$40')).toBeInTheDocument();
            expect(screen.getByText('Costo de Envío:')).toBeInTheDocument();
            expect(screen.getByText('$5')).toBeInTheDocument();
            expect(screen.getByText('Total Cargado:')).toBeInTheDocument();
            expect(screen.getByText('$45')).toBeInTheDocument();
        });
    });
});
