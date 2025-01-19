const fs = require('fs');
const Bundlr = require('@bundlr-network/client').default;
const path = require('path');

// Path ke file wallet.json Anda
const walletPath = './wallet.json';
const fileToUpload = './source/_posts/index.md'; // Ganti dengan file yang ingin diupload

// Membaca wallet.json untuk mendapatkan kunci privat
const wallet = JSON.parse(fs.readFileSync(walletPath, 'utf8'));

// Membaca konten file yang akan diupload
const fileContent = fs.readFileSync(fileToUpload);

// Menginisialisasi Bundlr menggunakan wallet dan jaringan Arweave
const bundlr = new Bundlr('https://node1.bundlr.network', 'arweave', wallet);

// Fungsi untuk mengupload file ke Arweave melalui Bundlr
async function uploadFile() {
    try {
        console.log('Mulai upload file...');
        const tx = await bundlr.createTransaction(fileContent, {
            name: path.basename(fileToUpload), // Nama file di Arweave
            tags: [
                { name: 'Content-Type', value: 'text/markdown' }, // Tag untuk jenis konten (sesuaikan jika perlu)
                { name: 'App-Name', value: 'Arweave Academy' }, // Tag tambahan (sesuaikan jika perlu)
            ]
        });

        console.log('File siap untuk diupload. Menyimpan transaksi...');
        
        // Menandatangani transaksi
        await tx.sign();

        // Menggunakan metode upload() untuk mengirimkan transaksi
        await tx.upload();
        console.log('Upload selesai! File berhasil diupload ke Arweave.');
        console.log(`File tersedia di: https://arweave.net/${tx.id}`);
    } catch (error) {
        console.error('Error saat upload file:', error);
    }
}

// Panggil fungsi untuk mengupload file
uploadFile();
