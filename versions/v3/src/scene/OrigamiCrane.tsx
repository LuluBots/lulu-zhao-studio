import { useGLTF } from '@react-three/drei';
import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Box3, DoubleSide, Mesh, MeshStandardMaterial, Vector3 } from 'three';
import SceneAsset from './SceneAsset';

// PRINCE.JACK's original CC BY 4.0 geometry. The wings fold about the local X axis.
function Model({ night, reduced, pulse }: { night: boolean; reduced: boolean; pulse: number }) {
  const { scene } = useGLTF('/models/about-origami-crane.glb');
  const elapsed = useRef(1.2), lastFlap = useRef<number | null>(null);
  const { invalidate } = useThree();
  const paper = useMemo(() => new MeshStandardMaterial({
    color: '#ede9d8', roughness: .94, metalness: 0, side: DoubleSide,
    flatShading: true, emissive: '#91a59b', emissiveIntensity: night ? .08 : 0,
  }), [night]);
  const { model, wings } = useMemo(() => {
    const copy = scene.clone(true);
    const wings: { mesh: Mesh; rest: Float32Array }[] = [];
    copy.traverse(object => {
      if (object instanceof Mesh) {
        object.geometry = object.geometry.clone();
        object.material = paper;
        object.castShadow = true;
        object.receiveShadow = true;
        // Keep the original geometry immutable; only the outer wings move.
        wings.push({mesh: object, rest: new Float32Array(object.geometry.attributes.position.array)});
        object.frustumCulled = false;
      }
    });
    const bounds = new Box3().setFromObject(copy);
    const size = bounds.getSize(new Vector3());
    const center = bounds.getCenter(new Vector3());
    const scale = 5.1 / Math.max(size.x, size.y, size.z);
    copy.scale.multiplyScalar(scale);
    copy.position.set(-center.x * scale, -center.y * scale, -center.z * scale);
    return { model: copy, wings };
  }, [scene, paper]);
  useEffect(() => () => { paper.dispose(); wings.forEach(({mesh}) => mesh.geometry.dispose()); }, [paper, wings]);
  useEffect(() => { if(pulse && !reduced){elapsed.current=0;invalidate();} }, [pulse, reduced, invalidate]);
  useFrame((_, delta) => {
    for (let ancestor = model.parent; ancestor; ancestor = ancestor.parent) if (!ancestor.visible) return;
    if (!reduced) elapsed.current = Math.min(1.2,elapsed.current + Math.min(delta, .05));
    const flap = reduced ? 0 : Math.sin(elapsed.current / 1.2 * Math.PI * 2) * Math.sin(elapsed.current / 1.2 * Math.PI) * .35;
    if (lastFlap.current === flap) return;
    lastFlap.current = flap;
    for (const {mesh, rest} of wings) {
      const position = mesh.geometry.attributes.position;
      for (let i = 0; i < position.count; i++) {
        const x = rest[i*3], y = rest[i*3+1], z = rest[i*3+2];
        const weight = Math.min(1, Math.max(0, (Math.abs(z)-1.5)/3));
        const angle = -Math.sign(z) * flap * weight * weight * (3-2*weight);
        const dy = y-3, dz = z-Math.sign(z)*1.5;
        position.setXYZ(i, x, 3 + dy*Math.cos(angle)-dz*Math.sin(angle), Math.sign(z)*1.5 + dy*Math.sin(angle)+dz*Math.cos(angle));
      }
      position.needsUpdate = true;
      mesh.geometry.computeVertexNormals();
    }
    if (!reduced && elapsed.current < 1.2) invalidate();
  });
  return <group name="About_Flying_Origami_Crane" position={[0,.7,0]} rotation={[0,.4,0]}>
    <primitive object={model} dispose={null}/>
  </group>;
}
export default function OrigamiCrane(props: { night: boolean; reduced: boolean; pulse: number }) {
  return <SceneAsset><Model {...props}/></SceneAsset>;
}
