# Kerangka Desain Landing Page — Identitas Website

## 1. Gambaran Umum

-   **Nama website:** Gunakan nama/brand website yang sudah ada pada proyek (Web 3).
-   **Tujuan:** Mengikuti fungsi dan konten utama website yang sudah ada pada proyek.
-   **Identitas website:** Gunakan logo, nama, dan brand Web 3 yang sudah tersedia pada proyek.
-   **Identitas tambahan:** Jangan menambahkan nama sekolah atau tahun angkatan.
-   **Bahasa antarmuka saat ini:** Inggris
-   **Karakter desain:** Modern, elegan, minimalis, dan konsisten dengan identitas website.

## 2. Arah Visual dan Design System

### Tema

-   Gunakan tampilan dan mode warna yang konsisten dengan identitas Web 3.
-   Latar belakang gelap dengan kontras teks yang jelas.
-   Foto berukuran besar sebagai elemen visual utama.
-   Sudut komponen membulat, garis pembatas tipis, serta efek
    transparansi dan blur pada navigasi.
-   Animasi ringan saat hover dan saat pengguna menggulir halaman.

### Palet Warna

Gunakan palet Color Hunt berikut:

| Token | Warna | Penggunaan |
|---|---|---|
| Background | `#F5F5F5` | Latar belakang utama |
| Surface Soft | `#DFF1F1` | Latar bagian atau kartu sekunder |
| Accent Soft | `#BBD5DA` | Border dan elemen pendukung |
| Primary Accent | `#FF0000` | Tombol utama, tautan aktif, dan aksen penting |

