async function login(username, password) {
    try {
        let response = await fetch('https://66451857b8925626f8910462.mockapi.io/users');
        let data = await response.json();
        for (const user of data) {
            let userNameAPI = user.userName;
            let passwordAPI = user.password;
            let emailAPI = user.Email;
            if (userNameAPI === username && passwordAPI === password) {
                return emailAPI;
            }
        }
        return false;
    } catch (error) {
        console.error('Ошибка:', error);
        throw error;
    }
}

async function checkUser(username, email) {
    try {
        let response = await fetch('https://66451857b8925626f8910462.mockapi.io/users');
        let data = await response.json();
        for (const user of data) {
            let userNameAPI = user.userName;
            let emailAPI = user.Email;
            if (userNameAPI === username && emailAPI === email) {
                return true;
            }
        }
        return false;
    } catch (error) {
        console.error('Ошибка:', error);
        throw error;
    }
}

// Функция для выполнения POST запроса
async function register(username, email, password) {
    try {
        if (!await checkUser(username, email)) {
            const response = await fetch('https://66451857b8925626f8910462.mockapi.io/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "userName": username,
                    "Email": email,
                    password
                })
            });
            return true;
        }
        else {
            return false;
        }
    } catch (error) {
        console.error('Ошибка:', error);
        throw error;
    }
}

export { login, register };