import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom"
import './index.css';
import App from './App';
import Blocks from './components/Blocks';
import ConductTransaction from './components/ConductTransaction';
import TransactionPool from './components/TransactionPool';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <Routes>
            <Route exact={true} path="/" element={<App />} />
            <Route path="/blocks" element={<Blocks />} />
            <Route path="/conduct-transaction" element={<ConductTransaction />} />
            <Route path="/transaction-pool" element={<TransactionPool />} />
        </Routes>
    </BrowserRouter>
);
