// document elements
let videoEl = document.querySelector("#video");
let startBtn = document.querySelector("#start");
let stopBtn = document.querySelector("#stop");

console.log(videoEl);

// global variables
let streamObject = null;

// start webCam
function startCamera() {
  if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices
      .getUserMedia({
        audio: false,
        video: true,
      })
      .then((stream) => {
        videoEl.srcObject = stream;
        streamObject = stream;
      });
  } else {
    console.log("Something went wrong!");
  }
}

startBtn.addEventListener("click", () => {
  startCamera();
  console.log("video started");
});

stopBtn.addEventListener("click", () => {
  if (streamObject) {
    streamObject.getTracks().forEach(function (track) {
      if (track.readyState == "live" && track.kind === "video") {
        track.stop();
      }
    });
  }
  console.log("video stopped");
});
