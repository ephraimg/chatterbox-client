class App {

  constructor(url) {
    this.server = 'http://parse.sfs.hackreactor.com/chatterbox/classes/messages';
    this.rooms = ['lobby'];
    this.storage = [];
    this.friends = [];
    // this.username = window.location.search;
    this.username = 'Ephraim and Rith';
  }

  // createUsername() {
  //   this.username = window.location.search;
  // }

  init() {
    //this.createUsername();
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
        where: {username: "fredx"},
        //order: -createdAt
      },
      success: (data) => {
        this.storage = data.results;
        this.storage.forEach(message => this.renderMessage(message));
        console.log('Success: ', data);
      },
      failure: (data) => {
        console.error(data);
      }        
    });
  }

  handleSubmit() {
    var post = {};
    post.username = this.username;
    // console.log(this.username);

    // console.log('message val: ', $('#message').val());

    post.text = $('#message').val();
    post.roomname = this.rooms[0];
    console.log(JSON.stringify(post));
    this.send(JSON.stringify(post));
  }

  renderMessage(message) {
    var name = message.username;
    var text = message.text;
    var date = message.createdAt;
    var $message = $(`<p><span class="username">${name}:</span><br>
                      ${text} <br> <span class="date">${date}</span></p>`);
    $('#chats').prepend($message);
  }

  clearMessages() {
    $('#chats').empty();
  }

  addRoom(roomName) {
    this.rooms.push(roomName);
    this.renderRoom(roomName);
  }

  renderRoom(roomName) {
    var $room = $(`<option value=${roomName}>${roomName}</option>`);
    $('#roomSelect').prepend($room);
  }

  renderAllRooms() {
    this.rooms.forEach(room => renderRoom(room));
  }

  handleUsernameClick(name) {
    this.friends.push(name);
  }


}

var app = new App();
app.init();
