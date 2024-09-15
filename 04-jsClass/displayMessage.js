let messageClassUniquenessList = [];
class MessageClass {
  constructor(id, topOrBottom = "top", leftOrRight = "right"){
    this.id = "#" + id;
    this.statusMessages = [];
    this.isShowingMessage = false;

    function createUniqueness(){
      var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      var idLength = 8;
      var randomId = '';
      for (var i = 0; i < idLength; i++) {
        var randomIndex = Math.floor(Math.random() * characters.length);
        if(i==0){
          randomIndex = Math.floor(Math.random() * (characters.length - 10));
        }
        randomId += characters.charAt(randomIndex);
      }
      return randomId;
    }

    let uniqueness = createUniqueness()
    while(messageClassUniquenessList.includes(uniqueness)){
      uniqueness = createUniqueness()
    }

    messageClassUniquenessList.push(uniqueness);
    this.uniqueness = uniqueness;

    $("body").append(`<p id="${id}-${this.uniqueness}" style="padding-right: 1em; padding-left: 1em; position: fixed; ${topOrBottom}: 0; ${leftOrRight}: 0;"></p>`);
  }

  addMessage(message){
    const self = this;
    console.log(message);
    function showStatusMessage(){
      if(self.isShowingMessage){
        $(`${self.id}-${self.uniqueness}`).text("");
        setTimeout(() => {
          const message = self.statusMessages.shift();
          showStatusMessageUnit(message);
        }, 500);
      } else {
        const message = self.statusMessages.shift();
        showStatusMessageUnit(message);
      }
      self.isShowingMessage = true;
    }

    function showStatusMessageUnit(message){
      $(`${self.id}-${self.uniqueness}`).text(message);
      setTimeout(function(){
        if(self.statusMessages.length == 0){
          $(`${self.id}-${self.uniqueness}`).text("");
          self.isShowingMessage = false;
        } else{
          showStatusMessage();
        }
      }, 2000);
    }

    this.statusMessages.push(message);
    if(!self.isShowingMessage){
      showStatusMessage();
    }
  }
}