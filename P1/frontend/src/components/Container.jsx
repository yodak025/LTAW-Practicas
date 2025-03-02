import './Container.css'

export default function Container({children, className}) {
  return (
    <section className={`${className} os-container`}>
      {children}
    </section>
  )
}