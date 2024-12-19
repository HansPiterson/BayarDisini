let totalPrice = 0;
let items = [];
let transactionHistory = [];

// Fungsi untuk memformat angka ke format Rupiah
function formatRupiah(angka) {
  return "Rp " + angka.toLocaleString("id-ID").replace(/(\.|,00)$/g, "");
}

// Fungsi untuk menambahkan barang
function addItem() {
  const itemPrice = parseFloat(document.getElementById("item-price").value);
  if (!isNaN(itemPrice) && itemPrice > 0) {
    totalPrice += itemPrice;
    items.push(itemPrice);

    updateTotalPrice();
    displayItems();
    calculateChange();


    document.getElementById("item-price").value = ""; // Bersihkan input
  } else {
    alert("Masukkan harga barang yang valid!");
  }
}

// Fungsi untuk memperbarui total harga
function updateTotalPrice() {
  document.getElementById("total-price").innerText = formatRupiah(totalPrice);
}

// Fungsi untuk menampilkan daftar barang
function displayItems() {
  const itemList = document.getElementById("item-list");
  itemList.innerHTML = ""; // Hapus daftar lama
  items.forEach((item, index) => {
    const listItem = document.createElement("li");
    listItem.innerHTML = `
      Barang ${index + 1}: ${formatRupiah(item)}
      <button onclick="removeItem(${index})"><i class="fa-solid fa-trash"></i></button>
    `;
    itemList.appendChild(listItem);
  });
}


// Fungsi untuk menghitung kembalian
function calculateChange() {
  const payment = parseFloat(document.getElementById("payment").value);
  if (!isNaN(payment) && payment >= 0) {
    const change = payment - totalPrice;
    document.getElementById("change").innerText =
      change >= 0 ? formatRupiah(change) : "Pembayaran kurang";
  } else {
    document.getElementById("change").innerText = "Rp 0";
  }
}

// Event listener untuk menghitung kembalian secara real-time
document.getElementById("payment").addEventListener("input", calculateChange);


// Fungsi untuk menghapus barang
function removeItem(index) {
  totalPrice -= items[index];
  items.splice(index, 1);

  updateTotalPrice();
  displayItems();
  calculateChange();
}

// Fungsi untuk menyimpan transaksi ke localStorage
function saveTransactionToHistory(transaction) {
  const storedHistory = JSON.parse(localStorage.getItem("transactionHistory")) || [];
  storedHistory.push(transaction);
  localStorage.setItem("transactionHistory", JSON.stringify(storedHistory));
}

// Fungsi untuk menyelesaikan transaksi
function completeTransaction() {
  if (items.length === 0 || totalPrice === 0) {
    alert("Tidak ada transaksi yang dapat diselesaikan!");
    return;
  }

  const payment = parseFloat(document.getElementById("payment").value);
  if (isNaN(payment) || payment < totalPrice) {
    alert("Pembayaran tidak mencukupi!");
    return;
  }

  const selectedMethod = document.querySelector(
    'input[name="payment-method"]:checked'
  ).value;

  const transaction = {
    id: "INV-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
    total: totalPrice,
    itemCount: items.length,
    date: new Date().toLocaleString("id-ID"),
    method: selectedMethod,
  };

  // Simpan transaksi
  saveTransactionToHistory(transaction);

  // Tampilkan informasi pembayaran
  showPaymentInfo(transaction);

  // Reset data
  clearAll();

  // Redirect ke halaman history setelah 3 detik
  // setTimeout(() => {
  //   window.location.href = "history.html";
  // }, 3000);
}

// Fungsi untuk menampilkan modal informasi pembayaran
function showPaymentInfo() {
  const selectedMethod = document.querySelector(
    'input[name="payment-method"]:checked'
  ).value;

  const modal = document.getElementById("payment-info-modal");
  const title = document.getElementById("payment-method-title");
  const description = document.getElementById("payment-description");

  // Atur konten modal berdasarkan metode pembayaran
  if (selectedMethod === "CASH") {
    title.innerText = "Cash Payment";
    description.innerHTML = `
    <p>Total Pembayaran Anda Secara Tunai: </p>
    <h4>${document.getElementById("total-price").innerText}</h4>
    <p>Kembalian : </p>
    <h4>${document.getElementById("change").innerText}!</h4>
    <p>Silakan tunggu proses konfirmasi.</p>
    `;
  } else if (selectedMethod === "QRIS") {
    title.innerText = "QRIS Payment";
    description.innerHTML = `
      <p>Scan kode QRIS di bawah untuk menyelesaikan pembayaran:</p>
      <img src="images/CodeQris.jpg" alt="QRIS Code" style="width: 200px; margin: 10px 0;" />
      <p>Total Pembayaran: </p><h4>${document.getElementById("total-price").innerText}</h4>
    `;
  } else if (selectedMethod === "GOPAY" || selectedMethod === "DANA") {
    title.innerText = `${selectedMethod} Payment`;
    description.innerHTML = `
      <p>pembayaran melalui ${selectedMethod}.</p>
      <h4>NO : 082182085025</h4>

      
     <p>Total Pembayaran: </p><h4>${document.getElementById("total-price").innerText}</h4>
      <form>
        <label for="payment-proof" class="upload-label">Upload Bukti Pembayaran</label>
        <input type="file" id="payment-proof" accept="image/*" style="margin-top: 10px;" />
      </form>
    `;
  }

  modal.style.display = "flex"; // Tampilkan modal
}


// Fungsi untuk menutup modal pembayaran
function closePaymentModal() {
  const modal = document.getElementById("payment-info-modal");
  modal.style.display = "none";
}

// Fungsi untuk membersihkan semua data
function clearAll() {
  totalPrice = 0;
  items = [];
  updateTotalPrice();
  displayItems();
  document.getElementById("change").innerText = "Rp 0";
  document.getElementById("payment").value = ""; // Kosongkan input pembayaran
}
