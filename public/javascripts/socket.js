
var socket = io();

// on prend le form de l'id #chat
$('#comment form').submit(function (e) {
    e.preventDefault();
    var comment = {
        // valeur : contenu de la variable de l'id donnée
        author : $('#a').val(), 
        email : $('#e').val(),
        content : $('#m').val(),
        id : $('#i').val()
    };
    // on vide le champ message pour un nouveau commentaire
    $('#m').val('');
    // Gestion comment vide
    if (comment.author.trim().length !== 0 || comment.email.trim().length !== 0 || comment.content.trim().length !== 0) {
        socket.emit('comment', comment);
    }
    // Focus sur le champ du comment
    $('#comment input').focus();
});

// reception du comment par le socket et affichage pour l'utilisateur
socket.on('comment', function (comment) {
    $('#add-comment').append($('<div class="bottom-comment">').html('<div class="comment-img"><img src="/images/imagesusers/users.png" alt="" class="img-circle"/></div>' +
        '<div class="comment-text"><a href="#name" class="replay btn pull-right"> Répondre</a>' +
        '<h5>' + comment.author + '</h5>' +
        '<p class="comment-date">' + comment.email + '</p>' +
        '<p class="para">' + comment.content + '</p>' +
        '</div>'
    ));
});