
const { LoginPemakaiModel } = require('../models');

class LoginPemakaiRepository {

    async CreateUser(payload){
        const { pegawai_id, username, password } = payload;
        const is_exist = await LoginPemakaiModel.findUser(username);
        if(is_exist) throw new Error("User Already Exist!");
        const user = new LoginPemakaiModel.loginPemakai(
            pegawai_id,
            username,
            password,
        )
        const userResult = await user.save();
        return userResult;
    }

    async UpdatePassword(payload){
        const { pegawai_id, password } = payload;
        const existingUser = await LoginPemakaiModel.UpdatePassword({ pegawai_id, password});
        return existingUser;
    }

    async FindUser(username){

        const existingUser = await LoginPemakaiModel.findUser(username);
        return existingUser;
    }

    async AddTempToken(username, temp_token){
        const existingUser = await LoginPemakaiModel.AddTempToken(username, temp_token);
        return existingUser;
    }

    async FindUserById({ pegawai_id }){
        const existingUser = await LoginPemakaiModel.findOne(pegawai_id);
        return existingUser;
    }

    async FindUserByToken(temp_token){
        const existingUser = await LoginPemakaiModel.FindUserByToken(temp_token);
        return existingUser;
    }

    async Logout(loginpemakai_id){
        const existingUser = await LoginPemakaiModel.Logout(loginpemakai_id);
        return existingUser;
    }
}

module.exports = LoginPemakaiRepository;
