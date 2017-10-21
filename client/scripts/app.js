class App {

  constructor(url) {
    this.server = 'http://parse.sfs.hackreactor.com/chatterbox/classes/messages';
    this.rooms = [];
    this.storage = [];
    this.friends = [];
  }

  init() {
    $(document).ready(() => {
      this.fetch();
      $('#send').on('submit', e => {
        e.stopPropagation();
        e.preventDefault();
        (this.handleSubmit.bind(this))();
      });
      $(document).on('click', '.username', e => {
        e.stopPropagation();
        e.preventDefault();
        this.handleUsernameClick(e.target.textContent);
      });
      $('#roomSelect').change(e => {
        var selected = $('#roomSelect').find('option:selected').text().trim().replace(/\s\s+/g, ' ');
        if (selected === 'Add room') {
          var add = prompt('Enter room name');
          // if (add.length < 1) {
          //   add = prompt('Enter room name');
          // }
          this.rooms.push(add);
          $('.room').detach();
          this.rooms.sort();
          this.renderAllRooms();
          // select the new room!
          $("#roomSelect").val(add);
          console.log('rendered rooms');


        } else {
          // empty the chats div
          this.clearMessages();
          // iterate through all chats in storage
          this.storage.forEach(message => {
            // compare room name of chat to selected roomname
            if (message.roomname === $('#roomSelect').find('option:selected').text().trim().replace(/\s\s+/g, ' ')) {
              // if match, render room
              this.renderMessage(message);
            }
          });
          console.log('Selected a room!', $('#roomSelect').find('option:selected').text().trim().replace(/\s\s+/g, ' '));

        }


      });

    });
  }

  send(message) {
    $.ajax({
      url: this.server,
      type: 'POST',
      data: message,
      contentType: 'application/jsonp',
      success: (data) => {
        console.log('Success: ', data);
      },
      failure: (data) => {
        console.error(data);
      }  
    });
  }

  fetch() {
    $.ajax({
      url: this.server,
      type: 'GET',
      data: {
        where: {
          // 'username': 'fredx'
          'username': {
            '$ne': 'undefined',
            '$exists': true
          },
        },       
        order: '-createdAt',
        limit: 1000
      },
      success: (data) => {
        console.log('Fetched!');
        this.storage = data.results;
        this.clearMessages();
        this.storage.forEach(message => this.renderMessage(message));

        this.storage.forEach(message => {
          if (this.rooms.indexOf(message.roomname) === -1 && 
            message.roomname !== 'lobby' && message.roomname !== 'Add room') {
            this.rooms.push(message.roomname);        
          }
          this.rooms.sort();
        });
        this.renderAllRooms();
      },
      failure: (data) => {
        console.error(data);
      }        
    });
  }

  handleSubmit() {
    var post = {};
    var urlParams = new URLSearchParams(window.location.search);
    post.username = urlParams.get('username');
    post.text = $('#message').val();
    post.roomname = $('#roomSelect').find('option:selected').text().trim().replace(/\s\s+/g, ' ');
    console.log(JSON.stringify(post));
    this.send(JSON.stringify(post));
  }

  renderMessage(message) {
    var name = DOMPurify.sanitize(message.username);
    var text = DOMPurify.sanitize(message.text);
    var room = DOMPurify.sanitize(message.roomname);
    var date = message.createdAt;
    var $message = $(`<span class="username">${name}:</span><br>
                      <p>${text}</p>
                      <span>in room: ${room}</span><br>
                      <span class="date">${date}</span></p>`);
    $('#chats').append($message);
  }

  clearMessages() {
    $('#chats').empty();
  }

  addRoom(roomName) {
    this.rooms.push(roomName);
    this.renderRoom(roomName);
  }

  renderRoom(roomName) {
    var $room = $(`<option class="room" value=${DOMPurify.sanitize(roomName)}>
                      ${DOMPurify.sanitize(roomName)}
                  </option>`);
    //var $room = $('<option value="lobby">lobby</option>');
    $('#roomSelect').append($room);
  }

  renderAllRooms() {
    this.rooms.forEach(room => this.renderRoom(room));
  }

  handleUsernameClick(name) {
    this.friends.push(name);
  }


}

var app = new App();
app.init();
//setInterval(function() {  app.fetch(); }, 30000);

