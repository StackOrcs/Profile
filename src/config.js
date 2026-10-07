// Creative controls. Keep timings and shot direction independent of content.
export const motion = {
  revealDuration:.62, revealStagger:.025, revealEase:'power3.out',
  scrub:.22, mediaTilt:4, mediaParallax:30, pointerAmount:.15
};
export const scene = {
  fov:36, cameraZ:8.7, mobileCameraZ:8.5, desktopPixelRatio:1.75,
  mobilePixelRatio:1.25, desktopFps:60, mobileFps:60, exposure:1.12,
  desktopScale:1, mobileScale:.68, pointerDepth:.12, scrollDamping:24,
  layerSeparation:1.4,
  desktopStage:[.54,.16,.94,.85], mobileStage:[.08,.58,.92,.92],
  // Chapter position → X/Y/Z rotation, scale, layer separation (radians).
  // Craft has its own longer front → inner layers → front sequence.
  shots:[
    {at:0,pose:[.10,-.42,-.04,1.08,0]},
    {at:1,pose:[.16,.35,.02,1.12,.18]},
    {at:2,pose:[-.12,.90,.03,1.08,.38]},
    {at:3,pose:[.08,-.24,-.02,1.16,.10]},
    {at:3.20,pose:[-.08,.20,.01,1.18,.70]},
    {at:3.42,pose:[-.15,.58,.025,1.18,1.50]},
    {at:3.60,pose:[-.10,.94,.025,1.12,1.45]},
    {at:3.82,pose:[.08,.25,-.01,1.18,.50]},
    {at:4,pose:[.12,-.18,-.02,1.12,.08]},
    {at:5,pose:[-.06,.48,.035,1.08,.46]},
    {at:6,pose:[.12,-.32,-.035,1.10,.22]},
    {at:7,pose:[-.08,.38,.015,1.10,.10]},
    {at:8,pose:[.10,-.18,-.02,1.08,0]},
    {at:9,pose:[-.10,.32,.02,1.08,.16]},
    {at:10,pose:[.08,-.28,-.02,1.08,.30]},
    {at:11,pose:[-.06,.42,.02,1.08,.20]},
    {at:12,pose:[.12,-.35,-.025,1.12,.08]},
    {at:13,pose:[.06,.18,.015,1.12,0]},
    {at:14,pose:[.12,-.18,-.02,1.12,0]}
  ],
  // Large studio portrait → margin signature around actual media → portrait.
  // Bounds are viewport fractions and interpolate as the story advances.
  stages:[
    {at:0,bounds:[.54,.16,.94,.85]},
    {at:3.6,bounds:[.54,.16,.94,.85]},
    {at:3.8,bounds:[.64,.19,.94,.80]},
    {at:7.55,bounds:[.64,.19,.94,.80]},
    {at:8,bounds:[.922,.30,.974,.48]},
    {at:11.8,bounds:[.922,.30,.974,.48]},
    {at:12,bounds:[.64,.19,.94,.80]},
    {at:14,bounds:[.64,.19,.94,.80]}
  ]
};
