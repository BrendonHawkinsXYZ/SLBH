// Shaders for the billboarded cards. The vertex shader reconstructs each
// card's world-space center from its model matrix, orients the quad to face
// the camera using the view matrix right and up vectors, and lets the
// perspective projection size the card by distance, so far cards read smaller
// and near cards larger with no manual scaling. The fragment shader samples
// the assigned texture and feathers the edges with a rounded-rect mask, so the
// cards dissolve into the dark rather than sitting in hard frames.

export const cardVertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uWidth;
  uniform float uHeight;
  uniform float uBobAmp;
  uniform float uBobSpeed;
  uniform float uBobPhase;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    // World-space center of this card, read from the model matrix translation.
    vec3 center = (modelMatrix * vec4(0.0, 0.0, 0.0, 1.0)).xyz;
    // A slow vertical bob keyed to time and a per-card phase, so the field breathes.
    center.y += uBobAmp * sin(uTime * uBobSpeed + uBobPhase);
    // Camera right and up in world space, taken from the rows of the view
    // matrix, so the quad always faces the camera.
    vec3 right = vec3(viewMatrix[0].x, viewMatrix[1].x, viewMatrix[2].x);
    vec3 up = vec3(viewMatrix[0].y, viewMatrix[1].y, viewMatrix[2].y);
    // The plane spans -0.5 to 0.5, so position.xy are corner offsets, scaled
    // here by the card's world-unit size; the long edge is fixed and the short
    // edge follows the asset aspect ratio.
    vec3 worldPos = center + right * (position.x * uWidth) + up * (position.y * uHeight);
    gl_Position = projectionMatrix * viewMatrix * vec4(worldPos, 1.0);
  }
`;

export const cardFragmentShader = /* glsl */ `
  precision highp float;
  uniform sampler2D uTex;
  uniform float uReveal;
  uniform float uFeather;
  varying vec2 vUv;

  // Signed distance to a rounded rectangle, negative inside, used to feather
  // the card edges with a wide smoothstep so they melt softly into the dark.
  float roundedRectSDF(vec2 p, vec2 halfSize, float radius) {
    vec2 q = abs(p) - (halfSize - radius);
    return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - radius;
  }

  void main() {
    vec4 tex = texture2D(uTex, vUv);
    vec2 p = vUv - 0.5;
    float dist = roundedRectSDF(p, vec2(0.5), 0.12);
    float mask = 1.0 - smoothstep(-uFeather, 0.0, dist);
    float alpha = tex.a * mask * uReveal;
    if (alpha < 0.001) discard;
    gl_FragColor = vec4(tex.rgb, alpha);
  }
`;
