import { Link } from 'react-router-dom'
import { ShoppingBag } from 'lucide-react'
import './HowItWorks.css'

const steps = [
  {
    number: '01',
    title: 'Browse Instantly',
    text: 'Scan or search products on any device. Real-time stock and prices at your fingertips.',
    image: '/images/step-1-products.png',
    alt: 'Products screen with search, categories and product cards',
  },
  {
    number: '02',
    title: 'Build the Order',
    text: 'Add items, adjust quantities, add notes. Cart updates live.',
    image: '/images/step-2-order.png',
    alt: 'Order screen with items, a note field and the order total',
  },
  {
    number: '03',
    title: 'Send to Admin',
    text: 'One tap sends the order to the floor admin in real time. No more shouting across the shop.',
    image: '/images/step-3-sent.png',
    alt: 'Order sent confirmation screen',
  },
  {
    number: '04',
    title: 'Serve & Track',
    text: 'Admin confirms, staff get notified, customer is happy. Full visibility for everyone.',
    image: '/images/step-4-track.png',
    alt: 'Order status tracking screen',
  },
]

export default function HowItWorks() {
  return (
    <div className="how">
      <div className="how__inner">
        <header className="how__header">
          <h1>How It Works</h1>
          <p className="how__tagline">From floor to checkout in four simple moves</p>
          <p className="how__intro">
            Home Interior streamlines the sales process so your team can move fast,
            sell more, and keep customers happy.
          </p>
        </header>

        <ol className="steps">
          {steps.map((step) => (
            <li className="step" key={step.number}>
              <div className="step__text">
                <span className="step__number">{step.number}</span>
                <h2>{step.title}</h2>
                <p>{step.text}</p>
              </div>
              <img
                className="step__phone"
                src={step.image}
                alt={step.alt}
                loading="lazy"
              />
            </li>
          ))}
        </ol>

        <section className="cta">
          <div className="cta__icon">
            <ShoppingBag size={30} />
          </div>
          <div className="cta__text">
            <h3>Ready to sell faster?</h3>
            <p>Join teams already closing more deals with Home Interior.</p>
          </div>
          <div className="cta__buttons">
            <Link to="/signup" className="cta__btn cta__btn--primary">Start Selling</Link>
            <Link to="/login" className="cta__btn cta__btn--outline">Login</Link>
          </div>
        </section>
      </div>
    </div>
  )
}