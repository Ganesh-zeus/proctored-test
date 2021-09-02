// document elements
let videoEl = document.querySelector("#video");
let startBtn = document.querySelector("#start");
let stopBtn = document.querySelector("#stop");

// global variables
let streamObject = null;
let MODEL_URL = "./../models";

Promise.all([
  // face detection models
  faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
  faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),

  // face landmark model
  faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),

  // face recognition model
  faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
])
  .then(() => {
    console.log("Models loaded successfully");
  })
  .catch(() => {
    console.log("Error: Models failed to load");
  });

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
