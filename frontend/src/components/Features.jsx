import './Features.css'

const items = [
  { icon: '/images/icon-browse.png', title: 'Browse With Ease', text: 'Product flow built for any device' },
  { icon: '/images/icon-chart.png', title: 'See The Full Picture', text: 'Admins see every order as it happens' },
  { icon: '/images/icon-team.png', title: 'One Team, One Rhythm', text: 'Keep your staff moving together' },
]

export default function Features() {
  return (
    <section className="features">
      {items.map((item) => (
        <div className="feature" key={item.title}>
          <img src={item.icon} alt="" />
          <div>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </div>
        </div>
      ))}
    </section>
  )
}