const API_URL = import.meta.env.VITE_API_URL ?? '';

export async function createOrder(order, signal) {
  const response = await fetch(`${API_URL}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(order),
    signal
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message ?? `Order failed (${response.status})`);
  }

  return response.json();
}
