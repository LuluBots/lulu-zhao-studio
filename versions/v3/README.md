# Rally · M6 — The Cloud Club

Lulu Zhao 的云端微缩网球场个人网站。React、TypeScript、Vite、React Three Fiber、Drei；默认只有球场，互动时临时出现力度提示和内容卡片。

## 启动

需要 Node.js 22.12+。在本目录运行：

```sh
npm ci
npm run dev
```

浏览器打开终端显示的地址，通常为 http://127.0.0.1:5173。

```sh
npm run build
npm run preview
node --experimental-strip-types --test tests/*.test.mjs
```

## 互动

- 全景：拖动旋转，右键拖动平移，滚轮缩放；R / Home / 双击复位。
- 点网球 / Enter 进入第一人称 Rally。按住对面半场蓄力，松开位置决定落点；Rally 中可边按住边移动瞄准，1.2 秒满力。
- 力度影响球速、弧线和反弹前冲；Lulu 跑到对应接球点，挥拍后复位。Enter / Space 可用中等力度向中场击球。
- 完成回合后按内容数组顺序循环显示卡片；两侧分别记住进度。B 可直接阅读。
- 点击 Lulu、底线标记或按 S 换边；Escape / R / Home / 双击退出 Rally 或取消回合。
- 窗口失焦、界外松开或 Escape 取消蓄力。全景拖动仍是旋转，不会意外发球。

## 文件结构

```text
src/content/profile.ts        真实项目、文章、来源与显示顺序
src/state/                    相机/回合状态、内容卡片状态
src/scene/Player.tsx           GLB、独立骨架实例、服装切换与动画同步
src/scene/ProceduralPlayer.tsx 模型加载期间/失败时的回退
src/scene/ShotInput.tsx        方向与蓄力输入
src/scene/trajectories.ts      过网、落点、接球点和跑位
src/components/ContentCard.tsx 临时内容卡片
assets/blender/lulu.blend      可编辑身体、两套服装、骨架、四段动画
assets/blender/build_lulu.py   可复现 Blender 建模与导出脚本
public/models/lulu.glb         网页加载资源，含全部服装与动画
```

## M5 人物

同一个低面数卡通身体和 15 骨骨架；Humanities 奶油色、叶片纹样，Technology 柔和深蓝、几何纹样；仅持球拍。Idle / Ready / Run / Shuffle / Swing 五段动画，脚底原点、米制、GLB Y-up、正面 +Z。无需贴图或外部字体。

网站按球的进度选择动作，挥拍中点与回球接触时刻同步。访客与 Lulu 分别克隆骨架，避免动作互相干扰；衣服仅切换可见性。系统减少动态效果时停止骨骼装饰动画，仍保留必要跑位与球路。

编辑和重新导出：用 Blender 5.2 打开 `assets/blender/lulu.blend`；或从工程根目录运行：

```sh
/Applications/Blender.app/Contents/MacOS/Blender -b --factory-startup --python assets/blender/build_lulu.py
```

脚本会重建并覆盖人物工程、GLB 和两套预览；手工精修前请另存工程。源文件默认显示 Technology，Humanities 可在 Outliner 切换。NLA 中五个同名轨道默认静音，以便检查静态造型；播放时只启用所需轨道。预览相机、地板和灯光不导出到网页。

M1–M5 已实现；M6 已完成本地环境、人物与运动精修。裁判席、木平台休息区、条纹遮阳伞与分层天空已加入；文艺 / 科学家两套人物已经更新。回合约 1.95–2.85 秒，步频跟随移动距离，回球后自然复位。见 `docs/m6-verification.md`。

移动真机、跨设备性能基准、完整无障碍审计与上线仍待完成。正式构建位于 `dist/`，可作为静态网站部署；本轮没有改动 luluzhao.me 的线上网站。

最新人物造型、握拍与步法精修见 `docs/character-refinement.md`。科学家版已改为盘发、细框眼镜和剪裁网球服；不再使用单侧赛博护目镜。


Latest refinement: scene signpost navigation, longer racket grip, complementary identities and distance-driven tennis cross-steps. See [verification](docs/court-polish.md). This supersedes the earlier no-visible-navigation experiment.


Latest: [stadium & sky upgrade](docs/stadium-upgrade.md). Dual live scoreboards replace scoreboard navigation; day balloons / night aircraft now open internal Research, Writing and About. Switch ends moves players only. Auto lighting follows local time.


Current release: [Rally — Verse & Code](docs/rally-gameplay.md). WASD reception and in/out scoring supersede the earlier automatic-return scoring.
