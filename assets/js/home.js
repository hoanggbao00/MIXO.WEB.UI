const trash = document.querySelector('#delete');
const edit = document.querySelector('#edit');
const table = document.querySelector('table.content-main__table');
const tbody = table.querySelector('tbody');
const currentData = document.querySelector('#current');
const countData = document.querySelector('#count');
const selectCoSo = document.querySelector('#filterCoSo')
const selectViTri = document.querySelector('#filterViTri')

btnAdd.addEventListener('click', e => {
	dialog.showModal();
  refreshInput()
  dialog.setAttribute('type','add')
})

btnEdit.addEventListener('click', e => {
	dialog.showModal()
  fillSelected();
  dialog.setAttribute('type','edit')
})

btnDelete.addEventListener('click', e => {
  deleteRow()
  popup.showModal();
})

filterName.addEventListener('keydown', e => {
  if(e.key === 'Enter') {
    showData(pageNumber, size.value, e.target.value, selectViTri.value, selectCoSo.value)
  }
})

selectViTri.addEventListener('change', e => {
  const id = e.target.value
  showData(pageNumber, size.value, filterName.value, id, selectCoSo.value)
})

selectCoSo.addEventListener('change', e => {
  const id = e.target.value
  showData(pageNumber, size.value, filterName.value, selectViTri.value, id)
})

window.onload = () => {
	showData()
}

let check = 0;
let CHECKALL = true;

let pageNumber = 1,
	maxPage = 0;

const getData = async (pageNumber = 1, pageSize = 10, search, viTriID, coSoID) => {
	let where = '';
	if (search) where += `&name=${search}`
	if (viTriID && viTriID !== '0') where += `&viTriID=${viTriID}`
	if (coSoID && coSoID !== '0') where += `&coSoID=${coSoID}`

	const res = await fetch(
		`http://localhost:5275/api/v1/NhanVien/filter?pageSize=${pageSize}&pageNumber=${pageNumber}${where}`
	)
	const data = await res.json()
	// .then((res) => res.json()).then((count) => {
	// 	maxPage = parseInt(count.totalCount / size.value);
	// });

	return data;
};

const rowData = (data, index) => {
	const tr = document.createElement('tr');
	tr.className = 'row main-tr';
	tr.setAttribute('dataId', data.nhanVienID);
	tr.innerHTML = `
  <td class="col main-th__checked">
      <input class="main-th__input" type="checkbox" name="">
  </td>
  <td class="col main-th__number">${index}</td>
  <td class="col l-1 main-th__id">${data.maNhanVien}</td>
  <td class="col l-3 main-th__name">${data.tenNhanVien}</td>
  <td class="col l-1 main-th_gender">${
		data.gioiTinh === 0 ? 'Nữ' : data.gioiTinh === 1 ? 'Nam' : 'Khác'
	}</td>
  <td class="col l-1 main-th_dateofbirth">${formatDate(data.ngaySinh)}</td>
  <td class="col l-1 main-th_number">${data.dienThoai}</td>
  <td class="col l-1 main-th__position">${data.tenViTri}</td>
  <td class="col l-1 main-th_basesalary">${data.luong}đ</td>
  <td class="col l-1 main-th_workstatus">${
		data.tinhTrang === 1
			? 'Đang làm việc'
			: data.tinhTrang === 0
			? 'Nghỉ việc'
			: 'Tạm nghỉ'
	}</td>
  <td class="col l-1 main-th__department">${data.tenCoSo}</td>`;

	return tr;
};

document.querySelector('#save').addEventListener('click', (e) => {
	const type = dialog.getAttribute('type');

	saveAction(type);
});

const refreshInput = () => {
	const inputs = dialog.querySelectorAll('input');
	const selects = dialog.querySelectorAll('select');

	inputs.forEach((input) => {
		input.value = ''
	});

	selects.forEach((select) => {
		select.options = 0;
	});
}

const getNhanVienByDialog = () => {
	const nhanvien = {};
	const inputs = dialog.querySelectorAll('input');
	const selects = dialog.querySelectorAll('select');

	inputs.forEach((input) => {
		const name = input.getAttribute('name');
		nhanvien[name] = input.value;
	});

	selects.forEach((select) => {
		const name = select.getAttribute('name');
		nhanvien[`${name}`] = select.value;
		nhanvien[`ten${name}`] = select.options[select.selectedIndex].text;
	});

	const CURDATE = new Date();

	const nv = {
		nhanVienID: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
		maNhanVien: nhanvien.maNhanVien,
		tenNhanVien: nhanvien.tenNhanVien,
		ngaySinh: nhanvien.ngaySinh,
		gioiTinh: parseInt(nhanvien.gioiTinh),
		canCuoc: nhanvien.canCuoc,
		email: nhanvien.email,
		dienThoai: nhanvien.dienThoai,
		viTriID: nhanvien.ViTri,
		tenViTri: nhanvien.tenViTri,
		coSoID: nhanvien.CoSo,
		tenCoSo: nhanvien.tenCoSo,
		luong: nhanvien.luong,
		ngayLam: nhanvien.ngayLam,
		tinhTrang: parseInt(nhanvien.tinhTrang),
		createdBy: 'Nguyễn Hoàng Bảo',
		createdDate: CURDATE,
		modifiedBy: 'Nguyễn Hoàng Bảo',
		modifiedDate: CURDATE,
	};

	return nv
}

const getNhanVienById = (id) => {
	return fetch(`http://localhost:5275/api/v1/NhanVien/${id}`, {
		method: 'GET',
	}).then(res => res.json()).then(data => data)
}

