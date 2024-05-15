const { server, app } = require('./src/index');
const { isProduction } = require('./config')

server.listen(app.get('port'), () =>{
    try {
        isProduction ? '' : console.log('Servidor iniciado en http://localhost:' + app.get('port'));
    } catch (error) {
        console.log(error);
    }
})
