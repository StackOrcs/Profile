// Creative controls. Keep timings and shot direction independent of content.
export const motion = {
  revealDuration:1.1, revealStagger:.045, revealEase:'power4.out',
  scrub:.75, mediaTilt:5, mediaParallax:36, pointerAmount:.15
};
export const scene = {
  fov:36, cameraZ:8.7, mobileCameraZ:8.5, desktopPixelRatio:1.75,
  mobilePixelRatio:1.25, desktopFps:60, mobileFps:30, exposure:1.12,
  anchorX:2.3, desktopScale:1, mobileScale:.60, pointerDepth:.18,
  macroScale:1.8, layerSeparation:1.4,
  // X/Y/Z rotation, scale, layer separation, opacity; angles are radians.
  shots:[
    [.10,-.42,-.06,1.18,0,1], [.16,.63,.04,1.8,.12,0],
    [-.12,1.18,.08,1.65,.5,0], [.22,.44,-.08,1.15,1.4,1],
    [.64,-.65,.10,.98,1.7,0], [-.35,-1.13,-.08,1.8,.7,0],
    [.15,-3.0,.02,1.33,.55,0], [.08,-6.05,-.06,1.12,0,0],
    [.08,-6.7,-.06,.85,0,0], [.08,-7.1,0,.85,0,0],
    [.08,-7.6,0,.85,0,0], [.08,-8,0,.85,0,0],
    [.12,-6.7,-.04,1.12,.25,0], [.12,-6.28,0,.75,0,0]
  ]
};
