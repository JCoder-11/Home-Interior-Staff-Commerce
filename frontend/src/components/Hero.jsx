import './Hero.css'

export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero__text">
        <p className="hero__eyebrow">STAFF COMMERCE, SIMPLIFIED</p>
        <h1>SELL FASTER <span>SERVE BETTER</span></h1>
        <p className="hero__desc">
          A mobile workspace for sales teams to browse products, build customer
          orders and send every sale to admin in real time
        </p>
        <div className="hero__buttons">
          <a href="/login" className="btn btn--dark">Start Selling →</a>
          <a href="/login" className="btn btn--outline">Login</a>
        </div>
      </div>

      <div className="hero__visual">
  <div className="hero__phone-wrap">
    <img src="/images/phone.png" alt="Staff Commerce app preview" className="hero__phone" />
    <span className="badge badge--dark">Move with the floor</span>
    <span className="badge badge--orange">Built For Sales</span>
  </div>
</div>


    </section>
  )
}