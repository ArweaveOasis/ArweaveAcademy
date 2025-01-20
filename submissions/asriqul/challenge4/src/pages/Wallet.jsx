import React, { useState } from 'react';
import Arweave from 'arweave';
import { Buffer } from 'buffer';
import * as bip39 from 'bip39';

// Menambahkan Buffer ke window object
window.Buffer = window.Buffer || Buffer;

const Wallets = () => {
    const [wallet, setWallet] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const arweave = new Arweave({
        host: 'arweave.net',
        port: 443,
        protocol: 'https'
    });

    const generateMnemonic = () => {
        try {
            return bip39.generateMnemonic();
        } catch (err) {
            console.error('Error generating mnemonic:', err);
            throw err;
        }
    };

    const createWallet = async () => {
        try {
            setLoading(true);
            setError(null);

            const key = await arweave.wallets.generate();
            const address = await arweave.wallets.jwkToAddress(key);
            const mnemonic = generateMnemonic();

            setWallet({
                address: address,
                mnemonic: mnemonic,
                key: key
            });
        } catch (error) {
            console.error('Error creating wallet:', error);
            setError('Failed to create wallet. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Arweave Wallet Generator</h1>
            <p className="mb-4">Create your Arweave wallet with a single click.</p>

            <button
                onClick={createWallet}
                disabled={loading}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            >
                {loading ? 'Generating...' : 'Create New Wallet'}
            </button>

            {error && (
                <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                </div>
            )}

            {wallet && (
                <div className="mt-4 p-4 border border-gray-300 rounded-lg">
                    <h2 className="text-xl font-bold mb-2">New Wallet Generated</h2>
                    <div className="space-y-2">
                        <p><strong>Address:</strong> {wallet.address}</p>
                        <p><strong>Mnemonic:</strong> {wallet.mnemonic}</p>
                    </div>
                    <p className="mt-4 text-red-500 text-sm">
                        <strong>Important: Save your mnemonic phrase in a secure location.
                            It cannot be recovered if lost!</strong>
                    </p>
                </div>
            )}
        </div>
    );
};

export default Wallets;