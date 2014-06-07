// Compatibility shim
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

// PeerJS object
var peer = new Peer({ key: '71xxk54atsps0pb9',  debug: 3});

peer.on('open', function(){
  $('#my-id').text(peer.id);
});

// Receiving a call
peer.on('call', function(call){
  // Answer the call automatically (instead of prompting user) for demo purposes
  console.log(call);
  call.answer(window.localStream);
  step3(call);
});
peer.on('error', function(err){
  alert(err.message);
  // Return to step 2 if error occurs
  step2();
});

// Click handlers setup
$(function(){
  $('#make-call').click(function(){
    // Initiate a call!
    var call = peer.call($('#callto-id').val(), window.localStream);

    step3(call);
  });

  $('#end-call').click(function(){
    window.existingCall.close();
    step2();
  });

  // Retry if getUserMedia fails
  $('#step1-retry').click(function(){
    $('#step1-error').hide();
    step1();
  });

  // open mask
  $('#open-mask').click(function(){
    sendOpenMask();
  });

  // Get things started
  step1();
});

function step1 () {
  // Get audio/video stream
  navigator.getUserMedia({audio: true, video: true}, function(stream){
    // Set your video displays
    // $('#my-video').prop('src', URL.createObjectURL(stream));

    window.localStream = stream;
    step2();
  }, function(){ $('#step1-error').show(); });
}

function step2 () {
  $('#step1, #step3').hide();
  $('#step2').show();
}

function step3 (call) {
  // Hang up on an existing call if present
  if (window.existingCall) {
    window.existingCall.close();
  }

  // Wait for stream on the call, then set peer video display
  call.on('stream', function(stream){
    $('#their-video').prop('src', URL.createObjectURL(stream));
  });

  // UI stuff
  window.existingCall = call;
  $('#their-id').text(call.peer);
  call.on('close', step2);
  $('#step1, #step2').hide();
  $('#step3').show();

  step4();
}


/////////////////////////////////
// chat message
var connectedPeers = {};
peer.on('connection', connect);
function connect(c) {
  console.log("CONNECTION");
  console.log(c);
  // Handle a chat connection.
  if (c.label === 'openMask') {
    console.log(c.label);
    console.log(c.label === 'openMask' );
    window.openMask = true;
  }
  connectedPeers[c.peer] = 1;
}

function sendOpenMask() {
  requestedPeerId = window.existingCall.peer;
  if (!connectedPeers[requestedPeerId]) {
    var c = peer.connect(requestedPeerId, {
      label: 'openMask',
      serialization: 'none',
      metadata: {message: '真の姿を見せる時が来た！'}
    });
    c.on('open', function() {
      connect(c);
    });
    c.on('error', function(err) { alert(err); });
  }
  connectedPeers[requestedPeerId] = 1;
}

