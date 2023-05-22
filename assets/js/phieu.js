const btnDetail = document.querySelectorAll('#detail');
const tbody = document.querySelector('tbody');

let _data;

onload()
document.querySelector('.dropdown .row').addEventListener('click', () => {
	signout()
})

async function getData() {
	const res = await fetch('http://localhost:5275/api/v1/Phieu');
	const data = await res.json();

	return data;
}

function showData() {
	tbody.innerHTML = '';
	getData().then(data => {
		_data = [...data]
		data.forEach((item, index) => {
			tbody.appendChild(rowData(item, index));
		});
		document.querySelector('#count').textContent = data.length;

	})
	
}

btnAdd.addEventListener('click', (e) => {
	addPhieu();
});

const phieuDetail = (item, type) => {
	const local = JSON.parse(localStorage.getItem('login'));
	const div = document.createElement('div');
	let title;
	if (item) {
		title =
			item.loaiPhieu === 0
				? 'Phiếu giải trình'
				: item.loaiPhieu === 1
				? 'Phiếu thưởng'
				: 'Phiếu phạt';
	}
	div.className = 'detail-modal';
	div.innerHTML = `
					<div class="modal-title">
						${
							type === 'edit' || type === 'add'
								? `<select class="combo-box">
						<option value="0">Giải trình</option>
						<option value="1">Phiếu thưởng</option>
						<option value="2">Phiếu phạt</option>
					</select><br>`
								: `<h1>${title}</h1>`
						}
						${type === 'add' ? formatDate(Date.now()) : `<p>${item.ngay}</p>`}
					</div>
					<hr>
					<div class="row item-wrap">
						<p>Người tạo: </p>
						${type === 'add' ? local.fullName : `<p>${item.createdBy}</p>`}
						
					</div>
					<div class="row item-wrap">
						<p>Ngày tạo: </p>
						${type === 'add' ? formatDate(Date.now()) : `<p>${item.createdDate}</p>`}
					</div>
					
					<div class="row item-wrap">
						<p>Tên nhân viên: </p>
						${
							type === 'add'
								? `<input style="width: 60%" type="text" class="user__input-content" id="tenNhanVien">`
								: 'test'
						}
					</div>
					<div class="row item-wrap">
						<p>Tiêu đề: </p>
						${
							type === 'edit' || type === 'add'
								? `<input style="width: 80%" type="text" class="user__input-content" id="input-title" ${
										type === 'add' ? '' : `value="${item.tieuDe}`
								  }"/>`
								: `<p>${item.tieuDe}</p>`
						}
					</div>
					<div class="row item-wrap">
						<p>Nội dung chi tiết: </p>
					</div>
					<div class="row item-wrap">
						${
							type === 'edit' || type === 'add'
								? `<textarea cols="auto" id="input-detail">${
										type === 'add' ? '' : item.noiDung
								  }</textarea>`
								: `<p class="modal-detail">${item.noiDung}</p>`
						}
					</div>
					<hr>
					<div class="modal-footer row">
					${
						type !== 'add'
							? `<div class="col">
							<p>Trạng thái</p>
							<p>${item.isModified === 1 ? 'Đã chỉnh sửa' : 'Tạo mới'}</p>
							<p>(${item.isModified === 1 ? item.modifiedDate : item.createdDate})</p>
						</div>
						${
							item.isModified === 1
								? `<div class="col">
            <p>Chỉnh sửa bởi</p>
            <p>${item.modifiedBy}</p>
        </div> `
								: ''
						}`
							: ''
					}
						
            
            ${
							type === 'edit' || type === 'add'
								? `<button class="m-button" onclick="${
										type === 'edit'
											? `editAction()`
											: type === 'add'
											? 'addAction()'
											: ''
								  }">Xác nhận</button>`
								: ''
						}`;

	return div;
};

const rowData = (data, index) => {
	const tr = document.createElement('tr');
	const title =
		data.loaiPhieu === 0
			? 'Giải trình'
			: data.loaiPhieu === 1
			? 'Phiếu thưởng'
			: 'Phiếu phạt';
	tr.className = 'row main-tr';
	tr.innerHTML = `
  <td class="col l-1">${formatDate(data.ngay)}</td>
  <td class="col l-1">${title}</td>
  <td class="col l-2">${data.maNhanVien}</td>
  <td class="col l-4"><p class="title-item">${data.tieuDe}</p></td>
  <td class="col l-1">${data.isModified === 1 ? 'Đã chỉnh sửa' : 'Tạo mới'}</td>
  <td class="col l-2">
    <button class="button__refresh" id="detail" onclick="showDetail(${index})">
      <i class="far fa-info-circle"></i>
    </button>
    <button class="button__refresh" id="edit" onclick="editPhieu(${
			index
		})">
      <i class="far fa-edit"></i>
    </button>
    <button class="button__refresh" id="delete" onclick="deletePhieu(${
			data.maPhieu
		})">
      <i class="far fa-trash"></i>
    </button>
  </td>`;

	return tr;
};

function showDetail(index) {
	const item = _data[index]
	const div = phieuDetail(item, 'detail');

	addDetail(div);
	dialog.showModal();
}

function addAction() {
	const local = JSON.parse(localStorage.getItem('login'));
	const loaiPhieu = dialog.querySelector('.combo-box');
	const ngay = Date.now();
	const tieuDe = dialog.querySelector('#input-title').value;
	const noiDung = dialog.querySelector('#input-detail').value;
	const tenNhanVien = dialog.querySelector('#tenNhanVien').value;

	const info = {
		loaiPhieu: loaiPhieu.value,
		ngay: formatDate(ngay),
		tieuDe: tieuDe,
		noiDung: noiDung,
		createdDate: formatDate(ngay),
		createdBy: local.fullName,
		modifiedBy: local.fullName,
		modifiedDate: formatDate(ngay),
		maNhanVien: '0',
	};
	let check;

	const res = fetch(`http://localhost:5275/api/v1/Phieu?nameInput=${tenNhanVien}&nameCreated=${local.fullName}`,{
	method: 'POST',
			body: JSON.stringify(info),
			headers: {
				'Content-type': 'application/json; charset=UTF-8',
}}).then(data => data.json()).then(item => {
	check = item;
	if(!`${check}`.startsWith('e')) addToast('success',`Tạo mới phiếu thành công`)
	else addToast('error', 'Tạo mới thất bại')
})
console.log(info);

}





function editPhieu(index) {
	const item = _data[index];
	const div = phieuDetail(item, 'edit');

	addDetail(div);
	dialog.showModal();
}

function addPhieu() {
	const div = phieuDetail(null, 'add');

	addDetail(div);
	dialog.showModal();
}

function deletePhieu(maPhieu) {
	addPopup(`Xác nhận xóa phiếu ${maPhieu}?`,[{id: maPhieu}]);
}

function addDetail(div) {
	dialog.innerHTML = '';
	dialog.appendChild(div);
	dialog.innerHTML += `</div>
  <button id="close">
    <img src="./assets/icon/x.svg" alt="" />
  </button>
</div>`;
	document.querySelector('#close').addEventListener('click', (e) => {
		dialog.close();
	});
}
showData();
