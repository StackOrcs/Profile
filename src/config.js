// Creative controls. Keep timings and shot direction independent of content.
export const motion = {
  revealDuration:.62, revealStagger:.025, revealEase:'power3.out',
  scrub:.22, mediaTilt:4, mediaParallax:30, pointerAmount:.15
};
export const ending = {
  approachViewport:.75,moveUntil:.28,zoomStart:.12,zoomEnd:.82,
  desktopZoom:9,mobileZoom:4.8,
  typeScreens:.85,typeStart:.82,typeFollow:.32,typeEase:'power3.out',
  glyphDuration:.74,glyphStagger:.045,glyphEase:'power4.out',
  opticsPixelRatio:1.25,opticsStrength:.085,opticsBands:7,
  mobileOpticsStrength:.035,mobileOpticsBands:3
};
export const scene = {
  fov:36, cameraZ:8.7, mobileCameraZ:8.5, desktopPixelRatio:1.75,
  mobilePixelRatio:1.25, desktopFps:60, mobileFps:60, exposure:1.12,
  desktopScale:1, mobileScale:.68, pointerDepth:.12, scrollDamping:24,
  layerSeparation:1.4,
  desktopStage:[.54,.16,.94,.85], mobileStage:[.08,.58,.92,.92],
  // Chapter position → X/Y/Z rotation, scale, layer separation (radians).
  // One full identity turn; craft opens it into six parts. Subsequent actors
  // inherit the unwrapped rotation rather than snapping to a new scene.
  shots:[
    {at:0,pose:[.10,-.42,-.04,1.08,0]},
    {at:1,pose:[.16,1.20,.02,1.12,.18]},
    {at:2,pose:[-.12,3.50,.03,1.08,.18]},
    {at:3,pose:[.08,6.05,-.02,1.16,.10]},
    {at:3.20,pose:[-.08,6.48,.01,1.18,.70]},
    {at:3.42,pose:[-.15,6.85,.025,1.18,1.50]},
    {at:3.60,pose:[-.10,7.18,.025,1.12,1.45]},
    {at:3.82,pose:[.08,6.62,-.01,1.18,.90]},
    {at:4,pose:[.12,6.12,-.02,1.12,.08]},
    {at:5,pose:[.32,6.72,.035,1.30,0]},
    {at:6,pose:[.12,6.08,-.035,1.30,0]},
    {at:7,pose:[-.08,6.68,.015,1.35,0]},
    {at:8,pose:[.20,7.10,-.02,1.08,0]},
    {at:9,pose:[-.10,6.55,.02,1.08,0]},
    {at:10,pose:[.08,6.20,-.02,1.08,0]},
    {at:11,pose:[-.06,6.70,.02,1.08,0]},
    {at:12,pose:[.12,6.00,-.025,1.35,0]},
    {at:13,pose:[.06,6.46,.015,1.12,0]},
    {at:14,pose:[.02,Math.PI*2,0,1.12,0]}
  ],
  // Generous sculpture stages. Project chapters deliberately yield to media.
  // Bounds are viewport fractions and interpolate as the story advances.
  stages:[
    {at:0,bounds:[.54,.16,.94,.85]},
    {at:3.6,bounds:[.54,.16,.94,.85]},
    {at:3.8,bounds:[.64,.19,.94,.80]},
    {at:14,bounds:[.64,.19,.94,.80]}
  ]
};
