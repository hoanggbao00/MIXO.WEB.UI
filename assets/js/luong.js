const local = JSON.parse(localStorage.getItem('login'))

let selectItem = false;

btnAdd.addEventListener('click', e => {
  showAdd(false);
  addInit();
})

onload()

function addInit() {
  const searchInput = document.querySelector('#searchName')
  const dropdownSearch = document.querySelector('.dropdown-search')

  searchInput.addEventListener('keypress', e => {
    dropdownSearch.style.display = 'flex'
  })
}

const selectItemSearch = (index) => {
  const dropdownSearch = document.querySelector('.dropdown-search')
  dropdownSearch.style.display = 'none'
  selectItem = true
  showAdd(true)
}

const rowData = (data) => {
	const tr = document.createElement('tr');
	tr.className = 'row main-tr';
	tr.innerHTML = `
  <th class="col l-1">04/2023</th>
  <th class="col l-1 main-th__id">NV001</th>
  <th class="col l-3 main-th__name">Bảo</th>
  <th class="col l-1 main-th_basesalary">20000</th>
  <th class="col l-2 main-th_phucap">0</th>
  <th class="col l-2 main-th_status">Đã thanh toán</th>
  <th class="col l-2 main-th__action"><p class="luongAction" onclick="showDetail('detail')">Chi tiết</p></th>`;

	return tr;
};

const showAdd = (isOpen) => {
  dialog.innerHTML = `<div class="row addLuong">
  <div class="row title-wrap">
      <h1>Thêm bảng lương</h1>
      <p>(22/05/2023)</p>
  </div>
  <div class="row" style="align-items: center; margin: 0; gap: 10px">
      <p>Kỳ lương: </p>
      <select class="combo-box" name="kyLuong" id="maKyLuong">
          <option value="042023">04/2023</option>
          <option value="052023">05/2023</option>
      </select>
  </div>
  
  <div class="row user-search" style="align-items: center; margin: 0; gap: 10px">
      <p>Nhân viên: </p>
      <div class="input-container">
          <div class="input-icon">
              <input class="input-icon__input" type="text" placeholder="Tìm kiếm theo Mã, Tên hoặc Số điện thoại" id="searchName">
              <img class="input-icon__img" src="./assets/icon/search.png" alt="">
          </div>
          <div class="dropdown-search" style="display: none">
              <p class="item" onclick="selectItemSearch()">Nguyễn Hoàng Bảo (NV002)</p>
              <p class="item" onclick="selectItemSearch()">Nguyễn Hoàng Bảo (NV002)</p>
              <p class="item" onclick="selectItemSearch()">Nguyễn Hoàng Bảo (NV002)</p>
              <p class="item" onclick="selectItemSearch()">Nguyễn Hoàng Bảo (NV002)</p>
              <p class="item" onclick="selectItemSearch()">Nguyễn Hoàng Bảo (NV002)</p>
          </div>
      </div>
  </div>
  <hr>
  ${selectItem ? `<div class="row user-info" style="margin-top: 15px;">
  <img src="./assets/icon/avatar-default.png" alt="">
  <p><span id="tenCoSo">MIXO COFFEE</span>/ <span id="tenViTri">Pha chế</span></p>
  <p id="tenNhanVien">Nguyễn Hoàng Bảo</p>
  <p id="maNhanVien">NV002</p>
</div>
<div class="row luong-detail">
  <p id="luongCoBan">Lương cơ bản: <span>20000đ</span></p>
  <p>Tổng số giờ làm: <span id="tongGioLam">98,5</span></p>
  <p>Tổng công: <span id="tongCong">29</span></p>
</div>
<div class="row" style="justify-content: right;">
  <button class="m-button" onclick="addAction()">Thêm</button>
</div>
<button class="clear" onclick="clearInfo()">
  <img src="./assets/icon/x.svg" alt="">
</button>` : ''}
</div>
<button id="close" onclick="closeModal()">
  <img src="./assets/icon/x.svg" alt="">
</button>
  `
  if(!isOpen) dialog.showModal()
}

const clearInfo = () =>{
  selectItem = false
  showAdd(true)
  addInit();
}

