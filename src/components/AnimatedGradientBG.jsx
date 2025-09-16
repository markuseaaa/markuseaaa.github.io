import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";

function AnimatedPlane() {
  const matRef = useRef();
  const { viewport } = useThree();
  const { width: vw, height: vh } = viewport;

  const fragmentShader = /* glsl */ `
  precision highp float;

  uniform float u_time;
  uniform float u_aspect;
  varying vec2 vUv;

  float gauss(vec2 p, vec2 c, float s){
    float d = length(p - c);
    return exp(-(d*d)/(2.0*s*s));
  }
  float hash(float n){ return fract(sin(n)*43758.5453123); }
  vec2 rand2(float n){
    return vec2(
      fract(sin(n*12.9898)*43758.5453),
      fract(sin((n+1.0)*78.233)*43758.5453)
    );
  }

  void main() {
    vec2 p = vUv - 0.5;
    p.x *= u_aspect;

    float t = u_time * 0.25;

    // Lidt større og færre splashes:
    const int N = 7;
    float sigma  = 0.20;
    float rScale = 0.95;

    float wLilac = 0.0, wTurq = 0.0, wWhite = 0.0;

    // LILAC
    for (int i=0;i<N;i++){
      float fi = float(i);
      vec2 base = (rand2(10.0+fi) * 2.0 - 1.0) * vec2(rScale*u_aspect, rScale);
      float ang  = t*(0.55 + 0.10*fi);
      vec2 c = vec2(
        base.x*cos(ang) - base.y*sin(ang),
        base.x*sin(ang) + base.y*cos(ang)
      );
      wLilac += gauss(p, c, sigma);
    }
    // TURQ
    for (int i=0;i<N;i++){
      float fi = float(i);
      vec2 base = (rand2(20.0+fi) * 2.0 - 1.0) * vec2(rScale*u_aspect, rScale);
      float ang  = -t*(0.50 + 0.09*fi);
      vec2 c = vec2(
        base.x*cos(ang) - base.y*sin(ang),
        base.x*sin(ang) + base.y*cos(ang)
      );
      wTurq += gauss(p, c, sigma);
    }
    // BEIGE ("white")
    for (int i=0;i<N;i++){
      float fi = float(i);
      vec2 base = (rand2(30.0+fi) * 2.0 - 1.0) * vec2(rScale*u_aspect, rScale);
      float ang  = t*(0.45 + 0.08*fi);
      vec2 c = vec2(
        base.x*cos(ang) - base.y*sin(ang),
        base.x*sin(ang) + base.y*cos(ang)
      );
      wWhite += gauss(p, c, sigma);
    }

    float sharpen = 2.4;
    wLilac = pow(wLilac, sharpen);
    wTurq  = pow(wTurq,  sharpen);
    wWhite = pow(wWhite, sharpen);

    // Bias / balance
    wLilac *= 1.2;
    wTurq  *= 1.1;
    wWhite *= 0.6;

    vec3 w = vec3(wLilac, wTurq, wWhite) + 0.10;
    w /= (w.x + w.y + w.z);
    w = mix(vec3(1.0/3.0), w, 0.75);

    // Farver
    vec3 colLilac = vec3(0.84, 0.66, 1.00);
    vec3 colTurq  = vec3(0.56, 0.82, 0.88);
    vec3 offWhite = vec3(0.94, 0.87, 0.76); // beige

    vec3 c = colLilac*w.x + colTurq*w.y + offWhite*w.z;

    float avg = (c.r + c.g + c.b)/3.0;
    c = mix(vec3(avg), c, 1.07);

    gl_FragColor = vec4(clamp(c, 0.0, 1.0), 1.0);
  }
`;

  const vertexShader = /* glsl */ `
    precision highp float;
    varying vec2 vUv;
    void main(){
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const uniforms = useMemo(
    () => ({
      u_time: { value: 0 },
      u_aspect: { value: 1 },
    }),
    []
  );

  useFrame((state) => {
    uniforms.u_time.value = state.clock.getElapsedTime();
    uniforms.u_aspect.value = vw / vh;
  });

  return (
    <mesh scale={[vw, vh, 1]} frustumCulled={false}>
      <planeGeometry args={[1, 1, 1, 1]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  );
}

export default function AnimatedGradientBG() {
  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: -1, pointerEvents: "none" }}
    >
      <Canvas
        orthographic
        camera={{ position: [0, 0, 1], zoom: 1 }}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        dpr={Math.min(window.devicePixelRatio, 2)}
      >
        <AnimatedPlane />
      </Canvas>
    </div>
  );
}
