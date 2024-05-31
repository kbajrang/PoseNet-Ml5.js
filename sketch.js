let capture;
let posenet;
let noseX, noseY;
let singlePose;
let reyex, reyey;
let leyex, leyey;
let skeleton;

function setup() {
    let canvas = createCanvas(800, 500);
    canvas.parent('canvasContainer'); // Attach canvas to a div
    capture = createCapture(VIDEO);
    capture.size(800, 500);
    capture.hide();

    posenet = ml5.poseNet(capture, modelLoaded);
    posenet.on('pose', receivedPoses);
}

function receivedPoses(poses) {
    if (poses.length > 0) {
        singlePose = poses[0].pose;
        skeleton = poses[0].skeleton;
    }
}

function modelLoaded() {
    console.log('Model Loaded');
}

function draw() {
    image(capture, 0, 0, 800, 500);
    if (singlePose) {
        for (let i = 0; i < singlePose.keypoints.length; i++) {
            fill(255, 0, 0);
            ellipse(singlePose.keypoints[i].position.x, singlePose.keypoints[i].position.y, 30);
        }
        stroke(255, 255, 255);
        strokeWeight(5);
        for (let j = 0; j < skeleton.length; j++) {
            line(skeleton[j][0].position.x, skeleton[j][0].position.y, skeleton[j][1].position.x, skeleton[j][1].position.y);
        }
    }
}
