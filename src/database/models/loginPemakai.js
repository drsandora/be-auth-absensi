

class loginPemakai {
    constructor(pegawai_id, username, password) {
      this.pegawai_id = pegawai_id;
      this.username = username;
      this.password = password;
    }

async save() {
        const { AuthRepository } = require('../index'); 
        const insertQuery = `
          INSERT INTO loginpemakai_k (pegawai_id, username, password, role_id)
          VALUES ($1, $2, $3, $4)
          RETURNING loginpemakai_id, pegawai_id, username, password, role_id;
        `;

        try {
          const result = await AuthRepository.one(insertQuery, [this.pegawai_id, this.username, this.password, 2]);
          return result;
        } catch (error) {
            return error.message;
        }
      }
}

async function findOne(pegawai_id) {
    const { AuthRepository } = require('../index'); 
    const query = {
        text: `SELECT * FROM loginpemakai_k WHERE pegawai_id = $1`,
        values: [pegawai_id],
    };
    try {
        const result = await AuthRepository.query(query);
        console.log(result)
        return result[0];
    } catch (error) {
        console.error('Error executing query:', error);
        throw new Error('Error finding user');
    }
}

async function findUser(username) {
    const { AuthRepository } = require('../index'); 

    const query = {
        text: `SELECT * FROM loginpemakai_k WHERE username = $1`,
        values: [username],
    };

    try {
        const result = await AuthRepository.query(query);
        return result[0];
    } catch (error) {
        console.error('Error executing query:', error);
        throw new Error('Error finding user');
    }
}

async function FindUserByToken(temp_token) {
    const { AuthRepository } = require('../index'); 
    const query = {
        text: `SELECT * FROM loginpemakai_k WHERE temp_token = $1`,
        values: [temp_token],
    };

    try {
        const result = await AuthRepository.query(query);
        return result[0];
    } catch (error) {
        console.error('Error executing query:', error);
        throw new Error('Error finding user');
    }
}




async function AddTempToken(username, temp_token) {
    const { AuthRepository } = require('../index'); 
    const query = {
        text: 'UPDATE loginpemakai_k SET temp_token = $1 WHERE username = $2',
        values: [temp_token, username],
    };

    try {
        const result = await AuthRepository.none(query, [temp_token, username]);
        return result;
    } catch (error) {
        console.error('Error executing query:', error);
        throw new Error('Error finding user');
    }
}

async function Logout(loginpemakai_id) {
    const { AuthRepository } = require('../index'); 
    const query = {
        text: 'UPDATE loginpemakai_k SET temp_token = null WHERE loginpemakai_id = $1',
        values: [loginpemakai_id],
    };

    try {
        const result = await AuthRepository.none(query, [loginpemakai_id]);
        return result;
    } catch (error) {
        console.error('Error executing query:', error);
        throw new Error('Error finding user');
    }
}

async function UpdatePassword(payload){
    const { AuthRepository } = require('../index'); 
    const {  pegawai_id, password} = payload;
    // return
    try {
        const updatedRows = await AuthRepository.result(
            'UPDATE loginpemakai_k SET password = $1 WHERE pegawai_id = $2',
            [password, pegawai_id]
        );
        return { data: `${updatedRows.rowCount}`, message: `Updated ${updatedRows.rowCount} rows successfully` }
    } catch (error) {
        return error.message;
    }
}

module.exports = {
loginPemakai,
findOne,
findUser,
AddTempToken,
FindUserByToken,
Logout,
UpdatePassword
};

