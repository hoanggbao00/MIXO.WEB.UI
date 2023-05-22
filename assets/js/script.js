const btnAdd = document.querySelector('#add');
const dialog = document.querySelector('.modal-container');
const popup = document.querySelector('dialog.pop-up.container');
const btnClose = document.querySelector('#close');
const btnCancel = document.querySelector('#cancel');
const toggleSidebar = document.querySelector('#toggle-sidebar');
const sidebar = document.querySelector('.content-menu');
const btnEdit = document.querySelector('#edit');
const btnDelete = document.querySelector('#delete');
const filterName = document.querySelector('#filterName');
const size = document.querySelector('.content-main__page .page-right input');
const btnRefresh = document.querySelector('#refresh');
const fullName = document.querySelector('.header-right__account-name');

const onload = () => {
	const login = localStorage.getItem('login');
	if (!login) return (window.location.href = './index.html');

	const local = JSON.parse(login);

	fullName.textContent = `${local.fullName}`;
};

function signout() {
	localStorage.removeItem('login');
	setTimeout(() => {
		window.location.href = './index.html';
	}, 500);
};

toggleSidebar.addEventListener('change', (e) => {
	sidebar.classList.toggle('collapse');
});

btnRefresh.addEventListener('click', (e) => {
	refreshTable();
	setTimeout(() => {
		addToast('success', 'Đã làm mới bảng');
	}, 500);
});

btnClose.addEventListener('click', (e) => {
	dialog.close();
});
btnCancel.addEventListener('click', (e) => {
	dialog.close('cancel');
});

onload();

// ultis function

function formatDate(date) {
	const year = new Date(date).getFullYear();
	const month = new Date(date).getMonth();
	const day = new Date(date).getDate();
	const hoho = new Date(Date.UTC(year, month - 1, day))
		.toISOString()
		.split('T')[0];
	return hoho;
}
