import React, { useMemo, useRef, useEffect, useState, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Billboard, useTexture } from "@react-three/drei";

/* --- Track full document height (updates as content changes) --- */
function usePageHeight() {
  const [h, setH] = useState(0);
  useEffect(() => {
    const measure = () => {
      const doc = document.documentElement;
      const body = document.body;
      setH(
        Math.max(
          doc.scrollHeight,
          doc.offsetHeight,
          body ? body.scrollHeight : 0,
          body ? body.offsetHeight : 0
        )
      );
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);
  return h;
}

/* --- One blob: billboarded PNG with subtle breathing --- */
const Blob = React.forwardRef(function Blob(
  { radiusWorld, imgSrc, imgOpacity = 0.7, wobble = 0.006, phase = 0 },
  ref
) {
  const inner = useRef();
  const tex = useTexture(imgSrc);

  useFrame(({ clock }) => {
    if (!inner.current) return;
    const t = clock.getElapsedTime();
    const s = radiusWorld * (1 + wobble * Math.sin(t * 0.8 + phase));
    inner.current.scale.set(s, s, 1); // keep perfectly round
  });

  return (
    <group ref={ref}>
      <Billboard ref={inner} follow>
        <mesh>
          <planeGeometry args={[2, 2]} />
          <meshBasicMaterial
            map={tex}
            transparent
            opacity={imgOpacity} // <<< opacity control
            alphaTest={0.01}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      </Billboard>
    </group>
  );
});

/* --- Hammersley + relaxation to spread initial points nicely --- */
function radicalInverseVdC(bits) {
  bits = (bits << 16) | (bits >>> 16);
  bits = ((bits & 0x55555555) << 1) | ((bits & 0xaaaaaaaa) >>> 1);
  bits = ((bits & 0x33333333) << 2) | ((bits & 0xcccccccc) >>> 2);
  bits = ((bits & 0x0f0f0f0f) << 4) | ((bits & 0xf0f0f0f0) >>> 4);
  bits = ((bits & 0x00ff00ff) << 8) | ((bits & 0xff00ff00) >>> 8);
  return (bits >>> 0) * 2.3283064365386963e-10;
}
function hammersley2D(i, n, jitter = 0.05) {
  let u = (i + 0.5) / n;
  let v = radicalInverseVdC(i);
  u = Math.min(1, Math.max(0, u + (Math.random() - 0.5) * jitter));
  v = Math.min(1, Math.max(0, v + (Math.random() - 0.5) * jitter));
  return [u, v];
}

/* --- Controller: page-wide physics in px; render mapped to viewport slice --- */
function BlobsController({
  count,
  radiusWorlds,
  baseSpeed = 0.13,
  mouseForce = 0.02,
  separationForce = 0.06,
  restitution = 0.85,
  pageHeightPx,
  spawnMode = "pageTop", // "pageTop" | "viewTop"
  spawnHeightPx = 600, // px band height for spawning
  spawnSpacing = 1.5, // min center distance = (ri+rj)*spawnSpacing
  warmupSeconds = 0.5, // ramp-in to avoid launch burst
  maxSpeedFactor = 1.3, // cap at baseSpeed * Hpx * this factor
  minSpeedFactor = 0.22, // never go below this fraction of base speed
  imgSrc = "../assets/bubble.png",
  imgOpacity = 0.7, // <<< NEW
}) {
  const { viewport } = useThree();
  const Wpx = window.innerWidth;
  const Hpx = window.innerHeight;
  const pxPerWorldY = Hpx / viewport.height;

  const pos = useRef(Array.from({ length: count }, () => ({ x: 0, y: 0 })));
  const vels = useRef(Array.from({ length: count }, () => ({ x: 0, y: 0 })));
  const phases = useMemo(
    () => Array.from({ length: count }, () => Math.random() * Math.PI * 2),
    [count]
  );
  const blobRefs = useMemo(
    () => Array.from({ length: count }, () => React.createRef()),
    [count]
  );

  // Mouse in PAGE pixels (keeps y in sync with scroll)
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const lastClient = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (e) => {
      lastClient.current.x = e.clientX;
      lastClient.current.y = e.clientY;
      setMouse({ x: e.clientX, y: e.clientY + window.scrollY });
    };
    const onScroll = () => {
      setMouse({
        x: lastClient.current.x,
        y: lastClient.current.y + window.scrollY,
      });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const startTimeRef = useRef(null);
  const radiiPx = useMemo(
    () => radiusWorlds.map((r) => Math.max(4, r * pxPerWorldY)),
    [radiusWorlds, pxPerWorldY]
  );

  // Evenly-spread spawn near top band (no overlaps, blue-noise-ish)
  useEffect(() => {
    if (!pageHeightPx || radiiPx.length !== count) return;

    const rMax = Math.max(...radiiPx);
    const minX = rMax,
      maxX = Wpx - rMax;

    const anchorY = spawnMode === "viewTop" ? window.scrollY : 0;
    const minYPage = rMax,
      maxYPage = pageHeightPx - rMax;

    const spawnTop = Math.max(minYPage, anchorY + rMax);
    const spawnBottom = Math.min(
      maxYPage,
      spawnTop + Math.max(spawnHeightPx, rMax * 2)
    );

    const points = [];
    for (let i = 0; i < count; i++) {
      const [u, v] = hammersley2D(i, count, 0.06);
      points.push({
        x: minX + u * (maxX - minX),
        y: spawnTop + v * (spawnBottom - spawnTop),
      });
    }

    for (let it = 0; it < 30; it++) {
      let moved = false;
      for (let i = 0; i < count; i++) {
        for (let j = i + 1; j < count; j++) {
          const dx = points[j].x - points[i].x,
            dy = points[j].y - points[i].y;
          const d2 = dx * dx + dy * dy,
            minD = (radiiPx[i] + radiiPx[j]) * spawnSpacing;
          if (d2 > 1e-8) {
            const d = Math.sqrt(d2);
            if (d < minD) {
              const nx = dx / d,
                ny = dy / d,
                push = (minD - d) * 0.5;
              points[i].x -= nx * push;
              points[i].y -= ny * push;
              points[j].x += nx * push;
              points[j].y += ny * push;
              points[i].x = Math.min(maxX, Math.max(minX, points[i].x));
              points[i].y = Math.min(
                spawnBottom,
                Math.max(spawnTop, points[i].y)
              );
              points[j].x = Math.min(maxX, Math.max(minX, points[j].x));
              points[j].y = Math.min(
                spawnBottom,
                Math.max(spawnTop, points[j].y)
              );
              moved = true;
            }
          }
        }
      }
      if (!moved) break;
    }

    for (let i = 0; i < count; i++) {
      pos.current[i].x = points[i].x;
      pos.current[i].y = points[i].y;

      const angle = Math.random() * Math.PI * 2;
      const basePx = baseSpeed * Hpx,
        minSpeed = basePx * minSpeedFactor;
      const initPx = Math.max(basePx * (0.18 + Math.random() * 0.06), minSpeed);
      vels.current[i].x = Math.cos(angle) * initPx;
      vels.current[i].y = Math.sin(angle) * initPx;
    }
    startTimeRef.current = null;
  }, [
    count,
    pageHeightPx,
    Wpx,
    Hpx,
    spawnMode,
    spawnHeightPx,
    baseSpeed,
    spawnSpacing,
    radiiPx,
    minSpeedFactor,
  ]);

  useFrame((state, dt) => {
    const delta = Math.min(dt, 0.033);
    if (startTimeRef.current == null)
      startTimeRef.current = state.clock.getElapsedTime();
    const t = state.clock.getElapsedTime() - startTimeRef.current;
    const ramp = Math.min(1, t / warmupSeconds),
      rampEase = ramp * ramp;

    const basePx = baseSpeed * Hpx,
      maxSpeed = basePx * maxSpeedFactor,
      minSpeed = basePx * minSpeedFactor,
      damp = 0.997;

    for (let i = 0; i < count; i++) {
      const rPx = radiiPx[i];

      vels.current[i].x += (Math.random() - 0.5) * 0.8 * delta * rampEase;
      vels.current[i].y += (Math.random() - 0.5) * 0.8 * delta * rampEase;

      const dxm = pos.current[i].x - mouse.x,
        dym = pos.current[i].y - mouse.y;
      const dm2 = dxm * dxm + dym * dym,
        influence = Math.max(rPx * 3.2, 140);
      if (dm2 < influence * influence && dm2 > 1e-6) {
        const dm = Math.sqrt(dm2),
          f = (1 - dm / influence) * (mouseForce * 100) * rampEase;
        vels.current[i].x += (dxm / dm) * f;
        vels.current[i].y += (dym / dm) * f;
      }

      pos.current[i].x += vels.current[i].x * delta;
      pos.current[i].y += vels.current[i].y * delta;

      const minX = rPx,
        maxX = Wpx - rPx,
        minY = rPx,
        maxY = pageHeightPx - rPx;
      if (pos.current[i].x > maxX) {
        pos.current[i].x = maxX;
        vels.current[i].x *= -0.95;
      } else if (pos.current[i].x < minX) {
        pos.current[i].x = minX;
        vels.current[i].x *= -0.95;
      }
      if (pos.current[i].y > maxY) {
        pos.current[i].y = maxY;
        vels.current[i].y *= -0.95;
      } else if (pos.current[i].y < minY) {
        pos.current[i].y = minY;
        vels.current[i].y *= -0.95;
      }

      vels.current[i].x *= damp;
      vels.current[i].y *= damp;

      let sp = Math.hypot(vels.current[i].x, vels.current[i].y);
      if (sp < minSpeed) {
        if (sp < 1e-5) {
          const a = Math.random() * Math.PI * 2;
          vels.current[i].x = Math.cos(a) * minSpeed;
          vels.current[i].y = Math.sin(a) * minSpeed;
        } else {
          const s = minSpeed / sp;
          vels.current[i].x *= s;
          vels.current[i].y *= s;
        }
      }
      sp = Math.hypot(vels.current[i].x, vels.current[i].y);
      if (sp > maxSpeed) {
        const s = maxSpeed / sp;
        vels.current[i].x *= s;
        vels.current[i].y *= s;
      }
    }

    // collisions (px space)
    for (let i = 0; i < count; i++) {
      const rAi = radiiPx[i];
      for (let j = i + 1; j < count; j++) {
        const rBj = radiiPx[j];
        const dx = pos.current[j].x - pos.current[i].x,
          dy = pos.current[j].y - pos.current[i].y;
        const d2 = dx * dx + dy * dy;
        if (d2 <= 1e-10) continue;
        const d = Math.sqrt(d2),
          nx = dx / d,
          ny = dy / d,
          minD = rAi + rBj;

        const cushion = minD * 1.08;
        if (d < cushion) {
          const push = (1 - d / cushion) * (separationForce * 100) * rampEase;
          vels.current[i].x -= nx * push;
          vels.current[i].y -= ny * push;
          vels.current[j].x += nx * push;
          vels.current[j].y += ny * push;
        }

        if (d < minD) {
          const overlap = minD - d,
            corr = overlap * 0.5;
          pos.current[i].x -= nx * corr;
          pos.current[i].y -= ny * corr;
          pos.current[j].x += nx * corr;
          pos.current[j].y += ny * corr;

          const rvx = vels.current[j].x - vels.current[i].x,
            rvy = vels.current[j].y - vels.current[i].y;
          const vn = rvx * nx + rvy * ny;
          if (vn < 0) {
            const J = ((-(1 + restitution) * vn) / 2) * rampEase;
            vels.current[i].x -= nx * J;
            vels.current[i].y -= ny * J;
            vels.current[j].x += nx * J;
            vels.current[j].y += ny * J;
          }
        }
      }
    }

    // Map PAGE px → world coords (fixed viewport slice)
    for (let i = 0; i < count; i++) {
      const { width, height } = viewport;
      const gx = (pos.current[i].x / Wpx - 0.5) * width;
      const gy = -(((pos.current[i].y - window.scrollY) / Hpx - 0.5) * height);
      const ref = blobRefs[i].current;
      if (ref) ref.position.set(gx, gy, 0);
    }
  });

  return (
    <group>
      {blobRefs.map((ref, i) => (
        <Blob
          key={i}
          ref={ref}
          radiusWorld={radiusWorlds[i % radiusWorlds.length]}
          imgSrc={imgSrc}
          imgOpacity={imgOpacity} // <<< pass opacity
          wobble={0.006}
          phase={phases[i]}
        />
      ))}
    </group>
  );
}

/* --- Public component: fixed canvas, full-page world --- */
export default function FloatingBlobsPastelCirclesPageWorld({
  size = 0.5,
  count = 3,
  baseSpeed = 0.13,
  mouseForce = 0.02,
  separationForce = 0.06,
  restitution = 0.85,
  spawnMode = "pageTop",
  spawnHeightPx = 600,
  spawnSpacing = 1.5,
  warmupSeconds = 0.5,
  maxSpeedFactor = 1.3,
  minSpeedFactor = 0.22,
  imgSrc = "../assets/bubble.png",
  imgOpacity = 0.7, // <<< exposed
}) {
  const pageHeightPx = usePageHeight();

  const radiusWorlds = useMemo(() => {
    const s = typeof size === "number" ? size : parseFloat(size) || 0.45;
    const j = 0.02;
    const n = Math.max(0, Math.trunc(count));
    return Array.from({ length: n }, () =>
      Math.max(0.05, s + (Math.random() - 0.5) * j)
    );
  }, [count, size]);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100vh",
        zIndex: 0,
        pointerEvents: "none",
      }}
    >
      <Canvas
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        camera={{ position: [0, 0, 5], fov: 60 }}
        style={{ width: "100%", height: "100%", background: "transparent" }}
        onCreated={({ gl, scene }) => {
          scene.background = null;
          gl.setClearColor(0x000000, 0); // keep canvas transparent
        }}
      >
        <Suspense fallback={null}>
          <BlobsController
            count={count}
            radiusWorlds={radiusWorlds}
            baseSpeed={baseSpeed}
            mouseForce={mouseForce}
            separationForce={separationForce}
            restitution={restitution}
            pageHeightPx={pageHeightPx}
            spawnMode={spawnMode}
            spawnHeightPx={spawnHeightPx}
            spawnSpacing={spawnSpacing}
            warmupSeconds={warmupSeconds}
            maxSpeedFactor={maxSpeedFactor}
            minSpeedFactor={minSpeedFactor}
            imgSrc={imgSrc}
            imgOpacity={imgOpacity} // <<< pass opacity down
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
