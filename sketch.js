// function setup(){
//     createCanvas(800, 500);
//     console.log("setup function");
// }

// function draw(){
//     function getRandomArbitary(min,max){
//         return Math.random()*(max-min)+min;
//     }
//     r=getRandomArbitary(0,255);
//     g=getRandomArbitary(0,255);
//     b=getRandomArbitary(0,255);
    
//     fill(r,g,b);
//     ellipse(mouseX, mouseY, 60, 50);

// }
// let baj_jpg;
// function setup(){
//     createCanvas(800, 500);
//     baj_jpg=loadImage('images/baj.jpg');

// }


// function draw(){
//     image(baj_jpg, mouseX, mouseY,100,100);

// }

let capture;
let posenet;
let noseX, noseY;
let singlePose;
let reyex, reyey;
let leyex, leyey;
let singlePoses,skeleton;

function setup() {
    createCanvas(800, 500);  // Fixed the createCanvas parameters
    capture = createCapture(VIDEO);
    capture.size(800,500);
    capture.hide();

    posenet = ml5.poseNet(capture, modelLoaded);
    posenet.on('pose', receivedPoses);

    baj_image=loadImage('images/baj.jpg');
}

function receivedPoses(poses) {
    console.log(poses);
    if (poses.length > 0) {
        singlePose = poses[0].pose;
        skeleton=poses[0].skeleton;
        noseX = singlePose.nose.x;
        noseY = singlePose.nose.y;

        reyex = singlePose.rightEye.x;
        reyey = singlePose.rightEye.y;

        leyex = singlePose.leftEye.x;
        leyey = singlePose.leftEye.y;
    }
    console.log(noseX + " " + noseY);
}

function modelLoaded() {
    console.log('Model Loaded');
}

function draw() {
    image(capture, 0, 0, 800, 500);  // Updated the image parameters to match the canvas size
    fill(255, 0, 0);

    if (singlePose) {
        for (let i = 0; i < singlePose.keypoints.length; i++) { 
            ellipse(singlePose.keypoints[i].position.x, singlePose.keypoints[i].position.y, 30);
        }
    }
    stroke(255, 255, 255);
    strokeWeight(5);
    for(let j=0;j<skeleton.length;j++){
        line(skeleton[j][0].position.x,skeleton[j][1].position.y,skeleton[j][1].position.x,skeleton[j][0].position.y)
    }
}
