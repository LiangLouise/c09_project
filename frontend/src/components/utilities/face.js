import * as faceapi from 'face-api.js';

// Load models and weights
export async function loadModels() {
  const MODEL_URL = '/models';
  await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
  await faceapi.nets.faceLandmark68TinyNet.loadFromUri(MODEL_URL);
  await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
  await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
}

export async function getFullFaceDescription(blob, displaySize) {
  await loadModels();
  // tiny_face_detector options
  let scoreThreshold = 0.6;
  const OPTION = new faceapi.TinyFaceDetectorOptions({
    scoreThreshold
  });
  const useTinyModel = true;

  // fetch image to api
  let img = await faceapi.fetchImage(blob);

  let fullDesc = await faceapi
    .detectSingleFace(img, OPTION)
    .withFaceLandmarks(useTinyModel)
    .withFaceDescriptor();

  fullDesc = faceapi.resizeResults(fullDesc, displaySize);
  return fullDesc;
}

const maxDescriptorDistance = 0.5;
export async function createMatcher(faceProfile) {
  // Create labeled descriptors of member from profile
  let members = Object.keys(faceProfile);
  let labeledDescriptors = members.map(
    member =>
      new faceapi.LabeledFaceDescriptors(
        faceProfile[member].name,
        faceProfile[member].descriptors.map(
          descriptor => new Float32Array(descriptor)
        )
      )
  );

  // Create face matcher (maximum descriptor distance is 0.5)
  let result = new faceapi.FaceMatcher(
    labeledDescriptors,
    maxDescriptorDistance
  );
  return result;
}