Sumber: [Color Hunt](https://colorhunt.co/palette/f5f5f5dff1f1bbd5daff0000).

### Tipografi

-   **Plus Jakarta Sans:** teks antarmuka, navigasi, dan paragraf.
-   **Playfair Display:** judul utama dan heading yang ingin terlihat
    elegan.
-   **Caveat:** tulisan dekoratif atau handwriting.
-   **Material Symbols Outlined:** ikon antarmuka.

### Prinsip Layout

-   Kontainer konten terpusat dengan lebar maksimum sekitar `1280px`.
-   Padding horizontal konsisten.
-   Jarak antarseksi cukup luas agar tampilan terasa lega.
-   Layout responsif untuk desktop, tablet, dan perangkat seluler.
-   Foto menggunakan `object-fit: cover` agar area gambar terisi dengan
    baik.

## 3. Struktur Halaman

### A. Header / Navigasi

**Posisi:** Tetap di bagian atas (*fixed header*).

**Bagian kiri** - Logo/ikon Web 3. - Nama website sesuai brand yang sudah ada. - Subjudul opsional sesuai deskripsi website.

**Bagian tengah** - Home - Gallery - Videos - Our Website - About

**Bagian kanan** - Tombol **Explore** dengan ikon galeri. - Tombol
mengarah ke bagian Gallery.

**Gaya visual** - Latar transparan dengan efek blur. - Garis pembatas
tipis di bagian bawah. - Navigasi aktif diberi aksen warna biru muda. -
Pada layar kecil, navigasi desktop disembunyikan dan perlu diganti
dengan menu responsif.

### B. Hero Section / Home

**ID bagian:** `home`

**Tujuan:** Memperkenalkan identitas, fungsi, dan konten utama website.

**Elemen konten** - Visual utama yang relevan dengan website. - Overlay bila diperlukan agar teks terbaca. - Label kecil menggunakan nama/brand Web 3. - Judul dan deskripsi menjelaskan fungsi website. - Tombol utama mengarah ke fitur atau konten terpenting. - Tombol sekunder mengarah ke fitur lain yang memang tersedia. - Indikator scroll opsional.

**Gaya visual** - Judul besar, menggunakan tipografi serif. - Kata
`Story` diberi aksen biru muda dan gaya italic. - Konten teks rata
kiri. - Foto latar diberi sedikit efek grayscale dan kontras. - Hero
menggunakan tinggi yang dominan agar terasa sinematik.

### C. Gallery Section

**ID bagian:** `gallery`

**Tujuan:** Menampilkan dokumentasi foto dan video secara visual dan
mudah dijelajahi.

**Heading** - Label: `OUR GALLERY` - Judul: **Moments in Our Journey.**

**Filter kategori** - All - Moments - Photos - Videos

**Layout galeri** - Grid asimetris dengan ukuran kartu bervariasi. -
Beberapa kartu memanjang secara vertikal, sementara kartu lainnya
melebar secara horizontal. - Setiap kartu menampilkan gambar sebagai
fokus utama. - Overlay gradasi gelap di bagian bawah gambar. - Label
kategori ditampilkan dalam badge kecil dengan latar transparan. - Efek
hover: gambar membesar secara halus.

**Aksi tambahan** - Tombol **View More** dengan ikon panah. - Tombol
dapat digunakan untuk membuka lebih banyak dokumentasi.

**Catatan implementasi** - Filter kategori perlu berfungsi, bukan hanya
menjadi dekorasi. - Tombol View More perlu terhubung dengan mekanisme
pemuatan data tambahan atau halaman galeri lengkap. - Gambar sebaiknya
menggunakan aset asli website.

### D. Our Story Section

**ID bagian:** `story`

**Tujuan:** Menceritakan perjalanan dan kedekatan pengguna website, bukan
hanya menampilkan dokumentasi visual.

**Elemen konten** - Foto latar berupa suasana kebersamaan atau perayaan
kelulusan. - Overlay gelap agar teks tetap mudah dibaca. - Label:
`OUR STORY`. - Judul: \> More Than Just a Class. - Paragraf: \> We came
as strangers, grew as friends, and created memories that will stay with
us long after the last day. Every laughter, challenge, and milestone
made us family. - Tombol: **About Our Website** → menuju About. - Dekorasi
tulisan tangan: \> Thank you for the memories

**Layout** - Dua kolom pada layar besar. - Kolom kiri berisi judul,
cerita, dan tombol. - Kolom kanan berisi tulisan dekoratif. - Pada layar
kecil, kedua kolom ditumpuk secara vertikal.

### E. Footer / About

**ID bagian:** `about`

**Tujuan:** Menutup halaman dengan identitas website, navigasi
tambahan, dan tautan sosial.

**Bagian kiri** - Logo/ikon Web 3. - Nama website sesuai identitas brand yang sudah ada.

**Bagian tengah** - Home - Gallery - Videos - Our Website - About

**Bagian kanan** - Tagline atau deskripsi singkat sesuai identitas Web 3.

**Bagian bawah** - Copyright:
`© [Tahun] [Nama Website]. All rights reserved.` - Ikon atau tautan: -
YouTube - Instagram - External Link

**Catatan implementasi** - Ganti tautan sosial placeholder dengan URL
yang benar. - Hapus tautan yang belum digunakan atau arahkan ke tujuan
yang sesuai.

## 4. Alur Navigasi

1.  Pengunjung membuka halaman pada Hero Section.
2.  Pengunjung dapat memilih **Explore Memories** atau **Explore** untuk
    menuju Gallery.
3.  Pengunjung menjelajahi dokumentasi berdasarkan kategori.
4.  Pengunjung dapat memilih **Watch Film** untuk menuju bagian Videos.
5.  Pengunjung membaca informasi website pada Our Story.
6.  Pengunjung melihat identitas dan tautan sosial pada Footer.

## 5. Interaksi dan Animasi

-   *Smooth scrolling* ketika navigasi diklik.
-   Header tetap terlihat ketika halaman digulir.
-   Warna navigasi berubah saat hover.
-   Tombol memiliki transisi warna dan sedikit efek naik ketika hover.
-   Gambar galeri memiliki efek zoom ringan ketika hover.
-   Indikator scroll memiliki animasi gerak vertikal.
-   Perubahan tema terang/gelap dapat digunakan jika fitur tersebut
    memang disediakan; desain sumber menempatkan mode gelap sebagai tema
    utama.

## 6. Responsivitas

-   **Desktop:** navigasi horizontal dan galeri grid asimetris.
-   **Tablet:** ukuran heading, jarak, dan jumlah kolom disesuaikan.
-   **Mobile:** navigasi desktop diganti menu mobile; konten menjadi
    satu kolom; tombol dapat membungkus ke baris berikutnya; kartu
    galeri disusun agar tetap mudah dibaca dan disentuh.
-   Pastikan teks tetap terbaca di atas foto pada semua ukuran layar.

## 7. Kebutuhan Konten dan Aset

-   Logo atau ikon identitas Web 3.
-   Visual utama/hero yang sesuai dengan brand Web 3.
-   Aset gambar atau ilustrasi yang relevan dengan konten website.
-   Video atau media pendukung jika tersedia.
-   Deskripsi atau informasi utama website.
-   Tautan Instagram, YouTube, dan tautan eksternal yang valid.

## 8. Komponen yang Perlu Diimplementasikan

-   [ ] Header dan navigasi anchor.
-   [ ] Hero section dengan foto latar dan overlay.
-   [ ] Tombol Explore Memories.
-   [ ] Tombol Watch Film dan section Videos.
-   [ ] Galeri foto/video.
-   [ ] Filter kategori galeri yang berfungsi.
-   [ ] Tombol View More atau halaman galeri lengkap.
-   [ ] Section Our Story.
-   [ ] Footer dengan tautan sosial.
-   [ ] Tampilan responsif.
-   [ ] Status hover, fokus keyboard, dan interaksi tombol.
-   [ ] Optimasi ukuran gambar dan loading.
-   [ ] Teks alternatif (`alt`) untuk gambar.

## 9. Catatan Penting

-   Navigasi **Videos** tersedia pada header dan footer, tetapi bagian
    dengan ID `videos` belum tampak pada struktur sumber yang diberikan.
    Bagian video perlu dibuat atau tautannya disesuaikan.
-   Desain sumber menggunakan gambar contoh dari URL eksternal. Ganti
    dengan aset asli agar sesuai dengan konten website.
-   Pastikan semua tombol dan tautan mengarah ke tujuan yang benar.
-   Pertahankan kontras warna yang cukup dan ukuran teks yang nyaman
    dibaca.
-   Jangan menggunakan identitas sekolah/angkatan. Pertahankan nama, logo, warna, dan konten brand Web 3 yang sudah ada di proyek.
