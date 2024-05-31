let capture;
let posenet;
let capturedPhoto;
let analyzing = false;
let poses = []; // Store detected poses

function setup() {
    let canvas = createCanvas(800, 500);
    canvas.parent('canvasContainer'); // Attach canvas to a div

    // Create video capture
    capture = createCapture(VIDEO);
    capture.size(800, 500);
    capture.hide();

    // Initialize PoseNet
    posenet = ml5.poseNet(modelLoaded);
    posenet.on('pose', receivedPoses);

    // Add event listener to the capture button
    let captureButton = document.getElementById('captureButton');
    captureButton.addEventListener('click', capturePhoto);

    // Add event listener to the analyze button
    let analyzeButton = document.getElementById('analyzeButton');
    analyzeButton.addEventListener('click', analyzePhoto);

    // Add event listener to the refresh button
    let refreshButton = document.getElementById('refreshButton');
    refreshButton.addEventListener('click', resetCapture);
}

function receivedPoses(results) {
    poses = results; // Store detected poses
}

function modelLoaded() {
    console.log('Model Loaded');
}

function draw() {
    if (capturedPhoto) {
        image(capturedPhoto, 0, 0, 800, 500); // Draw the captured photo
        // Display keypoints and skeleton on the captured photo
        for (let i = 0; i < poses.length; i++) {
            let pose = poses[i].pose;
            let skeleton = poses[i].skeleton;
            // Draw keypoints
            for (let j = 0; j < pose.keypoints.length; j++) {
                fill(255, 0, 0);
                noStroke();
                ellipse(pose.keypoints[j].position.x, pose.keypoints[j].position.y, 10);
            }
            // Draw skeleton
            stroke(255, 255, 255);
            strokeWeight(2);
            for (let j = 0; j < skeleton.length; j++) {
                let partA = skeleton[j][0];
                let partB = skeleton[j][1];
                line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
            }
        }
    } else {
        image(capture, 0, 0, 800, 500); // Draw the video capture
    }
}

function capturePhoto() {
    // Capture the current frame and assign it to capturedPhoto
    capturedPhoto = capture.get();
    
    // Stop live video feed
    capture.stop();
    
    // Show the analyze button
    document.getElementById('analyzeButton').style.display = 'inline';
}

function analyzePhoto() {
    analyzing = true;
    if (capturedPhoto) {
        // Analyze the captured photo with PoseNet
        posenet.singlePose(capturedPhoto, function (err, result) {
            if (!err) {
                console.log('PoseNet analysis result:', result);
                receivedPoses([result]);
            } else {
                console.error('Error analyzing photo:', err);
            }
        });
    } else {
        console.error('No captured photo found.');
    }
}

function resetCapture() {
    // Start the video capture again
    capture = createCapture(VIDEO);
    capture.size(800, 500);
    capture.hide();
    
    // Clear the captured photo and poses
    capturedPhoto = null;
    poses = [];
    
    // Hide the analyze button
    document.getElementById('analyzeButton').style.display = 'none';
}
