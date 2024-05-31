let capture;
let posenet;
let capturedPhoto;
let analyzing = false;
let poses = [];
let useBackCamera = true;

function setup() {
    let canvas = createCanvas(800, 500);
    canvas.parent('canvasContainer');
    startCapture();

    posenet = ml5.poseNet(modelLoaded);
    posenet.on('pose', (results) => poses = results);

    let captureButton = document.getElementById('captureButton');
    captureButton.addEventListener('click', capturePhoto);

    let analyzeButton = document.getElementById('analyzeButton');
    analyzeButton.addEventListener('click', analyzePhoto);

    let refreshButton = document.getElementById('refreshButton');
    refreshButton.addEventListener('click', resetCapture);

    let toggleCameraButton = document.getElementById('toggleCameraButton');
    toggleCameraButton.addEventListener('click', toggleCamera);
}

function modelLoaded() {
    console.log('Model Loaded');
}

function draw() {
    if (capturedPhoto) {
        image(capturedPhoto, 0, 0, 800, 500);
        drawKeypoints();
        drawSkeleton();
    } else {
        image(capture, 0, 0, 800, 500);
    }
}

function drawKeypoints() {
    for (let i = 0; i < poses.length; i++) {
        let pose = poses[i].pose;
        for (let j = 0; j < pose.keypoints.length; j++) {
            let keypoint = pose.keypoints[j];
            if (keypoint.score > 0.2) {
                fill(255, 0, 0);
                noStroke();
                ellipse(keypoint.position.x, keypoint.position.y, 10);
            }
        }
    }
}

function drawSkeleton() {
    for (let i = 0; i < poses.length; i++) {
        let skeleton = poses[i].skeleton;
        for (let j = 0; j < skeleton.length; j++) {
            let partA = skeleton[j][0];
            let partB = skeleton[j][1];
            stroke(255, 255, 255);
            strokeWeight(2);
            line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
        }
    }
}

function capturePhoto() {
    capturedPhoto = capture.get();
    capture.stop();
    document.getElementById('analyzeButton').style.display = 'inline';
}

function analyzePhoto() {
    analyzing = true;
    if (capturedPhoto) {
        posenet.singlePose(capturedPhoto, function (err, result) {
            if (!err) {
                console.log('PoseNet analysis result:', result);
                receivedPoses([result]);
                let poseName = classifyPose(result.pose.keypoints);
                document.getElementById('poseName').innerText = poseName;
                provideFeedback(result.pose, idealPose);
            } else {
                console.error('Error analyzing photo:', err);
            }
        });
    } else {
        console.error('No captured photo found.');
    }
}

function resetCapture() {
    startCapture();
    capturedPhoto = null;
    poses = [];
    document.getElementById('analyzeButton').style.display = 'none';
    document.getElementById('feedback').innerHTML = '';
    document.getElementById('poseName').innerText = '';
}

function startCapture() {
    if (capture) {
        capture.remove();
    }
    const constraints = {
        video: {
            facingMode: useBackCamera ? { exact: "environment" } : "user" // Use back or front camera
        }
    };
    capture = createCapture(constraints);
    capture.size(800, 500);
    capture.hide();
}

function toggleCamera() {
    useBackCamera = !useBackCamera;
    resetCapture();
}

function provideFeedback(userPose, idealPose) {
    let feedback = '';
    for (let i = 0; i < userPose.keypoints.length; i++) {
        let userPoint = userPose.keypoints[i].position;
        let idealPoint = idealPose.keypoints[i].position;
        let distance = dist(userPoint.x, userPoint.y, idealPoint.x, idealPoint.y);
        if (distance > threshold) {
            fill(255, 0, 0);
            noStroke();
            ellipse(userPoint.x, userPoint.y, 10);
            feedback += `Adjust your ${userPose.keypoints[i].part}<br>`;
        }
    }
    document.getElementById('feedback').innerHTML = feedback;
}

function classifyPose(keypoints) {
    // Placeholder logic to classify pose based on keypoints
    return "Tadasana"; // Example pose name
}

function receivedPoses(results) {
    poses = results;
}
