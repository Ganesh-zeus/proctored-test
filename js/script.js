// document elements
let videoEl = document.querySelector("#video");
let canvasEl = document.querySelector("#canvas");
let startBtn = document.querySelector("#start");
let stopBtn = document.querySelector("#stop");

// global variables
let streamObject = null;
let MODEL_URL = "./../models";
let faceDetectionInterval = null;
let isModelLoaded = false;

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
    isModelLoaded = true;
    console.log("Models loaded successfully");
  })
  .catch(() => {
    console.log("Error: Models failed to load");
  });

async function detectFaces() {
  // detect faces from video
  const detections = await faceapi
    .detectAllFaces(videoEl, new faceapi.SsdMobilenetv1Options())
    .withFaceLandmarks();

  // resizing the detected faces
  const resizedDetections = faceapi.resizeResults(detections, {
    width: canvasEl.width,
    height: canvasEl.height,
  });

  // clear the canvas
  canvasEl.getContext("2d").clearRect(0, 0, canvasEl.width, canvasEl.height);

  // draw rectangle
  faceapi.draw.drawDetections(canvasEl, resizedDetections);

  // draw face landmarks (68 dots)
  faceapi.draw.drawFaceLandmarks(canvasEl, resizedDetections);
}

async function startDetectingFaces() {
  faceDetectionInterval = setInterval(async () => {
    if (isModelLoaded) {
      await detectFaces();
    }
  }, 100);
}

function stopDetectingFaces() {
  clearInterval(faceDetectionInterval);
}

videoEl.addEventListener("play", () => {
  console.log("video play event triggered this line");
});

// start webCam
function startCamera() {
  if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices
      .getUserMedia({
        audio: false,
        video: { width: 600, height: 400 },
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

  startDetectingFaces();
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

  stopDetectingFaces();

  // clear the canvas
  canvasEl.getContext("2d").clearRect(0, 0, canvasEl.width, canvasEl.height);
});
