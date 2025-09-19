import {
  ref,
  shallowRef,
  onUnmounted,
  defineComponent,
  createVNode,
  render,
  h,
  nextTick,
} from "vue";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { TransformControls } from "three/examples/jsm/controls/TransformControls.js";
import {
  CSS2DRenderer,
  CSS2DObject,
} from "three/examples/jsm/renderers/CSS2DRenderer.js";
import {
  CSS3DRenderer,
  CSS3DObject,
} from "three/examples/jsm/renderers/CSS3DRenderer.js";
import {
  GLTFLoader,
  type GLTF,
} from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { isFunction } from "lodash-es";
import { EXRLoader } from "three/examples/jsm/loaders/EXRLoader.js";
import { Water } from "three/addons/objects/Water.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { OutlinePass } from "three/addons/postprocessing/OutlinePass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import TWEEN from "three/examples/jsm/libs/tween.module.js";
import * as THREE from "three";

// 基础配置 用于快速的初始化参数修改
const CONFIG = {
  CAMERA_POSITION: [-500, 300, -500],
  CONTROL_TARGET: [0, 0, 0],
  DECODER_PATH: `${import.meta.env.VITE_API_DOMAIN}/js/draco/gltf/`,
} as const;

export function useThree() {
  const container = ref<HTMLElement>(); // 挂载的容器
  const scene = shallowRef<THREE.Scene>(); // 场景
  const camera = shallowRef<THREE.PerspectiveCamera>(); // 相机
  const renderer = shallowRef<THREE.WebGLRenderer>(); // 渲染器
  const css2DRenderer = shallowRef<CSS2DRenderer>(); // css2d渲染器
  const css3DRenderer = shallowRef<CSS3DRenderer>(); // css2d渲染器
  const ocontrol = shallowRef<OrbitControls>(); // 轨道控制器
  const tcontrol = shallowRef<TransformControls>(); // 变换控制器
  const outlinePass = shallowRef<OutlinePass>(); // outlinePass
  const hexPass = shallowRef();
  const composers = new Map(); // 后期处理
  const mixers: any = []; // 动画混合器
  const clock = new THREE.Clock(); // 时钟
  const renderMixins = new Map(); // 渲染混合器
  const dracoLoader = new DRACOLoader(); // draco加载器
  dracoLoader.setDecoderPath(CONFIG.DECODER_PATH);
  dracoLoader.setDecoderConfig({ type: "js" });

  const boostrap = () => {
    boostrapScene();
    boostrapCamera();
    boostrapRenderer();
    boostrapControls();
    // boostrapLights();
    onAnimate();
    onWindowResize();
    addOutlineEffect();
    addHexEffect();
  };

  // Scene
  const boostrapScene = () => {
    scene.value = new THREE.Scene();
  };
  // Camera
  const boostrapCamera = () => {
    const { clientWidth, clientHeight } = container.value!;

    camera.value = new THREE.PerspectiveCamera(
      45,
      clientWidth / clientHeight,
      0.1,
      10000
    );
    camera.value.position.set(...CONFIG.CAMERA_POSITION);
  };
  // Renderer
  const boostrapRenderer = () => {
    const { clientWidth, clientHeight } = container.value!;
    console.log("clientHeight", clientHeight);
    // Renderer
    renderer.value = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.value.shadowMap.enabled = false;
    // renderer.value.outputEncoding = THREE.sRGBEncoding
    renderer.value.setSize(clientWidth, clientHeight);
    renderer.value.localClippingEnabled = true;
    renderer.value.setClearAlpha(0.5);
    renderer.value.domElement.className = "webgl-renderer";
    container.value!.appendChild(renderer.value.domElement);
    // css2DRenderer
    css2DRenderer.value = new CSS2DRenderer();
    css2DRenderer.value.setSize(clientWidth, clientHeight);
    css2DRenderer.value.domElement.className = "css2d-renderer";
    css2DRenderer.value.domElement.style.position = "absolute";
    css2DRenderer.value.domElement.style.top = "0px";
    css2DRenderer.value.domElement.style.pointerEvents = "none";
    container.value!.appendChild(css2DRenderer.value.domElement);
    // css3DRenderer
    css3DRenderer.value = new CSS3DRenderer();
    css3DRenderer.value.setSize(clientWidth, clientHeight);
    css3DRenderer.value.domElement.className = "css3d-renderer";
    css3DRenderer.value.domElement.style.position = "absolute";
    css3DRenderer.value.domElement.style.top = "0px";
    css3DRenderer.value.domElement.style.pointerEvents = "none";
    container.value!.appendChild(css3DRenderer.value.domElement);
  };
  // Controls
  const boostrapControls = () => {
    ocontrol.value = new OrbitControls(
      camera.value!,
      renderer.value!.domElement
    );
    ocontrol.value.target.set(...CONFIG.CONTROL_TARGET);
    ocontrol.value.enableDamping = true;
    ocontrol.value.dampingFactor = 0.1;
    ocontrol.value.maxPolarAngle = THREE.MathUtils.degToRad(90); // 最大夹角 60 度
    ocontrol.value.minPolarAngle = THREE.MathUtils.degToRad(45); // 最小夹角 0 度
    ocontrol.value.minDistance = 50;
    ocontrol.value.maxDistance = 1000;
    ocontrol.value.update();
  };
  // 窗口大小变化时重新设置渲染器大小
  const onWindowResize = () => {
    const handleResize = () => {
      const { clientWidth, clientHeight } = container.value!;
      camera.value!.aspect = clientWidth / clientHeight;
      camera.value!.updateProjectionMatrix();
      renderer.value!.setSize(clientWidth, clientHeight);
      css2DRenderer.value!.setSize(clientWidth, clientHeight);
      css3DRenderer.value!.setSize(clientWidth, clientHeight);
      ocontrol.value!.update();
    };
    window.addEventListener("resize", handleResize);
    onUnmounted(() => {
      window.removeEventListener("resize", handleResize);
    });
  };
  // 渲染循环
  const onAnimate = () => {
    const delta = new THREE.Clock().getDelta();
    renderer.value!.render(scene.value!, camera.value!);
    const mixerUpdateDelta = clock.getDelta();
    mixers.forEach((mixer: any) => mixer.update(mixerUpdateDelta));
    composers.forEach((composer) => composer.render(delta));
    renderMixins.forEach((mixin) => isFunction(mixin) && mixin());
    css2DRenderer.value!.render(scene.value!, camera.value!);
    css3DRenderer.value!.render(scene.value!, camera.value!);
    TWEEN.update();
    requestAnimationFrame(() => onAnimate());
  };
  // 加载 GLTF/GLB 模型
  const loadGltf = (url: string): Promise<GLTF> => {
    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);
    const onCompleted = (object: GLTF, resolve: any) => resolve(object);
    return new Promise<GLTF>((resolve) => {
      loader.load(url, (object: GLTF) => onCompleted(object, resolve));
    });
  };
  // 加载动画混合器(用于启动模型自带的动画)
  const loadAnimationMixer = (
    mesh: THREE.Mesh | THREE.AnimationObjectGroup | THREE.Group,
    animations: Array<THREE.AnimationClip>,
    animationName: string
  ) => {
    const mixer = new THREE.AnimationMixer(mesh);
    const clip = THREE.AnimationClip.findByName(animations, animationName);
    if (!clip) return undefined;
    const action = mixer.clipAction(clip);
    action.play();
    mixers.push(mixer);
    return undefined;
  };
  // 加载坐标轴
  const loadAxesHelper = () => {
    const axesHelper = new THREE.AxesHelper(5000);
    scene.value!.add(axesHelper);
  };
  // 通过vue文件加载CSS2D
  const loadCSS2DByVue = (component: any, props: Record<string, any>) => {
    const crender = (component: any, props: Record<string, any>) => {
      const newComponent = defineComponent({
        render: () => h(component, props),
      });
      const instance = createVNode(newComponent);
      render(instance, document.createElement("div"));
      return instance.el;
    };
    const element = crender(component, props) as HTMLElement;
    const css2dObject = new CSS2DObject(element);
    return css2dObject;
  };
  // 通过vue文件加载CSS2D
  const loadCSS3DByVue = (component: any, props: Record<string, any>) => {
    const crender = (component: any, props: Record<string, any>) => {
      const newComponent = defineComponent({
        render: () => h(component, props),
      });
      const instance = createVNode(newComponent);
      render(instance, document.createElement("div"));
      return instance.el;
    };
    const element = crender(component, props) as HTMLElement;
    const css3dObject = new CSS3DObject(element);
    return css3dObject;
  };
  // 加载测试场景
  const loadTestScene = () => {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.value!.add(cube);
  };
  // 过渡动画
  const transitionAnimation = (props: {
    from: Record<string, any>;
    to: Record<string, any>;
    duration: number;
    easing?: any;
    onUpdate?: (params: Record<string, any>) => void;
    onComplete?: (params: Record<string, any>) => void;
  }) => {
    const {
      from,
      to,
      duration,
      easing = TWEEN.Easing.Quadratic.Out,
      onUpdate,
      onComplete,
    } = props;
    return new TWEEN.Tween(from)
      .to(to, duration)
      .easing(easing)
      .onUpdate((object: any) => isFunction(onUpdate) && onUpdate(object))
      .onComplete(
        (object: any) => isFunction(onComplete) && onComplete(object)
      );
  };

  // 添加outline效果
  const addOutlineEffect = (config?: {
    edgeStrength?: number;
    edgeGlow?: number;
    edgeThickness?: number;
    pulsePeriod?: number;
    usePatternTexture?: boolean;
    visibleEdgeColor?: string | number;
    hiddenEdgeColor?: string | number;
  }) => {
    const composer = new EffectComposer(renderer.value!);
    const renderPass = new RenderPass(scene.value!, camera.value!);
    composer.addPass(renderPass);
    outlinePass.value = new OutlinePass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      scene.value!,
      camera.value!
    );
    const deafultConfig = {
      edgeStrength: 3,
      edgeGlow: 0,
      edgeThickness: 1,
      pulsePeriod: 0,
      usePatternTexture: false,
      visibleEdgeColor: "#fff",
      hiddenEdgeColor: "#fff",
    };
    const op = { ...deafultConfig, ...config };

    outlinePass.value.edgeStrength = op.edgeStrength;
    outlinePass.value.edgeGlow = op.edgeGlow;
    outlinePass.value.edgeThickness = op.edgeThickness;
    outlinePass.value.visibleEdgeColor.set(op.visibleEdgeColor);
    outlinePass.value.hiddenEdgeColor.set(op.hiddenEdgeColor);
    outlinePass.value.selectedObjects = [];
    composer.addPass(outlinePass.value);
    const outputPass = new OutputPass();
    composer.addPass(outputPass);
    composers.set("outline", composer);
  };
  // 添加outline效果
  const addHexEffect = (color?: number | string) => {
    let selected: any[] = [];
    hexPass.value = {
      get selectedObjects() {
        return selected;
      },
      set selectedObjects(val) {
        // 先清空之前的
        selected.forEach((mesh) => {
          if (mesh.material) mesh.material.emissive.setHex(mesh.hex);
        });
        val.forEach((mesh) => {
          mesh.material = mesh.material.clone();
          mesh.hex = mesh.material.emissive.getHex();
          mesh.material.emissive.setHex(color ?? 0x888888);
        });
        selected = [...val];
      },
    };
  };

  // 模型拾取
  const addModelPick = (
    object: THREE.Object3D,
    callback: (
      intersects:
        | THREE.Intersection<THREE.Object3D<THREE.Object3DEventMap>>[]
        | []
    ) => void
  ) => {
    const handler = (event: MouseEvent) => {
      const el = container.value as HTMLElement;
      const rect = el.getBoundingClientRect();
      const mouse = new THREE.Vector2(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -((event.clientY - rect.top) / rect.height) * 2 + 1
      );
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera.value!);
      const intersects = raycaster.intersectObject(object, true);
      console.log("intersects", intersects[0]?.point);
      isFunction(callback) && callback(intersects);
      // if (intersects.length <= 0) return void 0
    };
    document.addEventListener("click", handler);
    onUnmounted(() => document.removeEventListener("click", handler));
  };

  // 模型悬浮拾取
  const addModelHoverPick = (
    object: THREE.Object3D,
    callback: (
      intersects:
        | THREE.Intersection<THREE.Object3D<THREE.Object3DEventMap>>[]
        | []
    ) => void
  ) => {
    const handler = (event: MouseEvent) => {
      const el = container.value as HTMLElement;
      const rect = el.getBoundingClientRect();
      const mouse = new THREE.Vector2(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -((event.clientY - rect.top) / rect.height) * 2 + 1
      );
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera.value!);
      const intersects = raycaster.intersectObject(object, true);
      isFunction(callback) && callback(intersects);
      // if (intersects.length <= 0) return void 0
    };
    document.addEventListener("mousemove", handler);
    onUnmounted(() => document.removeEventListener("mousemove", handler));
  };

  const animate = () => {
    const delta = new THREE.Clock().getDelta();
    renderer.value!.render(scene.value!, camera.value!);
    const mixerUpdateDelta = clock.getDelta();
    mixers.forEach((mixer: any) => mixer.update(mixerUpdateDelta));
    composers.forEach((composer) => composer.render(delta));
    renderMixins.forEach((mixin) => isFunction(mixin) && mixin());
    css2DRenderer.value!.render(scene.value!, camera.value!);
    css3DRenderer.value!.render(scene.value!, camera.value!);

    TWEEN.update();
    requestAnimationFrame(() => animate());
  };

  const loadEXR = (url: string) => {
    const pmremGenerator = new THREE.PMREMGenerator(renderer.value!);
    return new Promise<{
      exrCubeRenderTarget: any;
      exrBackground: any;
    }>((resolve) => {
      new EXRLoader().load(url, (texture: any) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        const exrCubeRenderTarget = pmremGenerator.fromEquirectangular(texture);
        const exrBackground = texture;
        resolve({
          exrCubeRenderTarget,
          exrBackground,
        });
      });
    });
  };

  const loadWater = (config: {
    width: number;
    height: number;
    texture: string;
    options?: any;
  }) => {
    return new Promise<THREE.Mesh>((resolve) => {
      const waterNormals = new THREE.TextureLoader().load(
        config.texture,
        (texture) => (texture.wrapS = texture.wrapT = THREE.RepeatWrapping)
      );
      const waterGeometry = new THREE.PlaneGeometry(
        config.width,
        config.height
      );

      const waterOptions = {
        textureWidth: 256,
        textureHeight: 256,
        waterNormals,
        sunColor: 0xf1e8d2,
        waterColor: 0x6183c1,
        distortionScale: 4,
        fog: false,
        side: THREE.DoubleSide,
      };
      const water = new Water(
        waterGeometry,
        Object.assign(waterOptions, config.options ?? {})
      );
      renderMixins.set(water, () => {
        water.material.uniforms.time.value += 2.0 / 60.0;
        // water.position.z += 100;
      });
      resolve(water);
    });
  };

  nextTick(() => {
    boostrap();
  });

  return {
    container,
    scene,
    camera,
    renderer,
    css2DRenderer,
    ocontrol,
    mixers,
    renderMixins,
    composers,
    outlinePass,
    hexPass,
    TWEEN,
    loadGltf,
    loadAnimationMixer,
    loadAxesHelper,
    loadCSS2DByVue,
    loadCSS3DByVue,
    loadTestScene,
    loadEXR,
    loadWater,
    addModelPick,
    addModelHoverPick,
    addOutlineEffect,
    addHexEffect,
    transitionAnimation,
    boostrap,
  };
}

export default useThree;
