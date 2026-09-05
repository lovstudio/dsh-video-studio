# DSH Video Studio

面向 DeepSeek Harness 的本地视频剪辑工作台。Remotion 负责实时预览与 MP4 导出；GSAP 动效由视频帧定位驱动，预览、跳转与渲染共用同一套场景。

[English](README.md)

## 安装与启动

需要 Node.js 22.12+，以及 DSH 使用的 pnpm。

```sh
npx @deepseek-ai/dsh plugin --profile web add -w github:lovstudio/dsh-video-studio
npx @deepseek-ai/dsh web
```

若 DSH 已在运行，安装后重启，然后点击侧边栏的 **视频工作台**。GitHub 仓库已包含宿主、编辑器和 Remotion 场景的构建产物，用户无需手动构建。编辑器与 DSH 同源并复用签名 cookie 鉴权；独立 iframe 隔离编辑器的 React/Remotion 与宿主 UI。

如需固定版本，使用 `github:lovstudio/dsh-video-studio#v0.1.0`。

![DSH 视频剪辑工作台](tests/expected/editor.png)

## 工作台

素材库、实时画布、属性面板和四类轨道集中在一个界面：画面、音频、标题、字幕。支持导入媒体、排列和修剪片段、播放头分割、文字编辑、音量与构图调整、撤销重做，以及横版、竖版、方形画布。首次打开提供可编辑的动态标题示例，不依赖外部素材。

工程 JSON 与素材保存在宿主本机，服务端使用原子写入。JSON 备份包含素材引用，不内嵌素材文件。导出任务固定提交时的工程快照，显示进度，支持取消并下载 MP4。SRT 字幕导入导出无需配置 ASR。

## 本地开发

需要 Node.js 22.12+、pnpm 11。依赖构建许可由本包 `pnpm-workspace.yaml` 管理。

```sh
pnpm install
pnpm typecheck
pnpm test
pnpm build
pnpm test:render # 真实 Chrome 渲染与帧确定性验证
pnpm dev
```

本地开发地址为 `http://127.0.0.1:4318/video-studio/`。开发服务器提供构建产物，修改源码后需重新构建；仅监听 loopback，并拒绝外部 Origin。

构建后，将本地工作目录安装到 DSH web profile 进行开发验证：

```sh
npx @deepseek-ai/dsh plugin --profile web add -w /absolute/path/to/dsh-video-studio
```

修改源码后应同时提交生成的 `lib/`。`pnpm verify:dist` 检查运行入口，CI 会重新构建并比对提交产物，防止用户安装到过期代码。Git 安装直接使用这些产物，无需 `prepare` 脚本。

## 服务 API、配置与扩展点

所有 HTTP 路由位于 `/video-studio/`。DSH host 在返回静态文件或调用 API 前均执行 connection 的 `requestRejection()`。浏览器不保存 ASR 密钥，媒体读取支持 Range 与 HEAD。

| 路由                       | 功能                               |
| -------------------------- | ---------------------------------- |
| `GET api/capabilities`     | 查询真实的 ASR 与渲染可用状态      |
| `GET api/projects`         | 读取已保存工程                     |
| `PUT api/projects/:id`     | 校验并原子保存工程                 |
| `POST api/assets`          | 流式上传素材                       |
| `GET media/:id`            | 受鉴权保护的素材读取与字节范围请求 |
| `POST api/render`          | 提交固定工程快照，生成 MP4         |
| `POST api/asr`             | 提交指定已上传素材的转录任务       |
| `GET api/jobs/:id`         | 读取任务状态与进度                 |
| `POST api/jobs/:id/cancel` | 取消排队或运行中的任务             |
| `GET exports/:id.mp4`      | 下载已完成的成片                   |

素材上传 body 为原始二进制，query 包含 `name`、`kind`、`duration` 和可选 `width`、`height`。工程使用带版本号的帧时间数据；渲染仅接受本机素材仓库中的引用。每个渲染任务使用临时 loopback 媒体服务器，仅暴露该快照允许访问的素材，不向 Chromium 传递用户的 DSH 登录 cookie。

ASR 必须在服务端显式配置，并选择能返回时间戳的服务与模型：

```sh
export DSH_VIDEO_ASR_ENDPOINT='https://your-provider.example/v1/audio/transcriptions'
export DSH_VIDEO_ASR_MODEL='your-timestamp-capable-model'
export DSH_VIDEO_ASR_FORMAT='diarized_json' # 或 verbose_json
# 通过已有的密钥管理方式设置 DSH_VIDEO_ASR_API_KEY。
```

示例域名是占位符，应替换为供应商文档中的实际地址。启动 ASR 会将选中素材发送给该配置服务。未完成配置时界面明确显示不可用，不伪造转录结果。ASR provider 注册返回 disposer，本地识别器或其他云服务可实现同一时间戳片段契约。渲染和 ASR 支持中止信号，随插件卸载清理。扩展插件声明注入 `videoStudioAsr`，在 `ctx.effect` 中调用 `ctx.get('videoStudioAsr').register(provider)`，并用 `asrProvider` 选择该 ID。provider 的 `transcribe({asset, language, signal})` 返回以秒为单位的 `{start, end, text}[]`。

持久化仓库、HTTP 控制器、provider registry 与后台任务队列分别实现。`src/core` 管理剪辑不变量与 SRT 转换；`src/remotion` 管理共享画面；`src/editor` 管理用户交互；`src/shell` 仅负责 DSH 挂载。新增动效应进入共享帧驱动场景，新增 ASR 服务应实现已有契约。

## Model Experience

### What the model sees

本包提供用户工作台，不自动注册模型工具、不修改提示词，也不把媒体注入会话。获得用户授权的本地 Agent 可通过常规文件访问读写工程 JSON。

### Token effect

不向模型上下文增加工具 schema 或后台转录内容。

### KV Cache effect

打开工作台不会修改提示词或主动使 KV Cache 失效。

## Known Limitations and Deferred Work

- 单工程最长 30 分钟、最多 3,000 个片段，单次上传上限 250 MiB。本版面向桌面剪辑。
- 浏览器预览取决于素材编码兼容性，优先使用 MP4/H.264 + AAC。目前没有自动代理素材和转码管线。
- ASR 为分段时间戳模式，依赖用户配置的服务；长音频自动切块、本地语音模型安装、逐字强制对齐尚未内置。
- JSON 备份引用宿主素材，不是便携素材压缩包；迁移时需同步工程与素材仓库。
- 当前为固定轨道类型的合成时间线。高级波纹剪辑、关键帧曲线、多机位、协同剪辑和 Screen Studio 源工程导入列为后续工作。
- Remotion 与 GSAP 适用各自许可，商业使用和分发请查阅 [Remotion 许可](https://www.remotion.dev/docs/license) 与 [GSAP 许可](https://gsap.com/community/standard-license/)。

实现参考：[Remotion Player](https://www.remotion.dev/docs/player)、[Remotion renderMedia](https://www.remotion.dev/docs/renderer/render-media)、[GSAP seek](<https://gsap.com/docs/v3/GSAP/Timeline/seek()/>)、[语音时间戳](https://developers.openai.com/api/docs/guides/speech-to-text)。
