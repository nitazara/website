/* ----------------------------------------------------------
   1. IMPORT FIREBASE (HARUS DI BARIS PALING ATAS FILE)
-----------------------------------------------------------*/
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import {
    getFirestore,
    collection,
    addDoc,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

/* ----------------------------------------------------------
   2. KONFIGURASI FIREBASE (DATA DARI PROJECT KAMU)
-----------------------------------------------------------*/
const firebaseConfig = {
    apiKey: "AIzaSyCKynqkMJZsHDz_osjbJiuZGVq_UTYNCv0",
    authDomain: "marketplace-a1d2e.firebaseapp.com",
    projectId: "marketplace-a1d2e",
    storageBucket: "marketplace-a1d2e.appspot.com",
    messagingSenderId: "18035659112",
    appId: "1:18035659112:web:2f3beac521e7d48f5cc6dd",
    measurementId: "G-6S19EBLSVN"
};

// INISIASI FIREBASE
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/* ----------------------------------------------------------
   3. FUNGSI FORMAT RUPIAH
-----------------------------------------------------------*/
const rupiah = (number) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(number);

/* ----------------------------------------------------------
   4. INISIALISASI ALPINE STORE (PRODUK + CART)
-----------------------------------------------------------*/
document.addEventListener('alpine:init', () => {

    // STORE PRODUK
    Alpine.store('produk', {
        items: [
            { id: 1, name: 'Anting', asset: 'anting.png', price: 10000, deskripsi: 'anting emas spesial', stok: 10 },
            { id: 2, name: 'Kalung', asset: 'kalung.png', price: 15000, deskripsi: 'kalung elegan', stok: 5 },
            { id: 3, name: 'Kosong', asset: 'profileDefault.png', price: 12000, deskripsi: 'produk default', stok: 9 }
        ],
    });

    // STORE KERANJANG
    Alpine.store('cart', {
        items: [],
        totalHarga: 0,
        jumlah: 0,
        isOpen: false,

        updateTotal() {
            this.totalHarga = this.items.reduce((t, it) => t + (it.price * it.quantity || 0), 0);
            this.jumlah = this.items.reduce((t, it) => t + (it.quantity || 0), 0);
        },

        add(newItem) {
            const cartItem = this.items.find(it => it.id === newItem.id);
            if (cartItem) cartItem.quantity++;
            else this.items.push({ ...newItem, quantity: 1 });
            this.updateTotal();
        },

        remove(id) {
            const cartItem = this.items.find(it => it.id === id);
            if (!cartItem) return;
            cartItem.quantity--;
            if (cartItem.quantity <= 0) this.items = this.items.filter(it => it.id !== id);
            this.updateTotal();
        },

        toggleOpen() {
            this.isOpen = !this.isOpen;
        }
    });

    // SETELAH STORE TERBENTUK, LOAD PRODUK DARI FIREBASE
    loadProduk();
});

/* ----------------------------------------------------------
   5. FUNGSI LOAD PRODUK DARI FIREBASE
-----------------------------------------------------------*/
async function loadProduk() {
    try {
        const snapshot = await getDocs(collection(db, "produk"));

        // KOSONGKAN DULU AGAR TIDAK DUPLIKAT
        Alpine.store('produk').items = [];

        snapshot.forEach(doc => {
            // MASUKKAN DATA DARI FIRESTORE KE STORE PRODUK
            Alpine.store('produk').items.push({
                id: doc.id,
                ...doc.data()
            });
        });

        console.log("Produk berhasil dimuat.");
    } catch (err) {
        console.error("loadProduk error:", err);
    }
}

/* ----------------------------------------------------------
   6. FORM TAMBAH PRODUK → SIMPAN KE FIREBASE
-----------------------------------------------------------*/
document.getElementById('formisi').addEventListener('submit', async function (e) {
    e.preventDefault();

    // AMBIL FILE GAMBAR
    const fileInput = document.getElementById('gambar');
    const file = fileInput?.files?.[0];

    // AMBIL DATA INPUT
    let name = document.getElementById('namaProduk').value;
    let price = Number(document.getElementById('harga').value);
    let deskripsi = document.getElementById('deskripsi').value;
    let stok = Number(document.getElementById('stok').value);

    // BACA GAMBAR SEBAGAI BASE64
    let imageURL = null;

    if (file) {
        const reader = new FileReader();
        imageURL = await new Promise((resolve, reject) => {
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    // SIMPAN PRODUK KE FIRESTORE
    try {
        await addDoc(collection(db, "produk"), {
            name,
            price,
            asset: imageURL,
            deskripsi,
            stok
        });

        alert("Produk berhasil ditambahkan ✔");

        // REFRESH DATA PRODUK SETELAH MENAMBAH
        await loadProduk();

        this.reset();

    } catch (err) {
        console.error("Gagal menambah produk:", err);
        alert("Terjadi kesalahan saat menambah produk.");
    }
});

/* ----------------------------------------------------------
   7. TOMBOL TAMPILKAN FORM TAMBAH PRODUK
-----------------------------------------------------------*/
const formisi = document.querySelector('#formisi');
const tambahproduk = document.querySelector('#tambahProduk');
if (tambahproduk && formisi) {
    tambahproduk.onclick = function () {
        formisi.style.display = 'block';
    };
}
/* ----------------------------------------------------------
   8. CHECKOUT / BELI (VERSI SEDERHANA)
-----------------------------------------------------------*/
const beliBtn = document.querySelector('.beli');
const formbeli = document.querySelector('#datapembeli');

if (beliBtn && formbeli) {
    beliBtn.addEventListener('click', function (e) {
        e.preventDefault();
        alert("Terima kasih, order diproses (simulasi).");
    });
}
// // 7) pembelian (WA) — perbaiki sedikit handler supaya tidak crash bila form kosong
// const beliBtn = document.querySelector('.beli');
// const formbeli = document.querySelector('#datapembeli');
// if (beliBtn && formbeli) {
//     beliBtn.addEventListener('click', function (e) {
//         e.preventDefault();
//         try {
//             const formData = new FormData(formbeli);
//             const data = Object.fromEntries(formData.entries());
//             // parsing items (string) jika perlu
//             alert('Terimakasih, order sudah diproses (simulasi).');
//         } catch (err) {
//             console.error(err);
//             alert('Gagal memproses pembelian.');
//         }
//     });
// }
// const beli = document.querySelector('.beli');
// //beli.disabled = true;
// formbeli.addEventListener('keyup', function () {
//     for (let i = 0; i < formbeli.elements.length; i++) {
//         if (formbeli.elements[i].value.length != 0) {
//             checkoutButton.classList.remove('disabled');
//             checkoutButton.classList.add('disabled');
//         } else {
//             return false;
//         }

//     }
//     beli.disabled = false;
//     beli.classList.remove('disabled');
// });

// // document.querySelector('#tutupKeranjang').onclick = function () {
// //     document.querySelector('.keranjang').style.display = 'none';
// // }
// beli.addEventListener('click', function (e) {
//     e.preventDefault();
//     const formData = new FormData(formbeli);
//     const data = new URLSearchParams(formData);
//     const objData = Object.fromEntries(data);
//     const message = formatMessage(objData);
//     window.open('https://wa.me/\${cart.item.nomor_telfon}' + objData.phone + '?text=' + encodeURIComponent(message));
//     alert('terimakasih telah berbelanja di toko kami');
// });
// const formatMessage = (obj) => {
//     return `Data Pembeli
//     Nama: ${obj.name}
//     Total Pembayaran: ${rupiah(obj.total)}
//     Alamat: ${obj.address}
//     Nomor Telfon: ${obj.phone}
// Data Pesanan
//     ${JSON.parse(obj.items).map((item) => ` ${item.name} (${item.quantity}) x ${rupiah(item.totalHarga)}`).join('\n')}
// TOTAL: ${rupiah(obj.totalHarga)}
// terimakasih.`;
// };