const rowPhuCap = () => {
  const tr = `
  <tr class="row main-tr new">
  <td class="col l-2">
      <input class="field-input" type="text" value="" placeholder="Số tiền">
  </td>
  <td class="col l-7 context">
      <input class="field-input" type="text" placeholder="Lý do">
  </td>
  <td class="col l-3 person">${local.fullName}</td></tr>`

  return tr;
} 

function addPhuCap () {
  const _tbody = dialog.querySelector('#phuCapTable tbody')
  _tbody.innerHTML += rowPhuCap()

}

const addAction = () => {
  const maKyLuong = dialog.querySelector('.combo-box')
  const maNhanVien = document.querySelector('#maNhanVien')
  const tenNhanVien = document.querySelector('#tenNhanVien')

  console.log(maKyLuong.value, maNhanVien.textContent, tenNhanVien.textContent);
}

const showDetail = (type, data) => {
	dialog.innerHTML = `<div class="row detail">
  <div class="row title-wrap">
      <h1>Bảng lương chi tiết</h1>
      <p>(04/2023)</p>
  </div>
  <div class="row user-info">
      <img src="./assets/icon/avatar-default.png" alt="">
      <p>MIXO COFFEE</p>
      <p>Nguyễn Hoàng Bảo</p>
      <p>NV002</p>
  </div>
  <hr>
  <div class="row luong-detail">
      <p>Lương cơ bản: <span>20000đ</span></p>
      <p>Tổng số giờ làm: ${type !== 'edit' ? `<span id="tongGioLam">98,5</span>` : `<input class="field-input" style="width: 50px; height: 30px; font-size: 18px; text-align: center; padding: 5px" value="98,5">`}</p>
      <p>Tổng công: ${type !== 'edit' ? `<span id="tongCong">29</span>` : `<input class="field-input" style="width: 50px; height: 30px; font-size: 18px; text-align: center; padding: 5px" value="98,5">`}</p>
      <div class="row phuCapAction">
          <p>Bảng phụ cấp: </p>
          ${type === 'edit' ? `<i class="fal fa-plus-circle" onclick="addPhuCap()"></i>` : ''}
      </div>
  </div>
  <div class="row phuCapTable">
      <table id="phuCapTable">
          <thead>
              <tr class="row main-tr">
                  <th class="col l-2">Phụ cấp</th>
                  <th class="col l-7">Lý do</th>
                  <th class="col l-2">Người thêm</th>
              </tr>
          </thead>
          <tbody>
              <tr class="row main-tr">
                  <td class="col l-2">100000đ</td>
                  <td class="col l-7 context">Tiền xăng xe</td>
                  <td class="col l-3 person">Hoàng Bảo</td>
              </tr>
              <tr class="row main-tr">
                  <td class="col l-2">100000đ</td>
                  <td class="col l-7 context">Tiền xăng xe</td>
                  <td class="col l-3 person">Hoàng Bảo</td>
              </tr>
              <tr class="row main-tr">
                  <td class="col l-2">100000đ</td>
                  <td class="col l-7 context">Tiền xăng xe</td>
                  <td class="col l-3 person">Hoàng Bảo</td>
              </tr>
          </tbody>
      </table>
      <div class="row" style="margin-top: 10px;margin-bottom: 10px;flex-direction: column;justify-content: center; align-items: center">
        <p>Thực lĩnh</p>
        <p>2.905.000đ</p>
      </div>
      <div class="row saveEdit">
          <p>Chỉnh sửa lần cuối: <span>(22/05/2023)</span></p>
          ${type === 'edit'? `<button class="m-button" onclick="dialogAction(${type})" >Xác nhận</button>` : ''}
      </div>
  </div>
</div>`;

	dialog.innerHTML += `
        <button id="close" onclick="closeModal()">
            <img src="./assets/icon/x.svg" alt="">
        </button>
        <button class="btnTop" id="edit">
        ${type ==='edit'? `<i class="far fa-info-circle" onclick="showDetail('details')"></i></button>` : ''}
        ${type !=='edit' ? `<button class="btnTop" id="details">
        <i class="far fa-edit" onclick="showDetail('edit')"></i></button>` : ''}`;

  if(type !== 'edit' && type !== 'details') dialog.showModal();
};

const closeModal = () => {
  dialog.close();
}