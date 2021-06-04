function onXRFrame(t, frame) {
  let xrSession = frame.session;
  // The frame of reference, which was set elsewhere, is 'eye-level'.
  // See onSessionStarted() ins the sample code for details.
  let xrPose = frame.getDevicePose(xrFrameOfRef);
  if (xrPose && xrPose.poseModelMatrix) {
    // Calculate the origin and direction for the raycast.
    xrSession.requestHitTest(rayOrigin, rayDirection, xrFrameOfRef)
    .then((results) => {
      if (results.length) {
        // Draw for each view.
      }
    });
  }
  session.requestAnimationFrame(onXRFrame);
}
