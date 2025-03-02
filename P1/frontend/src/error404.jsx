import { createRoot } from 'react-dom/client'
import './index.css'
import './App.css'
import Layout from './components/Layout';

const Error404 = () => {
    return (
        <Layout>
            <h1>404</h1>
            <h2>Página no encontrada</h2>
        </Layout>
    )
}

createRoot(document.getElementById('root')).render(
    <Error404 />
)
