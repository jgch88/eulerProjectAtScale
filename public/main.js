const Nes = require('nes');
const $ = require('jquery');

const client = new Nes.Client('ws://localhost:4000');

const start = async() => {

  await client.connect();
  const handler = (update, flags) => {
    $("body").append("<div>" + JSON.stringify(update) + "</div"); 
  }

  client.subscribe('/socket', handler)
};

start();

$("#submitn").click(function() {
  $.ajax({
    type: "POST",
    url: "/socket/create",
    data: { n: $("#n").val() },
    success: function() {},
  })
  //$.post("/socket/create", function(data) {})
});
