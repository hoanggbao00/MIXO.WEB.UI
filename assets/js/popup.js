let listId = {}

const popupContaier = (content) => {
  const div = `
  <div class="row pop-up">
  <div class="row pop-up__header">
  <div class="pop-up__close">
    <i class="fa-solid fa-xmark"></i>
  </div>
  <div class="pop-up__heading">Xóa bản ghi</div>
</div>
<div class="row no-gutters pop-up__container">
  <div class="row pop-up__content">
    <div class="pop-up__content--icon pop-up__icon--error">
      <i class="fa-solid fa-triangle-exclamation"></i>
    </div>
    <div class="pop-up__content-title">
      ${content}
    </div>
  </div>
</div>
<div class="row no-gutters pop-up__footer">
  <button class="m-button pop-up--continue" onclick="popupBtn(false)">Hủy</button>
  <button class="m-button pop-up--remove" onclick="popupBtn(true)">Xóa</button>
</div>
</div>
  `
  return div;
}


const addPopup = (content, data) => {
  const div = popupContaier(`${content}`)
  if(data) {
    listId.name = data.map(item => `${item.fullName} (${item.code})`)
    listId.id = data.map(item => item.id)
  }
  popup.innerHTML = div
  popup.showModal()
}

function popupBtn(type) {
  
  if(type === true) {
  if(window.location.href.includes('home.html')) {
    const res = fetch('http://localhost:5275/api/v1/NhanVien', {
      method: 'DELETE',
      body: JSON.stringify(listId.id),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    })

	res.then(data => data.json())
	.then(item => {
		if(`${item}`.startsWith('e')) {
      addToast('error', `Lỗi ${item}`)
      console.log(listId.id);
    } else {
      listId.name.forEach(item => {
        addToast('success', `Đã xóa ${item}`)
      })
    }
	})
  }

  if(window.location.href.includes('phieu.html')) {
    const res = fetch(`http://localhost:5275/api/v1/Phieu?maPhieu=${listId.id[0]}`, {
      method: 'DELETE',
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    })

	res.then(data => data.json())
	.then(item => {
		if(`${item}`.startsWith('e')) {
      addToast('error', `Lỗi ${item}`)
      console.log(listId.id[0]);
    } else {
      listId.name.forEach(item => {
        addToast('success', `Đã xóa ${item}`)
      })
    }
	})
  }
  showData();
  popup.close();
  }

  if(type === false) {
    
    return popup.close();
  }
}