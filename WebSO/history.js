// Fungsi untuk memformat angka ke format Rupiah
function formatRupiah(angka) {
    return "Rp " + angka.toLocaleString("id-ID").replace(/(\.|,00)$/g, "");
  }
  
  // Fungsi untuk memuat riwayat transaksi
  function loadTransactionHistory() {
    const historyTable = document.getElementById("transaction-history").getElementsByTagName("tbody")[0];
    const storedHistory = JSON.parse(localStorage.getItem("transactionHistory")) || [];
  
    storedHistory.forEach(transaction => {
      const row = document.createElement("tr");
  
      row.innerHTML = `
        <td>${transaction.id}</td>
        <td>${transaction.itemCount}</td>
        <td>${formatRupiah(transaction.total)}</td>
        <td>${transaction.date}</td>
        <td>${transaction.method}</td>
      `;
  
      historyTable.appendChild(row);
    });
  }
  
  // Panggil fungsi saat halaman dimuat
  document.addEventListener("DOMContentLoaded", loadTransactionHistory);

  
  // Fungsi untuk memformat angka ke format Rupiah
function formatRupiah(angka) {
    return "Rp " + angka.toLocaleString("id-ID").replace(/(\.|,00)$/g, "");
  }
  
  // Fungsi untuk memuat riwayat transaksi
  function loadTransactionHistory() {
    const historyTable = document.getElementById("transaction-history").getElementsByTagName("tbody")[0];
    const storedHistory = JSON.parse(localStorage.getItem("transactionHistory")) || [];
  
    if (storedHistory.length === 0) {
      const emptyRow = document.createElement("tr");
      emptyRow.innerHTML = `<td colspan="6" style="text-align: center;">Belum ada transaksi</td>`;
      historyTable.appendChild(emptyRow);
      return;
    }
  
    storedHistory.forEach(transaction => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${transaction.id}</td>
        <td>${transaction.itemCount}</td>
        <td>${formatRupiah(transaction.total)}</td>
        <td>${transaction.date}</td>
        <td>${transaction.method}</td>
        <td>
          <button class="copy-button" onclick="copyToClipboard('${transaction.id}')">
            Salin
          </button>
        </td>
      `;
      historyTable.appendChild(row);
    });
  }
  
  // Fungsi untuk menyalin Invoice ID ke clipboard
  function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
      alert("Invoice ID disalin ke clipboard!");
    }).catch(err => {
      console.error("Gagal menyalin: ", err);
    });
  }
  
  // Panggil fungsi saat halaman dimuat
  document.addEventListener("DOMContentLoaded", loadTransactionHistory);
  
// Fungsi untuk membuka modal tracking
function openTrackingModal() {
  const modal = document.getElementById("tracking-modal");
  modal.style.display = "flex";
}

// Fungsi untuk menutup modal tracking
function closeTrackingModal() {
  const modal = document.getElementById("tracking-modal");
  modal.style.display = "none";
}

// Fungsi untuk melacak transaksi berdasarkan Invoice ID
function trackTransaction() {
  const trackingInput = document.getElementById("tracking-input").value.trim();
  const trackingStatus = document.getElementById("tracking-status");
  const storedHistory = JSON.parse(localStorage.getItem("transactionHistory")) || [];

  if (trackingInput === "") {
    trackingStatus.innerText = "Masukkan Invoice ID untuk melacak transaksi.";
    trackingStatus.style.color = "red";
    return;
  }

  const transaction = storedHistory.find(item => item.id === trackingInput);

  if (transaction) {
    trackingStatus.innerHTML = `
      <p>Invoice ID ditemukan!</p>
      <p><strong>Status Transaksi:</strong></p>
      <p>Invoice ID: ${transaction.id}</p>
      <p>Jumlah Barang: ${transaction.itemCount}</p>
      <p>Total Harga: ${formatRupiah(transaction.total)}</p>
      <p>Tanggal: ${transaction.date}</p>
      <p>Metode Pembayaran: ${transaction.method}</p>
    `;
    trackingStatus.style.color = "green";
  } else {
    trackingStatus.innerText = "Invoice invalid.";
    trackingStatus.style.color = "red";
  }
}

// Event listener untuk membuka modal saat ikon search ditekan
document.getElementById("search-button").addEventListener("click", openTrackingModal);
// Fungsi untuk membuka modal unduhan
function openDownloadModal() {
  const modal = document.getElementById("download-modal");
  modal.style.display = "flex";
}

// Fungsi untuk menutup modal unduhan
function closeDownloadModal() {
  const modal = document.getElementById("download-modal");
  modal.style.display = "none";
}

// Fungsi untuk menangani unduhan dan tindakan
function handleDownload() {
  const fileFormat = document.querySelector('input[name="file-format"]:checked').value;
  const postAction = document.querySelector('input[name="post-action"]:checked').value;

  const storedHistory = JSON.parse(localStorage.getItem("transactionHistory")) || [];
  if (storedHistory.length === 0) {
    alert("Tidak ada data untuk diunduh.");
    closeDownloadModal();
    return;
  }

  // Unduh sesuai format yang dipilih
  if (fileFormat === "pdf") {
    downloadHistoryPDF();
  } else if (fileFormat === "excel") {
    downloadHistoryExcel();
  }

  // Tindakan setelah unduhan
  if (postAction === "clear") {
    localStorage.removeItem("transactionHistory");
    alert("Data telah dihapus setelah unduhan.");
    location.reload(); // Muat ulang halaman untuk memperbarui tabel
  } else {
    alert("Data tetap disimpan setelah unduhan.");
  }

  closeDownloadModal();
}

// Fungsi untuk mengunduh PDF
function downloadHistoryPDF() {
  const storedHistory = JSON.parse(localStorage.getItem("transactionHistory")) || [];
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text("Riwayat Transaksi Anda", 10, 10);

  let y = 20;
  storedHistory.forEach((transaction, index) => {
    doc.setFontSize(12);
    doc.text(
      `${index + 1}. Invoice ID: ${transaction.id}, Barang: ${transaction.itemCount}, Total: ${formatRupiah(transaction.total)}, Metode: ${transaction.method}, Tanggal: ${transaction.date}`,
      10,
      y
    );
    y += 10;
    if (y > 280) {
      doc.addPage();
      y = 10;
    }
  });

  doc.save("Riwayat_Transaksi_BayarDisini.pdf");
}

// Fungsi untuk mengunduh Excel
function downloadHistoryExcel() {
  const storedHistory = JSON.parse(localStorage.getItem("transactionHistory")) || [];
  const worksheet = XLSX.utils.json_to_sheet(storedHistory);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Riwayat Transaksi Anda");
  XLSX.writeFile(workbook, "Riwayat_Transaksi_BayarDisini.xlsx");
}

// Tambahkan event listener untuk membuka modal unduhan
document.getElementById("download-button").addEventListener("click", openDownloadModal);

