import { nextTick, onMounted, reactive, ref } from "vue";
import { useThree } from "./useThree";
import WidgetLabel from "@/components/WidgetLabel.vue";

const CONFIG = {
  WATER: `${import.meta.env.VITE_API_DOMAIN}/textures/waternormals.jpg`,
  HDR: `${import.meta.env.VITE_API_DOMAIN}/hdrs/autumn_field_puresky_1k.exr`,
  SHIP: `${import.meta.env.VITE_API_DOMAIN}/models/small_cargo_ship.glb`,
} as const;

export function useShip() {
  const {
    container,
    scene,
    camera,
    outlinePass,
    ocontrol,
    TWEEN,
    loadGltf,
    loadEXR,
    loadWater,
    loadCSS2DByVue,
    addModelPick,
    transitionAnimation,
  } = useThree();

  const loading = reactive({
    total: 3, // 全部
    loaded: 0, // 已加载
    isLoading: true, // 执行状态
  });

  const models = {
    water: null as any,
    ship: null as any,
  };

  const boostrap = async () => {
    await loadExrEnv();
    await loadWaterEnv();
    await loadShipModel();
    addModelPick(models.ship, (intersects) => {
      if (intersects.length > 0) {
        const obj = intersects[0].object;
        // current.value = obj.name;
        outlinePass.value!.selectedObjects = [obj];
      } else {
        // current.value = "";
        outlinePass.value!.selectedObjects = [];
      }
    });
    // 镜头移动
    // -420, 150, 120;
    transitionAnimation({
      from: camera.value!.position,
      to: { x: -504, y: 180, z: 144 },
      duration: 2_000,
      easing: TWEEN.Easing.Quintic.InOut,
      onUpdate: ({ x, y, z }: any) => {
        camera.value!.position.set(x, y, z);
        ocontrol.value?.update();
      },
      onComplete() {
        // isAnimation.value = false;
        // resolve(void 0);
      },
    }).start();
  };

  const loadExrEnv = () => {
    return loadEXR(CONFIG.HDR).then(
      ({ exrCubeRenderTarget, exrBackground }) => {
        loading.loaded += 1;
        scene.value!.background = exrBackground;
        scene.value!.environment = exrCubeRenderTarget.texture;
      }
    );
  };

  const loadWaterEnv = () => {
    loadWater({
      texture: CONFIG.WATER,
      width: 1000 * 100,
      height: 1000 * 100,
    }).then((water) => {
      models.water = water;
      models.water.rotation.x = -Math.PI * 0.5;
      models.water.position.y = -40;
      scene.value!.add(models.water);
      loading.loaded += 1;
    });
  };

  const loadShipModel = () => {
    return loadGltf(CONFIG.SHIP).then((gltf) => {
      models.ship = gltf.scene;
      const scale = 200;
      models.ship.scale.set(scale, scale, scale);
      models.ship.position.set(0, 15, 40);
      models.ship.rotation.y = Math.PI / 2 + Math.PI / 4;
      scene.value!.add(models.ship);
      loading.loaded += 1;
    });
  };

  const loadLabels = () => {
    const obj1 = loadCSS2DByVue(WidgetLabel, {
      name: "船艏吃水11.5米",
    });
    obj1.position.set(139, -38, 179);
    scene.value?.add(obj1);
    //
    const obj2 = loadCSS2DByVue(WidgetLabel, {
      name: "左舷船舯吃水11.5米",
    });
    obj2.position.set(28, -32, 26);
    scene.value?.add(obj2);

    //
    const obj3 = loadCSS2DByVue(WidgetLabel, {
      name: "右舷船舯吃水11.5米",
    });
    obj3.position.set(-18, -38, 58);
    scene.value?.add(obj3);

    //
    const obj4 = loadCSS2DByVue(WidgetLabel, {
      name: "船艉吃水11.5米",
    });
    obj4.position.set(-95, -39, -67);
    scene.value?.add(obj4);
  };
  nextTick(() => {
    boostrap();
    loadLabels();
  });

  return { container };
}

export default useShip;
