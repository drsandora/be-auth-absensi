const {
    FormateData, GenerateSalt, GeneratePassword, GenerateSignature, 
    ValidatePassword, GenerateTempSignature, ValidateTempToken,
    Encrypt, Decrypt
} = require('../helper')
const { AuthRepository, LoginPemakaiRepository } = require('../database'); 

// All Business logic will be here
class AuthService {

    constructor(){
        this.repository = new LoginPemakaiRepository();
    }


    async Login(userInputs){

        const { username, password, res } = userInputs;
        const existingUser = await this.repository.FindUser(username);
        if(!existingUser) throw new Error("Data User Tidak Ada");
        if(existingUser){
            const validPassword = await ValidatePassword(password, existingUser.password);
            if(!validPassword) throw new Error("Password Tidak Valid");
            if(validPassword){
                const token = await GenerateSignature({ username: existingUser.username, pegawai_id: existingUser.pegawai_id});
                const temp_token = await GenerateTempSignature({ username: existingUser.username, loginpemakai_id: existingUser.loginpemakai_id});
                await this.repository.AddTempToken(username, temp_token);
                res.cookie('temp_token', temp_token, {
                    httpOnly: true,
                    maxAge: 3600000
                })
                return FormateData({
                    id: existingUser.loginpemakai_id,
                    pegawai_id: existingUser.pegawai_id,
                    username: existingUser.username ,
                    role_id: existingUser.role_id,
                     token, temp_token });
            }
        }
        return FormateData(null);
    }

    async SignUp(userInputs){
        const { pegawai_id, username, password } = userInputs;
        let userPassword = await Encrypt(password);
        const existingUser = await this.repository.CreateUser({ pegawai_id, username, password: userPassword});
        const token = await GenerateSignature({ username: existingUser.username, loginpemakai_id: existingUser.loginpemakai_id});
        return FormateData({id: existingUser.loginpemakai_id, token });

    }

    async GetUser(pegawai_id){
        const user = await  this.repository.FindUserById(pegawai_id);
        let decryptPass = await Decrypt(user.password)
        user.password = decryptPass
        return FormateData(user);
    }

    async GetUserTempToken(temp_token){
        const token = await  this.repository.FindUserByToken(temp_token);
        const data = await ValidateTempToken(token)
        return FormateData(data);
    }

    async Logout(payload){

        const { temp_token, res } = payload;
        const user = await this.repository.FindUserByToken(temp_token);
        if(!user) throw new Error("Token Not found!");
        const { loginpemakai_id } = user
        const data = await this.repository.Logout(loginpemakai_id);
        res.clearCookie('temp_token')
    }

    async UpdatePassword(payload){

        const { pegawai_id, password } = payload;
        let encryptPass = await Encrypt(password);
        const existingUser = await this.repository.UpdatePassword({ pegawai_id, password: encryptPass});
        return FormateData({id: existingUser.loginpemakai_id });
    }

    async SubscribeEvents(payload){
 
        console.log('Triggering.... Auth Events')
        const { event, data } =  payload;
        
        const { pegawai_id, username, password } = data;
        switch(event){
            case 'GET_USER':
                const result = await this.GetUser({pegawai_id});
                return result;
            case 'CREATE_USER':
                this.SignUp({pegawai_id, username, password})
                break;
            case 'UPDATE_PASSWORD':
                this.UpdatePassword({pegawai_id, password})
                break;
            default:
                break;
        }
 
    }

}

module.exports = AuthService;
