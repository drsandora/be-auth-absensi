const CookieParser = require('cookie-parser');
const AuthService = require('../services/auth-service'); 
const bodyParser = require('body-parser');
const  UserAuth = require('./middleware/verifytoken');

module.exports = (app, channel) => {
    app.use(CookieParser());
    app.use(bodyParser.json()); // for parsing application/json
    app.use(bodyParser.urlencoded({ extended: true }));
    const service = new AuthService();

    app.get('/profile' , UserAuth, async (req,res) => {
        try {
            const { pegawai_id } = req.user;
            const { data } = await service.GetUser({ pegawai_id });
            res.json({data});
        } catch (error) {
            return res.status(500).json({message: error.message})
        }
    });

    app.post('/login',  async (req,res,next) => {
        try {
            const { username, password } = req.body;
            const { data } = await service.Login({ username, password, res});
            res.json(data);
          } catch (error) {
            return res.status(500).json({message: error.message})
          }

    });

    app.get('/rt',  async (req,res,next) => {
        try {
            const temp_token = req.cookies.temp_token;
            const param = "temp_token";
            if(!temp_token) return res.sendStatus(401)
            const { data } = await service.GetUserTempToken({ temp_token });
            res.json(data);
          } catch (error) {
            res.status(500).send({ error: error.message });
          }

    });

    app.post('/signup',  async (req,res,next) => {
        try {
            const { pegawai_id, username, password } = req.body;
            const { data } = await service.SignUp({ pegawai_id, username, password});

            res.json(data);
        } catch (error) {
            return res.status(500).json({message: error.message})
        }

    });

    app.post('/logout',  async (req,res,next) => {
        try {
            let temp_token = req.cookies.temp_token;
            if(!temp_token){
                temp_token = req.body.cookies
            }
            if(!temp_token) res.sendStatus(401)
            const data  = await service.Logout({ temp_token, res });
            res.clearCookie('temp_token')
            res.status(200).json({message: "Data Beerhadil Logout"})
            // res.json({message: "Data Beerhadil Logout", status : 200});
        } catch (error) {
            return res.status(500).json({message: error.message})
        }


    });
}
