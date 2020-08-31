//script desenvolvido por @WILL
//estudos de reconhecimento facial em JS



//pegando elemento
const video = document.getElementById('video')

//salvandado dados para debug
Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/dados'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/dados'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/dados'),
  faceapi.nets.faceExpressionNet.loadFromUri('/dados')
]).then(startVideo)


//lançamento de função
function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    stream => video.srcObject = stream,
    err => console.error(err)
  )
}

//logica do reconhecimento facial
video.addEventListener('play', () => {
  const canvas = faceapi.createCanvasFromMedia(video)
  document.body.append(canvas)
  const displaySize = { width: video.width, height: video.height }
  faceapi.matchDimensions(canvas, displaySize)
  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    faceapi.draw.drawDetections(canvas, resizedDetections)
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
  }, 100)
})