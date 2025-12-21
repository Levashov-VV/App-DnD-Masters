import { BrowserRouter } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import './style.css';
import { Routing } from './app/providers/routes/index.tsx';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <BrowserRouter>
    <Routing />
  </BrowserRouter>
);
