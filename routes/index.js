module.exports = app => {
    // routers
    const usersRoutes = require('../routes/user.route');
    const universitasRoutes = require('../routes/universitas.route');
    const fakultasRoutes = require('../routes/fakultas.route');
    const prodiRoutes = require('../routes/prodi.route');

    // use router
    app.use('/api/v1', usersRoutes);
    app.use('/api/v1', universitasRoutes);
    app.use('/api/v1', fakultasRoutes);
    app.use('/api/v1', prodiRoutes);
};
