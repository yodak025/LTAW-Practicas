import { createRoot } from 'react-dom/client'
import './index.css'
import './App.css'
import Layout from './components/Layout';

const AboutUs = () => {
    return (
        <Layout>
            <h1>Sobre nosotros</h1>
            <h2>Work in progress</h2>
        </Layout>
    )
}

createRoot(document.getElementById('root')).render(
    <AboutUs />
)
