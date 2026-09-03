const API_URL = import.meta.env.VITE_API_URL ?? '';
const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true';

export async function createOrder(order, signal) {
  if (DEMO_MODE) {
    await new Promise((resolve) => setTimeout(resolve, 700));
    return {
      ...order,
      id: crypto.randomUUID(),
      status: 'CREATED',
      createdAt: new Date().toISOString()
    };
  }

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
