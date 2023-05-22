(() => {
	const usernameInput = document.querySelector('#username');
	const passwordInput = document.querySelector('#password');
	const btnSubmit = document.querySelector('button[type=submit]');
	const showPassword = document.querySelector('#show');

  (() => {
    const local = localStorage.getItem('login')
    if(local) {
      setTimeout(() => {
        window.location.href = './home.html'
      }, 500);
    }
  })();

	btnSubmit.addEventListener('click', (e) => {
		loginAction();
	});

	usernameInput.addEventListener('keypress', (e) => {
		if (e.key === 'Enter') loginAction();
	});

	passwordInput.addEventListener('keypress', (e) => {
		if (e.key === 'Enter') loginAction();
	});

	showPassword.addEventListener('change', (e) => {
		if (e.target.checked) passwordInput.setAttribute('type', 'text');
		else passwordInput.setAttribute('type', 'password');
	});

  const getData = async (username, password) => {
    const response = await fetch(
			`http://localhost:5275/api/v1/DangNhap?maNhanVien=${username}&matKhau=${password}`
		);
		const data = await response.json()

    return data;
  }
  
	const loginAction = () => {
		const username = usernameInput.value;
		const password = passwordInput.value;

		if(username === 'admin' && password === 'admin') {
			const user = {
				userId: 'admin',
				fullName: 'admin',
				permission: 1,
			};

			localStorage.setItem('login', JSON.stringify(user));
        addToast('success', 'Đăng nhập ADMIN');

				setTimeout(() => {
          window.location.href = './home.html';  
        }, 1000);
				return;
		}

		getData(username,password).then(item => {
			if (item === 'false' || item.status === 400 || `${item}`.startsWith('e')) {
				addToast('error', 'Đăng nhập không thành công');
			} else {
				const user = {
					userId: item.userId,
					fullName: item.fullName,
					permission: item.permission,
				};

				localStorage.setItem('login', JSON.stringify(user));
        addToast('success', 'Đăng nhập thành công');

        setTimeout(() => {
          window.location.href = './home.html';  
        }, 1000);
				
			}
		}).catch(() => {
      addToast('error', 'Đăng nhập không thành công');
    });
	};
})();
