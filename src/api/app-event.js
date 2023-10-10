const AuthService = require("../services/auth-service");
const bodyParser = require('body-parser');

module.exports = (app) => {
    app.use(bodyParser.json()); // for parsing application/json
    app.use(bodyParser.urlencoded({ extended: true }));
    const service = new AuthService();

    app.use('/app-events', async (req,res,next) => {

        const { payload } = req.body;
        const send =  await service.SubscribeEvents(payload);
        res.json(send);

    });

}
