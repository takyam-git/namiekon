function step4 (){
  console.log("step4");
  window.openMask = false;
  window.emotionFlag = 0;

  var videoInput = document.getElementById('their-video');
  var canvasInput = document.getElementById('compare');
  var canvasOverlay = document.getElementById('overlay')
  var overlayContext = canvasOverlay.getContext('2d');

  var htracker = new headtrackr.Tracker();
  htracker.init(videoInput, canvasInput, false);
  htracker.start();

  var image = new Image();
  var normalImage = new Image();
  var anglyImage = new Image();
  var smileImage = new Image();

  var gender = 0;
  if (gender === 0) {
    normalImage.src = "/images/boy_n.png";
    anglyImage.src = "/images/boy_a.png";
    smileImage.src = "/images/boy_s.png";
  } else {
    normalImage.src = "/images/girl_n.png";
    anglyImage.src = "/images/girl_a.png";
    smileImage.src = "/images/girl_s.png";
  }

  image.src = normalImage.src;

  document.addEventListener("facetrackingEvent", function( event ) {

    console.log({"gender": gender});
    console.log({"感情": window.emotionFlag});
      // if (window.emotionFlag === 0) {
      //   image.src = normalImage.src
      // } else if (window.emotionFlag === 1) {
      //   image.src = anglyImage.src
      // } else if (window.emotionFlag === 2) {
      //   image.src = smileImage.src
      // } else {
      //   image.src = normalImage.src
      // }
    overlayContext.clearRect(0 ,0, canvasOverlay.width, canvasOverlay.height);
    if (event.detection == "CS" && !window.openMask) {
      overlayContext.translate(event.x, event.y)
      overlayContext.rotate(event.angle-(Math.PI/2));
      overlayContext.drawImage(image,(-(event.height/2 + 50)) >> 0, (-(event.height/2 + 50)) >> 0, event.height + 100, event.height + 100);
      overlayContext.rotate((Math.PI/2)-event.angle);
      overlayContext.translate(-event.x, -event.y);
    }
  });

}

