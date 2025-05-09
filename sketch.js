// Hand Pose Detection with ml5.js
// https://thecodingtrain.com/tracks/ml5js-beginners-guide/ml5/hand-pose

let video;
let handPose;
let hands = [];
let circleX, circleY; // Circle position
let circleRadius = 50; // Circle radius
let prevCircleX, prevCircleY; // Previous circle position
let isDragging = false; // Flag to track if the circle is being dragged

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
  circleX = width / 2;
  circleY = height / 2;
  prevCircleX = circleX;
  prevCircleY = circleY;

  // Start detecting hands
  handPose.detectStart(video, gotHands);
}

function draw() {
  image(video, 0, 0);

  // Draw the circle
  fill(0, 255, 0); // Green circle
  noStroke();
  circle(circleX, circleY, circleRadius * 2);

  // Ensure at least one hand is detected
  if (hands.length > 0) {
    let circleMoved = false; // Track if the circle was moved in this frame

    for (let hand of hands) {
      if (hand.confidence > 0.1) {
        // Loop through keypoints and draw circles
        for (let i = 0; i < hand.keypoints.length; i++) {
          let keypoint = hand.keypoints[i];

          // Color-code based on left or right hand
          if (hand.handedness == "Left") {
            fill(255, 0, 255); // Magenta for left hand
          } else {
            fill(255, 255, 0); // Yellow for right hand
          }

          noStroke();
          circle(keypoint.x, keypoint.y, 16);
        }

        // Draw lines connecting keypoints for each finger
        let fingers = [
          [0, 1, 2, 3, 4],    // Thumb
          [5, 6, 7, 8],       // Index finger
          [9, 10, 11, 12],    // Middle finger
          [13, 14, 15, 16],   // Ring finger
          [17, 18, 19, 20]    // Pinky
        ];

        stroke(255); // Set line color to white
        strokeWeight(2); // Set line thickness

        for (let finger of fingers) {
          for (let j = 0; j < finger.length - 1; j++) {
            let start = hand.keypoints[finger[j]];
            let end = hand.keypoints[finger[j + 1]];

            // Check if start and end points are valid
            if (start && end) {
              line(start.x, start.y, end.x, end.y);
            }
          }
        }

        // Check if the index finger (keypoint 8) touches the circle
        let indexFinger = hand.keypoints[8];
        if (indexFinger) {
          let d = dist(indexFinger.x, indexFinger.y, circleX, circleY);
          if (d < circleRadius) {
            // Move the circle to follow the index finger
            prevCircleX = circleX;
            prevCircleY = circleY;
            circleX = indexFinger.x;
            circleY = indexFinger.y;
            circleMoved = true;
          }
        }
      }
    }

    // If the circle was moved, draw the trail
    if (circleMoved) {
      stroke(255, 0, 0); // Red trail
      strokeWeight(2);
      line(prevCircleX, prevCircleY, circleX, circleY);
      isDragging = true;
    } else {
      isDragging = false;
    }
  }
}
