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
        // empty the chats div
        // iterate through all chats in storage
        // compare room name of chat to selected roomname
        // if match, render room
        console.log('Selected a room!', $('#roomSelect').find('option:selected').text().replace(/\s\s+/g, ' '));
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
        //where: {username: "fredx"},
        order: '-createdAt',
        limit: 100
      },
      success: (data) => {
        this.storage = data.results;

        this.storage.forEach(message => this.renderMessage(message));

        this.storage.forEach(message => {
          if (this.rooms.indexOf(message.roomname) === -1) {
            this.rooms.push(message.roomname);        
          }
          this.rooms.sort();
        });
        this.renderAllRooms();
        // console.log('Success: ', JSON.stringify(data));
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
    post.roomname = $('#roomSelect').find('option:selected').text().replace(/\s\s+/g, ' ');
    console.log(JSON.stringify(post));
    this.send(JSON.stringify(post));
  }

  renderMessage(message) {
    var name = message.username;
    var text = message.text;
    var date = message.createdAt;
    var $message = $(`<p><span class="username">${name}:</span><br>
                      ${text} <br> <span class="date">${date}</span></p>`);
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
    var $room = $(`<option value=${roomName}>
                      ${roomName}
                  </option>`);
    //var $room = $('<option value="lobby">lobby</option>');
    $('#roomSelect').prepend($room);
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