const getSelected = () => {
	let obj = [];
	const selected = tbody.querySelectorAll('tr.selected');
	selected.forEach((item) => {
		const ten = item.querySelector('.main-th__name').textContent;
		const code = item.querySelector('.main-th__id').textContent;
		const temp = {
			fullName: ten,
			code: code,
			id: item.getAttribute('dataId'),
		};
		obj.push(temp);
	});
	return obj;
};

// btn function
async function fillSelected() {
	const id = getSelected()[0].id;
	const inputs = dialog.querySelectorAll('input');
	const selects = dialog.querySelectorAll('select');

	const res = await fetch(`http://localhost:5275/api/v1/NhanVien/${id}`, {
		method: 'GET',
	});
	res.json().then((data) => {
		inputs.forEach((input) => {
			const name = input.getAttribute('name');
			if(name === 'ngaySinh' || name === 'ngayLam') {
				const date = new Date(data[name]);
				input.value = date.toISOString().split('T')[0]
			} else
			input.value = data[name];
		});

		selects.forEach((select) => {
			let name = select.getAttribute('name');
			if (name === 'ViTri') {
				select.value = data['viTriID'];
			} else if (name === 'CoSo') {
				select.value = data['coSoID'];
			} else {
				select.value = data[name];
			}
		});
	});
}

function saveAction(type) {
	const nv = getNhanVienByDialog()

	if (type === 'add') {
		const res = fetch('http://localhost:5275/api/v1/NhanVien', {
			method: 'POST',
			body: JSON.stringify(nv),
			headers: {
				'Content-type': 'application/json; charset=UTF-8',
			},
		});

		res
			.then((code) => code.json())
			.then((data) => {
				if (data.status === 400) return addToast('warning', data.title);
				if (data === 'e003') {
					return addToast(
						'error',
						`Đã tồn tại mã nhân viên '${nv.maNhanVien}'`
					);
				}

				addToast(
					'success',
					`Thêm thành công ${nv.tenNhanVien}(${nv.maNhanVien})`
				);
				dialog.close();
				showData();
			});
	}

	if (type === 'edit') {
		const id = getSelected()[0].id
		let data = getNhanVienByDialog()
		data.nhanVienID = id;

		const res = fetch(`http://localhost:5275/api/v1/NhanVien/${id}`, {
			method: 'PUT',
			body: JSON.stringify(data),
			headers: {
				'Content-type': 'application/json; charset=UTF-8',
			},
		});

		res
		.then(data => data.json())
		.then(status => {
			if(`${status}`.startsWith('e')) {
				addToast('error', `Lỗi ${status}`)
			} else {
				addToast('success', `Sửa thành công !`)
			}
		})
		dialog.close()
	}
	refreshTable()
	
}

function popupDelete(id) {
	
}

function deleteRow() {
	const list = getSelected();
	let content = [];
	list.forEach((item) => {
		content.push(`<li>${item.fullName} (${item.code})</li>`);
	});
	addPopup(`<h2><b>Xác nhận xóa</b></h2> <ul>${content.join('')}<ul>`, list);
}

function showData(pageNumber = 1, pageSize = 10, name, vitri, coso) {
	pageSize = parseInt(size.value);
	getData(pageNumber, pageSize, name, vitri, coso).then((data) => {		
	maxPage = parseInt(data.totalCount / size.value);
		tbody.innerHTML = '';
		setTimeout(() => {
			data.data.forEach((item, index) => {
				tbody.appendChild(
					rowData(item, pageNumber * pageSize - pageSize + index + 1)
				);
			});
			currentData.textContent = `${pageSize * pageNumber - pageSize + 1}-${
				data.totalCount < pageNumber * pageSize
					? data.totalCount
					: pageNumber * pageSize
			}`;
			initEvent();
		}, 300);
		countData.textContent = data.totalCount;
	})
}

const nextPage = () => {
	if (pageNumber === parseInt(maxPage + 1)) return;
	showData(++pageNumber, size.value);
};

const prevPage = () => {
	if (pageNumber === 1) return;
	showData(--pageNumber, size);
};

function refreshTable() {
	showData(pageNumber, size.value);
	selectCoSo.value = 0
	selectViTri.value = 0
}

// ultis function
function initEvent() {
	const checkbox = document.querySelectorAll('.main-th__input');

	checkbox.forEach((item, index) => {
		item.addEventListener('change', (e) => {
			if (e.target.checked === true && index === 0) return checkAll();
			if (e.target.checked === false && index === 0) return uncheckAll();

			CHECKALL = false;

			if (e.target.checked === true) {
				item.parentElement.parentElement.className = 'row main-tr selected';
				++check;
			} else {
				item.parentElement.parentElement.className = 'row main-tr';
				--check;
			}
			if (checkbox[0].checked === true) {
				checkbox[0].checked = false;
				--check;
			}
			if (check === checkbox.length - 1) checkAll();
			if (check > 0) showAction(true);
			else showAction(false);
		});
	});

	function checkAll() {
		checkbox.forEach((item) => {
			item.checked = true;
			tbody.querySelectorAll('tr').forEach((tr) => {
				tr.className = 'row main-tr selected';
			});
		});
		CHECKALL = true;
		check = checkbox.length;
		showAction(true);
	}

	function uncheckAll() {
		checkbox.forEach((item) => {
			item.checked = false;
			tbody.querySelectorAll('tr').forEach((tr) => {
				tr.className = 'row main-tr';
			});
		});
		check = 0;
		CHECKALL = false;
		showAction(false);
	}
}

function showAction(show) {
	if (show === true) {
		trash.style.display = '';
		edit.style.display = '';
	} else {
		trash.style.display = 'none';
		edit.style.display = 'none';
	}
}
