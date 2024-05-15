const bcrypt = require('bcrypt');

async function encript(password) {
    const hash = await bcrypt.hash(password, 10);
    console.log(hash);
    return hash;
}

//encript password
encript('Papaya@123');