import { useMemo, useState } from 'react';
import { createOrder } from './api';

const menu = [
  { id: 1, name: 'Hyderabadi Biryani', restaurant: 'Spice Kitchen', category: 'Biryani', price: 279, rating: 4.8, time: '25 min', icon: '🍛' },
  { id: 2, name: 'Paneer Tikka Bowl', restaurant: 'Green Tandoor', category: 'Veg', price: 219, rating: 4.6, time: '20 min', icon: '🥘' },
  { id: 3, name: 'Crispy Chicken Burger', restaurant: 'Stacked', category: 'Burgers', price: 199, rating: 4.7, time: '18 min', icon: '🍔' },
  { id: 4, name: 'Farmhouse Pizza', restaurant: 'Oven Story', category: 'Pizza', price: 349, rating: 4.5, time: '30 min', icon: '🍕' },
  { id: 5, name: 'Masala Dosa', restaurant: 'South Station', category: 'Breakfast', price: 129, rating: 4.9, time: '15 min', icon: '🥞' },
  { id: 6, name: 'Chocolate Brownie', restaurant: 'Sweet Theory', category: 'Desserts', price: 149, rating: 4.6, time: '12 min', icon: '🍫' }
];

const categories = ['All', ...new Set(menu.map((item) => item.category))];

export default function App() {
  const [category, setCategory] = useState('All');
  const [query, setQuery] = useState('');
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [status, setStatus] = useState({ type: 'idle', message: '' });

  const visibleMenu = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return menu.filter((item) =>
      (category === 'All' || item.category === category) &&
      (!normalizedQuery || `${item.name} ${item.restaurant}`.toLowerCase().includes(normalizedQuery))
    );
  }, [category, query]);

  const total = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );

  function addItem(item) {
    setCart((current) => {
      const existing = current.find((cartItem) => cartItem.id === item.id);
      return existing
        ? current.map((cartItem) => cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem)
        : [...current, { ...item, quantity: 1 }];
    });
    setStatus({ type: 'idle', message: '' });
  }

  function changeQuantity(id, difference) {
    setCart((current) => current
      .map((item) => item.id === id ? { ...item, quantity: item.quantity + difference } : item)
      .filter((item) => item.quantity > 0));
  }

  async function placeOrder(event) {
    event.preventDefault();
    if (!customerName.trim() || cart.length === 0) return;

    setStatus({ type: 'loading', message: 'Placing your order…' });
    try {
      const order = await createOrder({
        customerName: customerName.trim(),
        restaurantName: [...new Set(cart.map((item) => item.restaurant))].join(', '),
        items: cart.flatMap((item) => Array(item.quantity).fill(item.name)),
        totalAmount: total
      });
      setCart([]);
      setStatus({
        type: 'success',
        message: `Order ${order.id.slice(0, 8)} confirmed for ${order.customerName}.`
      });
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
    }
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Crave home"><span>C</span>Crave</a>
        <nav aria-label="Primary navigation">
          <a href="#menu">Menu</a>
          <a href="#how-it-works">How it works</a>
        </nav>
        <a className="cart-pill" href="#cart">Cart <strong>{cart.reduce((sum, item) => sum + item.quantity, 0)}</strong></a>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow">Fast. Fresh. Reactive.</p>
            <h1>Good food,<br /><em>right now.</em></h1>
            <p>Pick your favourites and watch your cart update instantly. Your order is handled by our reactive Spring WebFlux API.</p>
            <a className="primary-button" href="#menu">Explore the menu <span>→</span></a>
          </div>
          <div className="hero-art" aria-label="Fresh meal illustration">
            <div className="orbit orbit-one">🌶️</div>
            <div className="orbit orbit-two">🌿</div>
            <div className="plate">🍲</div>
            <div className="rating-card"><strong>4.8 ★</strong><span>2k+ happy foodies</span></div>
          </div>
        </section>

        <section className="menu-section" id="menu">
          <div className="section-heading">
            <div><p className="eyebrow">CURATED FOR YOU</p><h2>What are you craving?</h2></div>
            <label className="search"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search dishes" /></label>
          </div>

          <div className="categories" aria-label="Food categories">
            {categories.map((item) => (
              <button className={category === item ? 'active' : ''} onClick={() => setCategory(item)} key={item}>{item}</button>
            ))}
          </div>

          <div className="menu-grid">
            {visibleMenu.map((item) => (
              <article className="food-card" key={item.id}>
                <div className={`food-visual food-${item.id}`}><span>{item.icon}</span><small>{item.time}</small></div>
                <div className="food-info">
                  <p>{item.restaurant}</p><h3>{item.name}</h3>
                  <div className="food-meta"><span>★ {item.rating}</span><strong>₹{item.price}</strong></div>
                  <button onClick={() => addItem(item)}>Add to cart <span>+</span></button>
                </div>
              </article>
            ))}
          </div>
          {visibleMenu.length === 0 && <p className="empty-state">No dishes found. Try another search.</p>}
        </section>

        <section className="order-section" id="cart">
          <div className="order-intro">
            <p className="eyebrow">YOUR ORDER</p><h2>Ready when you are.</h2>
            <p>Your selections, quantities and total respond immediately—no page reload required.</p>
          </div>
          <form className="cart" onSubmit={placeOrder}>
            {cart.length === 0 ? (
              <div className="empty-cart"><span>🛍️</span><strong>Your cart is waiting</strong><p>Add something delicious from the menu.</p></div>
            ) : cart.map((item) => (
              <div className="cart-row" key={item.id}>
                <span className="cart-icon">{item.icon}</span>
                <div><strong>{item.name}</strong><small>₹{item.price} each</small></div>
                <div className="quantity"><button type="button" onClick={() => changeQuantity(item.id, -1)}>−</button><span>{item.quantity}</span><button type="button" onClick={() => changeQuantity(item.id, 1)}>+</button></div>
                <strong>₹{item.price * item.quantity}</strong>
              </div>
            ))}

            {cart.length > 0 && <>
              <div className="total"><span>Total</span><strong>₹{total}</strong></div>
              <label className="name-field">Name for the order<input required value={customerName} onChange={(event) => setCustomerName(event.target.value)} placeholder="Your name" /></label>
              <button className="checkout" disabled={status.type === 'loading'}>{status.type === 'loading' ? 'Placing order…' : `Place order · ₹${total}`}</button>
            </>}
            {status.message && <p className={`notice ${status.type}`} role="status">{status.message}</p>}
          </form>
        </section>

        <section className="steps" id="how-it-works">
          <div><span>01</span><h3>Choose</h3><p>Browse a focused menu.</p></div>
          <div><span>02</span><h3>Order</h3><p>Your cart updates instantly.</p></div>
          <div><span>03</span><h3>Enjoy</h3><p>WebFlux processes the request.</p></div>
        </section>
      </main>

      <footer><a className="brand" href="#top"><span>C</span>Crave</a><p>Reactive food ordering · DevOps demonstration</p></footer>
    </div>
  );
}
