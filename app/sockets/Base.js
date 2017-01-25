var Comment = require('../../app/controllers/Comments.js');
module.exports = function(io) {
    io.on('connection', function (socket) {
        // comptage d'utilisateur en ligne
        socket.broadcast.emit('UserState', io.engine.clientsCount);
        socket.emit('UserState', io.engine.clientsCount);

        socket.on('disconnect', function () {
            socket.broadcast.emit('UserState', io.engine.clientsCount);
        });
        // reception du socket client, mise en BDD via controller puis emission du comment à tout utilisateur
        socket.on('comment', function (comment) {
            Comment.create(comment.author, comment.email, comment.content, comment.id);
            io.emit('comment', comment);
        });
    });
};

