// Creative controls. Keep timings and shot direction independent of content.
export const motion = {
  revealDuration:.62, revealStagger:.025, revealEase:'power3.out',
  scrub:.22, mediaTilt:4, mediaParallax:30, pointerAmount:.15
};
export const scene = {
  fov:36, cameraZ:8.7, mobileCameraZ:8.5, desktopPixelRatio:1.75,
  mobilePixelRatio:1.25, desktopFps:60, mobileFps:60, exposure:1.12,
  desktopScale:1, mobileScale:.68, pointerDepth:.12, scrollDamping:24,
  layerSeparation:1.4, fadeStart:3.96, visibleUntil:4.18,
  desktopStage:[.54,.16,.94,.85], mobileStage:[.08,.58,.92,.92],
  // X/Y/Z rotation, scale and layer separation; angles are radians.
  shots:[
    [.10,-.42,-.04,1.08,0], [.16,.46,.02,1.12,.2],
    [-.12,1.14,.04,1.08,.55], [.22,2.65,-.04,1.12,1.4],
    [.12,5.86,0,1.08,0], [.08,6.28,0,1,0],
    [.08,6.28,0,1,0], [.08,6.28,0,1,0],
    [.08,6.28,0,1,0], [.08,6.28,0,1,0],
    [.08,6.28,0,1,0], [.08,6.28,0,1,0],
    [.08,6.28,0,1,0], [.08,6.28,0,1,0]
  ]
};
