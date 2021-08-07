module.exports = app => {
    // routers
    const usersRoutes = require('../routes/user.route');
    const universitasRoutes = require('../routes/universitas.route');
    const fakultasRoutes = require('../routes/fakultas.route');
    const prodiRoutes = require('../routes/prodi.route');
    const dashboard = require('../routes/dashboard.mobile');
    const agenda = require('../routes/agenda');
    const user_agenda = require('../routes/user_agenda');
    const consumer = require('../routes/consumer');
    const push = require('../routes/push');


    // use router
    app.use('/api/v1', usersRoutes);
    app.use('/api/v1', universitasRoutes);
    app.use('/api/v1', fakultasRoutes);
    app.use('/api/v1', prodiRoutes);
    app.use('/api/v1', dashboard);
    app.use('/api/v1', agenda);
    app.use('/api/v1', user_agenda);
    app.use('/api/v1', consumer);
    app.use('/api/v1', push);
};
