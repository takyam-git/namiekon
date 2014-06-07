function step4 (){
  console.log("step4");
  window.openMask = false;
  var videoInput = document.getElementById('their-video');
  var canvasInput = document.getElementById('compare');
  var canvasOverlay = document.getElementById('overlay')
  var overlayContext = canvasOverlay.getContext('2d');

  var htracker = new headtrackr.Tracker();
  htracker.init(videoInput, canvasInput, false);
  htracker.start();

  var image = new Image();
  setImage = function(index){
    if (index) {
      image.src = "/images/test.png";
    }
  }
  setImage(1);

  document.addEventListener("facetrackingEvent", function( event ) {
    overlayContext.clearRect(0 ,0, canvasOverlay.width, canvasOverlay.height);
    if (event.detection == "CS" && !window.openMask) {
      overlayContext.translate(event.x, event.y)
      overlayContext.rotate(event.angle-(Math.PI/2));
      overlayContext.drawImage(image,(-(event.height/2 + 25)) >> 0, (-(event.height/2 + 25)) >> 0, event.height + 50, event.height + 50);
      overlayContext.rotate((Math.PI/2)-event.angle);
      overlayContext.translate(-event.x, -event.y);
    }
  });

}

