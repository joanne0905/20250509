// Hand Pose Detection with ml5.js
// https://thecodingtrain.com/tracks/ml5js-beginners-guide/ml5/hand-pose

let video;
let handPose;
let hands = [];
let circleX, circleY; // Circle position
let circleRadius = 50; // Circle radius

function preload() {
  // Initialize HandPose model with flipped video input
  handPose = ml5.handPose({ flipped: true });
}

function mousePressed() {
  console.log(hands);
}

function gotHands(results) {
  hands = results;
}

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO, { flipped: true });
  video.hide();

  // Initialize circle position at the center of the canvas
  circleX = width / 2; // Set circle's X position to canvas center
  circleY = height / 2; // Set circle's Y position to canvas center
  circleRadius = 50; // Set circle radius
}

function draw() {
  image(video, 0, 0);

  // Draw the circle
  fill(0, 255, 0); // Set circle color to green
  noStroke(); // Remove circle border
  circle(circleX, circleY, circleRadius * 2); // Draw the circle

  // Ensure at least one hand is detected
  if (hands.length > 0) {
    for (let hand of hands) {
      if (hand.confidence > 0.1) {
        // Draw keypoints and lines (existing code)
        for (let i = 0; i < hand.keypoints.length; i++) {
          let keypoint = hand.keypoints[i];
          if (hand.handedness == "Left") {
            fill(255, 0, 255); // Left hand: magenta
          } else {
            fill(255, 255, 0); // Right hand: yellow
          }
          noStroke();
          circle(keypoint.x, keypoint.y, 16);
        }

        // Check if the index finger (keypoint 8) touches the circle
        let indexFinger = hand.keypoints[8];
        if (indexFinger) {
          let d = dist(indexFinger.x, indexFinger.y, circleX, circleY);
          if (d < circleRadius) {
            // Move the circle to follow the index finger
            circleX = indexFinger.x;
            circleY = indexFinger.y;
          }
        }
      }
    }
  }
}
