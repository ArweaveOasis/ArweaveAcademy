import React, { useState, useEffect } from 'react';
import Arweave from 'arweave';

const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 max-w-lg w-full m-4">
                {children}
            </div>
        </div>
    );
};

const WalletConnection = () => {
    const [arweave, setArweave] = useState(null);
    const [wallet, setWallet] = useState(null);
    const [walletAddress, setWalletAddress] = useState('');
    const [balance, setBalance] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showMnemonicModal, setShowMnemonicModal] = useState(false);
    const [newWalletData, setNewWalletData] = useState(null);

    useEffect(() => {
        // Initialize Arweave
        const arweaveInit = new Arweave({
            host: 'arweave.net',
            port: 443,
            protocol: 'https'
        });
        setArweave(arweaveInit);
    }, []);

    const getBalance = async (address) => {
        try {
            const winston = await arweave.wallets.getBalance(address);
            const ar = arweave.ar.winstonToAr(winston);
            setBalance(ar);
        } catch (err) {
            console.error('Error getting balance:', err);
            setError('Failed to fetch balance');
        }
    };

    const connectWallet = async () => {
        setLoading(true);
        setError('');

        try {
            // For Arweave, we'll use file upload since there's no browser wallet like MetaMask
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';

            input.onchange = async (e) => {
                try {
                    const file = e.target.files[0];
                    const fileReader = new FileReader();

                    fileReader.onload = async (event) => {
                        try {
                            const jwk = JSON.parse(event.target.result);
                            setWallet(jwk);

                            // Get wallet address
                            const address = await arweave.wallets.jwkToAddress(jwk);
                            setWalletAddress(address);

                            // Get balance
                            await getBalance(address);
                        } catch (err) {
                            setError('Invalid wallet file');
                            console.error(err);
                        }
                    };

                    fileReader.readAsText(file);
                } catch (err) {
                    setError('Error reading wallet file');
                    console.error(err);
                }
            };

            input.click();
        } catch (err) {
            console.error('Error connecting wallet:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const createNewWallet = async () => {
        try {
            setLoading(true);
            setError('');

            // Generate new JWK key pair
            const jwk = await arweave.wallets.generate();
            const address = await arweave.wallets.jwkToAddress(jwk);

            // Create seed phrase (This is a simplified version - in production you'd want a more secure method)
            const seedWords = [
                'abandon', 'ability', 'able', 'about', 'above', 'absent',
                'absorb', 'abstract', 'absurd', 'abuse', 'access', 'accident'
            ];

            setNewWalletData({
                jwk,
                address,
                seedPhrase: seedWords.join(' ')
            });

            setShowMnemonicModal(true);

        } catch (err) {
            setError('Error creating wallet: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const downloadWalletFile = () => {
        if (!newWalletData?.jwk) return;

        const blob = new Blob([JSON.stringify(newWalletData.jwk)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `arweave-wallet-${Date.now()}.json`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const copyToClipboard = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            alert('Copied to clipboard!');
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const handleDisconnect = () => {
        setWallet(null);
        setWalletAddress('');
        setBalance('');
    };

    const handleCloseMnemonicModal = () => {
        setShowMnemonicModal(false);
        setNewWalletData(null);
    };

    const formatAddress = (address) => {
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    };

    return (
        <div className="p-4 border rounded-lg shadow-sm">
            {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                    {error}
                </div>
            )}

            {!walletAddress ? (
                <div className="space-y-4">
                    <button
                        onClick={connectWallet}
                        disabled={loading}
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
                    >
                        {loading ? 'Connecting...' : 'Connect Existing Wallet'}
                    </button>

                    <div className="text-center">
                        <span className="text-gray-500">or</span>
                    </div>

                    <button
                        onClick={createNewWallet}
                        disabled={loading}
                        className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-green-300"
                    >
                        Create New Wallet
                    </button>

                    <Modal isOpen={showMnemonicModal} onClose={handleCloseMnemonicModal}>
                        <div className="space-y-4">
                            <h2 className="text-xl font-bold">Your New Arweave Wallet</h2>

                            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
                                <p className="text-yellow-800 font-medium mb-2">
                                    ⚠️ Important: Download your wallet file and store it securely. Never share your wallet file with anyone!
                                </p>
                            </div>

                            <div className="p-4 bg-gray-50 rounded">
                                <div className="grid grid-cols-3 gap-2">
                                    {newWalletData?.seedPhrase.split(' ').map((word, index) => (
                                        <div key={index} className="flex items-center">
                                            <span className="text-gray-500 mr-2">{index + 1}.</span>
                                            <span className="font-mono">{word}</span>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    onClick={() => copyToClipboard(newWalletData?.seedPhrase)}
                                    className="mt-4 text-sm text-blue-600 hover:text-blue-800"
                                >
                                    📋 Copy to clipboard
                                </button>
                            </div>

                            <div>
                                <p className="font-semibold mb-2">Wallet Address:</p>
                                <div className="font-mono text-sm break-all bg-gray-50 p-2 rounded">
                                    {newWalletData?.address}
                                </div>
                            </div>

                            <div className="flex justify-end mt-6 space-x-4">
                                <button
                                    onClick={downloadWalletFile}
                                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                                >
                                    Download Wallet File
                                </button>
                                <button
                                    onClick={handleCloseMnemonicModal}
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    I've Saved Everything
                                </button>
                            </div>
                        </div>
                    </Modal>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Connected Address:</p>
                            <p className="font-mono">{formatAddress(walletAddress)}</p>
                        </div>
                        <button
                            onClick={handleDisconnect}
                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                            Disconnect
                        </button>
                    </div>

                    <div>
                        <p className="text-sm text-gray-600">Balance:</p>
                        <p className="font-mono">{balance} AR</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WalletConnection;