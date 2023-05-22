const table = document.querySelector('table.content-main__table');
const tbody = table.querySelector('tbody');
const count = document.querySelector('#count')
const nameInput = document.querySelector('#nameInput');
const fromDateInput = document.querySelector('#fromDateInput')
const toDateInput = document.querySelector('#toDateInput')

onload()

nameInput.addEventListener('keypress', e => {
  if(e.key === 'Enter') {
    showData(nameInput.value,fromDateInput.value, toDateInput.value)
  }
})

fromDateInput.addEventListener('change', e => {
  showData(nameInput.value,fromDateInput.value, toDateInput.value)
})

toDateInput.addEventListener('change', e => {
  showData(nameInput.value,fromDateInput.value, toDateInput.value)
})


const rowData = (data) => {
	const tr = document.createElement('tr');
	tr.className = 'row main-tr';
	tr.setAttribute('dataId', data.nhanVienID);
	tr.innerHTML = `
  <td class="col l-1">${data.maNhanVien}</td>
  <td class="col l-3">${data.tenNhanVien}</td>
  <td class="col l-1">${formatDate(data.ngayLam)}</td>
  <td class="col l-1">${data.gioVao}</td>
  <td class="col l-1">${data.gioRa}</td>
  <td class="col l-1">${data.thoiGianLamViec}</td>
  <td class="col l-1">${data.thoiGianTangCa}</td>
  <td class="col l-1">${data.tinhTrang === 0 ? "Đi muộn" : data.tinhTrang === 1 ? "Đi sớm" : "Đúng giờ"}</td>`

  return tr;
}

const getData = (name='', fromDate, toDate) => {
	let where = '';
  if(name) where+= `name=${name}`
	if (fromDate) where += `&fromDate=${fromDate}`
	if (toDate) where += `&toDate=${toDate}`

  let url = `http://localhost:5275/api/v1/ChamCong/filter?${where}`
	const data = fetch(url)
  .then((res) => res.json());
	data.then((item) => {
    count.textContent = item.length;
	});

  return data;
};

const showData = (name, fromDate, toDate) => {
  getData(name, fromDate, toDate)
  .then(data => {
    tbody.innerHTML = '';
    setTimeout(() => {
      data.forEach(item => {
        tbody.appendChild(rowData(item))
      });
    }, 300);
  })
}

function refreshTable() {
  showData();
  nameInput.value = '';
  fromDateInput.value = '';
  toDateInput.value = '';
}

showData()

async function fillThongKe() {
const DiMuonNhieuNhat = document.querySelector('#DiMuonNhieuNhat')
const DiSomNhieuNhat = document.querySelector('#DiSomNhieuNhat')
const TangCaNhieuLanNhat = document.querySelector('#TangCaNhieuLanNhat')
const DiLamNhieuGioNhat = document.querySelector('#DiLamNhieuGioNhat')
const TangCaNhieuGioNhat = document.querySelector('#TangCaNhieuGioNhat')
const NgayTaoBaoCao = document.querySelector('#NgayTaoBaoCao')

// đi sớm
await fetch('http://localhost:5275/api/v1/ThongKe/DiSom').then(res => res.json()).then(data => {
  let temp = {ketQua: 0};
  data.forEach(kq => {
    if(kq.ketQua > temp.ketQua)
      temp = {...kq}
  })

  if(temp.ketQua !== 0) {
    DiSomNhieuNhat.innerHTML = ` ${temp.tenNhanVien}<span> (${`${`${temp.ketQua}`.toString('#,#')}`.toString('#,#')} lần)</span>`
  }
})

// đi muộn
await fetch('http://localhost:5275/api/v1/ThongKe/DiMuon').then(res => res.json()).then(data => {
  let temp = {ketQua: 0};

  data.forEach(kq => {
    if(kq.ketQua > temp.ketQua)
      temp = {...kq}
  })
  console.log(temp.ketQua);

  if(temp.ketQua !== 0) {
    DiMuonNhieuNhat.innerHTML = ` ${temp.tenNhanVien}<span>(${`${temp.ketQua}`.toString('#,#')} lần)</span>`
  }
})

// tăng ca nhiều nhất
await fetch('http://localhost:5275/api/v1/ThongKe/TangCaNhieuNhat').then(res => res.json()).then(data => {
  let temp = {ketQua: 0};
  data.forEach(kq => {
    if(kq.ketQua > temp.ketQua)
      temp = {...kq}
  })


  if(temp.ketQua !== 0) {
    TangCaNhieuLanNhat.innerHTML = ` ${temp.tenNhanVien}<span> (${`${temp.ketQua}`.toString('#,#')} lần)</span>`
  }
})

// Đi làm nhiều giờ nah61t
await fetch('http://localhost:5275/api/v1/ThongKe/LamNhieuGioNhat').then(res => res.json()).then(data => {
  let temp = {ketQua: 0};
  data.forEach(kq => {
    if(kq.ketQua > temp.ketQua)
      temp = {...kq}
  })

  if(temp.ketQua !== 0) {
    DiLamNhieuGioNhat.innerHTML = ` ${temp.tenNhanVien}<span> (${parseFloat(temp.ketQua).toFixed(2)} giờ)</span>`
  }
})

// tăng ca nhiều nhất
await fetch('http://localhost:5275/api/v1/ThongKe/GioTangCaNhieuNhat').then(res => res.json()).then(data => {
  let temp = {ketQua: 0};
  data.forEach(kq => {
    if(kq.ketQua > temp.ketQua)
      temp = {...kq}
  })

  if(temp.ketQua !== 0) {
    TangCaNhieuGioNhat.innerHTML = ` ${temp.tenNhanVien}<span> (${parseFloat(temp.ketQua).toFixed(2)} giờ)</span>`
  }
})

NgayTaoBaoCao.innerHTML = `${formatDate(Date.now())}`

}

btnAdd.addEventListener('click', e => {
  fillThongKe();
  dialog.showModal();
})