// 从 database 文件夹加载真实数据的工具
// 直接内嵌数据，避免 fetch 问题
// 包含 1000 条模拟数据用于展示

export interface DatabaseStardust {
  id: string;
  content: string;
  title: string;
  category: "CAREER" | "GROWTH" | "FAMILY" | "LEISURE" | "SOCIAL" | "HEALTH" | "WEALTH";
  importance: number;
  created_at: number;
  updated_at: number;
  source_type: "recording" | "manual";
  metadata: Record<string, unknown>;
  project_id?: string;
}

export interface DatabaseProject {
  id: string;
  name: string;
  description?: string;
  created_at: number;
}

// 项目映射
const PROJECT_MAP: Record<string, { name: string; description: string }> = {
  "project-1": { name: "第二大脑项目", description: "AI 穿戴设备的记忆管理系统" },
  "project-2": { name: "投影仪 ID 项目", description: "家居氛围投影仪工业设计" },
  "project-3": { name: "过年广东出游", description: "2026年春节广东美食文化之旅" },
  "project-4": { name: "新公司装修", description: "Kairos Innovation 工作室装修" },
};

// 分类颜色映射
export const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    GROWTH: "#4ade80",      // 绿色
    FAMILY: "#a78bfa",      // 紫色
    CAREER: "#60a5fa",      // 蓝色
    LEISURE: "#fbbf24",     // 黄色
    SOCIAL: "#f472b6",      // 粉色
    HEALTH: "#f87171",      // 红色
    WEALTH: "#fbbf24",      // 金色
  };
  return colors[category] || "#94a3b8";
};

// ========== 真实数据源 (230条) ==========
const REAL_DATA: { content: string; imp: number; source: string; project: string; category: string }[] = [
  // 第二大脑项目
  { content: "把原始数据叫'星尘'，处理后的叫'结晶'，这个隐喻太棒了", source: "recording", imp: 1.0, project: "project-1", category: "CAREER" },
  { content: "我们的核心壁垒不是录音，而是'主动连接'", source: "manual", imp: 0.95, project: "project-1", category: "CAREER" },
  { content: "'双模态'的设计解决了我的纠结：既要有 Notion 的秩序感，也要有 Atlas 的探索感", source: "recording", imp: 0.9, project: "project-1", category: "CAREER" },
  { content: "Vibecoding 的效率太惊人了，刚才用 Cursor 几分钟就生成了星云的粒子效果", source: "manual", imp: 0.8, project: "project-1", category: "CAREER" },
  { content: "这不仅仅是效率工具，这是'外挂海马体'", source: "manual", imp: 1.0, project: "project-1", category: "CAREER" },
  { content: "无论如何，这个项目是我目前做过最酷的东西，它让我感觉自己在创造未来", source: "recording", imp: 1.0, project: "project-1", category: "CAREER" },
  { content: "'项目'只是从星云里抽出来的一根线，这个交互逻辑简直是天才", source: "recording", imp: 0.95, project: "project-1", category: "CAREER" },
  { content: "现在的 AI 硬件都在做助理，我想做的是'伴侣'", source: "recording", imp: 0.9, project: "project-1", category: "CAREER" },
  { content: "搜索不应该只是出列表，应该是'点亮星空'", source: "recording", imp: 0.9, project: "project-1", category: "CAREER" },
  { content: "星云模式下的粒子数设到 1000 个有点卡，得用 Three.js 的 InstancedMesh", source: "manual", imp: 0.85, project: "project-1", category: "CAREER" },
  { content: "把 Zustand 装上了，用来管理'星云模式'和'归档模式'的状态切换", source: "manual", imp: 0.7, project: "project-1", category: "CAREER" },
  { content: "Cursor 写的代码虽然快，但是组件拆分得不够细", source: "recording", imp: 0.6, project: "project-1", category: "CAREER" },
  { content: "正在研究怎么把 Nomic Atlas 的那个散点图效果复刻过来", source: "manual", imp: 0.8, project: "project-1", category: "CAREER" },
  { content: "Joe 说我不像个设计师，像个全栈工程师", source: "recording", imp: 0.7, project: "project-1", category: "CAREER" },
  { content: "为了这个项目，已经连续两周没在 10 点前回过家了", source: "manual", imp: 0.9, project: "project-1", category: "CAREER" },
  { content: "星云视图的粒子效果太炫了，数据可视化这边要用 WebGL", source: "manual", imp: 0.85, project: "project-1", category: "CAREER" },
  { content: "Next.js 的 App Router 有时候会有坑", source: "recording", imp: 0.6, project: "project-1", category: "CAREER" },
  { content: "把'项目'做成从星云里抽出来的线，动画逻辑用贝塞尔曲线", source: "manual", imp: 0.9, project: "project-1", category: "CAREER" },
  { content: "移动端的适配是个大问题，3D 画布在手机上要锁死缩放", source: "recording", imp: 0.75, project: "project-1", category: "CAREER" },
  { content: "Framer Motion 的弹簧动画参数终于调好了", source: "manual", imp: 0.6, project: "project-1", category: "CAREER" },
  { content: "我终于完成了第二大脑的原型", source: "recording", imp: 1.0, project: "project-1", category: "CAREER" },
  { content: "星云视图的数据可视化效果很好", source: "manual", imp: 0.8, project: "project-1", category: "CAREER" },
  { content: "React Three Fiber 的文档很有帮助", source: "recording", imp: 0.7, project: "project-1", category: "CAREER" },
  { content: "用 shaderMaterial 做发光粒子效果", source: "recording", imp: 0.7, project: "project-1", category: "CAREER" },
  { content: "数据可视化要用 WebGL，Canvas 不够用", source: "manual", imp: 0.85, project: "project-1", category: "CAREER" },
  { content: "在 iPad 上的触摸体验要确保良好", source: "recording", imp: 0.7, project: "project-1", category: "CAREER" },
  { content: "隐私是个大问题，必须让用户知道数据是私有的", source: "manual", imp: 0.9, project: "project-1", category: "CAREER" },
  { content: "第二大脑是外挂海马体", source: "manual", imp: 1.0, project: "project-1", category: "CAREER" },
  { content: "做 Star 散点图点亮星空效果", source: "recording", imp: 0.9, project: "project-1", category: "CAREER" },
  { content: "分析了十年的人格变化轨迹", source: "manual", imp: 0.8, project: "project-1", category: "CAREER" },
  { content: "跟 Joe 争论做 ToDo 还是灵感连接", source: "recording", imp: 0.85, project: "project-1", category: "CAREER" },
  { content: "第二大脑项目启动会议纪要", source: "manual", imp: 0.85, project: "project-1", category: "CAREER" },
  { content: "申请 HKUST 文书用这个项目作为作品集", source: "recording", imp: 0.8, project: "project-1", category: "CAREER" },
  { content: "时间线视图里能看到情绪的起伏", source: "manual", imp: 0.7, project: "project-1", category: "CAREER" },
  { content: "关于幻觉，可以做 Dream Mode", source: "recording", imp: 0.6, project: "project-1", category: "CAREER" },
  { content: "如果不做标签系统，纯靠向量检索会不会有问题", source: "manual", imp: 0.75, project: "project-1", category: "CAREER" },
  { content: "'结晶'的形状必须有意义，立方体代表工作，六边形代表知识", source: "recording", imp: 0.9, project: "project-1", category: "CAREER" },
  { content: "做时空胶囊，把米兰大教堂的钟声存下来", source: "manual", imp: 0.85, project: "project-1", category: "CAREER" },
  { content: "引入荣格的'阴影'概念，遗忘的记忆就是阴影区", source: "manual", imp: 0.8, project: "project-1", category: "CAREER" },
  { content: "AI 必须主动连接，告诉用户 A 和 B 的关系", source: "manual", imp: 0.95, project: "project-1", category: "CAREER" },
  { content: "第二大脑是伴侣，不是助理", source: "recording", imp: 0.9, project: "project-1", category: "CAREER" },
  { content: "今天试戴了最新的手环 3D 打印模型，手腕内侧的 R 角还是有点顶骨头", source: "manual", imp: 0.8, project: "project-1", category: "CAREER" },
  { content: "觉得现在的卡扣设计太复杂了，能不能改成磁吸的？像 Apple Watch 一样方便", source: "recording", imp: 0.6, project: "project-1", category: "CAREER" },
  { content: "Joe 建议把麦克风阵列移到手环的外侧，说这样可以减少衣服摩擦的噪音", source: "manual", imp: 0.7, project: "project-1", category: "CAREER" },
  { content: "查了一下 300mAh 软包电池的尺寸，勉强能塞进现在的模具，但散热可能会有问题", source: "recording", imp: 0.9, project: "project-1", category: "CAREER" },
  { content: "如果不做屏幕，只留一个呼吸灯，用户怎么知道正在录音？得加一个触觉反馈", source: "recording", imp: 0.85, project: "project-1", category: "CAREER" },
  { content: "正在画手环的 CMF 方案，想要一种'液态金属'的质感", source: "manual", imp: 0.7, project: "project-1", category: "CAREER" },
  { content: "测试了 Raspberry Pi Zero 跑 Whisper 模型，延迟还是太高了，必须上云端处理", source: "manual", imp: 0.8, project: "project-1", category: "CAREER" },
  { content: "外壳材质如果用亲肤硅胶，夏天会不会出汗发粘？要不要考虑氟橡胶", source: "recording", imp: 0.6, project: "project-1", category: "CAREER" },
  { content: "重量必须控制在 25g 以内，不然用户做不到 24 小时佩戴", source: "recording", imp: 0.95, project: "project-1", category: "CAREER" },
  { content: "那个圆形的呼吸灯效果，我想让它模仿人的心跳频率", source: "manual", imp: 0.6, project: "project-1", category: "CAREER" },
  { content: "看了一下 Humane AI Pin 的拆解视频，他们的散热方案做得真激进", source: "recording", imp: 0.7, project: "project-1", category: "CAREER" },
  { content: "跟工厂确认了，开模具至少要 3 周，赶不上月底的演示了，只能先用 CNC 打样", source: "manual", imp: 0.9, project: "project-1", category: "CAREER" },
  { content: "要在手环侧面加一个实体按键吗？用来标记'高光时刻'，一键生成结晶", source: "recording", imp: 0.75, project: "project-1", category: "CAREER" },
  { content: "Arduino 那个震动马达的反馈太松散了，得换成线性马达", source: "manual", imp: 0.5, project: "project-1", category: "CAREER" },
  { content: "Della 觉得黑色的样机太直男了，建议加一个暖白色或者沙色的版本", source: "manual", imp: 0.5, project: "project-1", category: "CAREER" },
  { content: "今晚把 PCB 的堆叠重新排了一下，终于把厚度压到了 8mm", source: "manual", imp: 0.85, project: "project-1", category: "CAREER" },
  { content: "还是担心防水问题，Type-C 接口那里如果不做防水处理", source: "recording", imp: 0.8, project: "project-1", category: "CAREER" },
  { content: "草图画了十几版，还是觉得'莫比乌斯环'那个造型最有寓意", source: "manual", imp: 0.9, project: "project-1", category: "CAREER" },
  
  // 投影仪项目
  { content: "T1 样机出来的效果还不错，但是顶盖的接缝处稍微有点刮手", source: "manual", imp: 0.9, project: "project-2", category: "CAREER" },
  { content: "散热风扇全速运转时的噪音还是有 35dB，超过了 Joe 定的标准", source: "recording", imp: 0.8, project: "project-2", category: "CAREER" },
  { content: "Della 说现在的深灰色喷漆良率太低，容易有积油，建议换成蚀纹原本色", source: "recording", imp: 0.7, project: "project-2", category: "CAREER" },
  { content: "测试了投影仪在不同角度的梯形校正，现在的自动对焦速度有点慢", source: "manual", imp: 0.6, project: "project-2", category: "CAREER" },
  { content: "包装盒的设计打样回来了，内托的纸浆材质支撑力不够", source: "recording", imp: 0.7, project: "project-2", category: "CAREER" },
  { content: "镜头盖的滑轨手感太涩了，阻尼脂的号数不对，要换成高粘度的", source: "manual", imp: 0.8, project: "project-2", category: "CAREER" },
  { content: "昨天通宵改了底座的支架设计，终于解决了 15 度仰角时的重心不稳问题", source: "manual", imp: 0.9, project: "project-2", category: "CAREER" },
  { content: "给老板演示的时候，HDMI 接口居然松了，一定要查一下母座的公差", source: "recording", imp: 0.85, project: "project-2", category: "CAREER" },
  { content: "正在写外观专利的申请文档，把那几个独特的散热格栅特征重点描述了一下", source: "manual", imp: 0.7, project: "project-2", category: "CAREER" },
  { content: "那个红色的电源指示灯太刺眼了，晚上看电影会分心，得加个导光柱柔化一下", source: "recording", imp: 0.6, project: "project-2", category: "CAREER" },
  { content: "把脚垫的材质从橡胶换成了硅胶，防滑效果好多了，而且不粘灰", source: "manual", imp: 0.6, project: "project-2", category: "CAREER" },
  { content: "刚收到的 CNC 手板，表面喷砂的目数太粗了，像磨砂膏一样", source: "manual", imp: 0.9, project: "project-2", category: "CAREER" },
  { content: "为了这颗特殊纹理的布艺面网，跑了三家布料供应商", source: "recording", imp: 0.8, project: "project-2", category: "CAREER" },
  { content: "光机的散热片太大，导致原本设计的流线型外壳必须隆起一块", source: "manual", imp: 0.9, project: "project-2", category: "CAREER" },
  { content: "Della 建议把金属网罩换成塑料仿金属工艺，成本能降 15%", source: "recording", imp: 0.7, project: "project-2", category: "CAREER" },
  { content: "今天试了五种不同的灰色，最后选了潘通 Cool Gray 9C", source: "manual", imp: 0.7, project: "project-2", category: "CAREER" },
  { content: "侧面的进风口设计灵感来自跑车的进气格栅", source: "recording", imp: 0.8, project: "project-2", category: "CAREER" },
  { content: "为了追求极致的极简，想把实体按键全去掉只留触摸", source: "recording", imp: 0.6, project: "project-2", category: "CAREER" },
  { content: "第一次组装结构手板，发现内部线束太乱了", source: "manual", imp: 0.8, project: "project-2", category: "CAREER" },
  { content: "透镜前面的保护玻璃透过率不够，画面有点发灰", source: "manual", imp: 0.7, project: "project-2", category: "CAREER" },
  { content: "考虑要不要做一个皮质的提手？这样便携属性更强", source: "manual", imp: 0.8, project: "project-2", category: "CAREER" },
  { content: "开会讨论了半天，最后决定砍掉内置电池的版本，先做插电版", source: "recording", imp: 0.9, project: "project-2", category: "CAREER" },
  { content: "用 KeyShot 渲染了一组场景图，发给市场部预热", source: "manual", imp: 0.7, project: "project-2", category: "CAREER" },
  { content: "Rhino 建摸遇到大问题，顶面的双曲面衔接一直不顺", source: "manual", imp: 0.8, project: "project-2", category: "CAREER" },
  { content: "结构工程师说我的 ID 方案会导致拔模角不够，至少要留 3 度", source: "recording", imp: 0.8, project: "project-2", category: "CAREER" },
  { content: "今天一直在调风道的流体仿真，发现热风会吹到用户手上", source: "manual", imp: 0.9, project: "project-2", category: "CAREER" },
  { content: "光机供应商发来的 3D 图档比规格书上大了 2mm，整个堆叠要推倒重来", source: "recording", imp: 1.0, project: "project-2", category: "CAREER" },
  { content: "想做一个'悬浮'的视觉效果，通过底部的内收设计让机身看起来更轻薄", source: "manual", imp: 0.7, project: "project-2", category: "CAREER" },
  { content: "Della 提醒我注意安规距离，电源板离外壳太近了", source: "recording", imp: 0.8, project: "project-2", category: "CAREER" },
  { content: "把所有的螺丝孔都藏在了脚垫下面，整机外观面看不到一颗螺丝", source: "manual", imp: 0.8, project: "project-2", category: "CAREER" },
  
  // 过年广东出游
  { content: "看了三个博主的攻略，顺德的'桑拿鱼'必须去吃那家巷子里的老店", source: "manual", imp: 0.9, project: "project-3", category: "LEISURE" },
  { content: "记得带上消化药，这次去顺德是一天五顿的节奏", source: "recording", imp: 0.8, project: "project-3", category: "LEISURE" },
  { content: "Della 说想吃陈村粉，但是要那种薄得像纸一样的", source: "manual", imp: 0.7, project: "project-3", category: "LEISURE" },
  { content: "双皮奶是吃热的还是冷的？这是一个严肃的问题", source: "recording", imp: 0.6, project: "project-3", category: "LEISURE" },
  { content: "为了吃那家煲仔饭，可能要排队两小时，得把 Switch 带上", source: "manual", imp: 0.7, project: "project-3", category: "LEISURE" },
  { content: "顺德的民居建筑很有意思，特别是那些镬克屋的线条", source: "manual", imp: 0.8, project: "project-3", category: "LEISURE" },
  { content: "订到了大良的一家民宿，是由老糖厂改造的", source: "manual", imp: 0.9, project: "project-3", category: "LEISURE" },
  { content: "听说顺德鱼生要做得好，放血是关键", source: "recording", imp: 0.7, project: "project-3", category: "LEISURE" },
  { content: "买了新的大疆 Pocket 3，这次去顺德主要用来拍第一视角的吃播素材", source: "manual", imp: 0.8, project: "project-3", category: "LEISURE" },
  { content: "提醒 Joe 别开车去步行街，那边春节期间肯定封路", source: "recording", imp: 0.7, project: "project-3", category: "LEISURE" },
  { content: "今年一定要去祖庙看醒狮表演，听说有那种高桩狮", source: "manual", imp: 0.9, project: "project-3", category: "LEISURE" },
  { content: "想拍一组'南狮'的特写，狮头的配色和扎作工艺简直是民间艺术的巅峰", source: "manual", imp: 0.85, project: "project-3", category: "LEISURE" },
  { content: "佛山的岭南天地虽然商业化了点，但是旧建筑的修复做得真不错", source: "recording", imp: 0.7, project: "project-3", category: "LEISURE" },
  { content: "在小红书上看到一个佛山的陶瓷工作室，可以自己拉胚", source: "manual", imp: 0.6, project: "project-3", category: "LEISURE" },
  { content: "给家里的小侄子买个小狮头当礼物，让他感受一下广东的年味", source: "manual", imp: 0.7, project: "project-3", category: "LEISURE" },
  { content: "晚上去千灯湖看灯光秀，不知道需不需要预约", source: "recording", imp: 0.6, project: "project-3", category: "LEISURE" },
  { content: "研究了一下咏春拳的木人桩，结构设计很巧妙", source: "manual", imp: 0.7, project: "project-3", category: "LEISURE" },
  { content: "可能会去梁园逛逛，岭南园林的布局讲究'移步换景'", source: "manual", imp: 0.8, project: "project-3", category: "LEISURE" },
  { content: "佛山的盲公饼当手信不错，包装设计虽然老土，但味道确实经典", source: "recording", imp: 0.6, project: "project-3", category: "LEISURE" },
  { content: "如果下雨的话，醒狮表演会取消吗？得备一套雨天的 Plan B", source: "manual", imp: 0.7, project: "project-3", category: "LEISURE" },
  { content: "'行花街'是指定动作，今年想去越秀西湖花市挤一挤", source: "manual", imp: 0.9, project: "project-3", category: "LEISURE" },
  { content: "要买一盆大吉大利的年桔，但是不知道车尾箱能不能塞得下", source: "recording", imp: 0.7, project: "project-3", category: "LEISURE" },
  { content: "白天鹅宾馆的早茶已经排到三个月后了？太夸张了", source: "manual", imp: 0.8, project: "project-3", category: "LEISURE" },
  { content: "想去拍一下广州塔下的有轨电车，春天开进花海的那种感觉", source: "manual", imp: 0.8, project: "project-3", category: "LEISURE" },
  { content: "永庆坊那边有些非遗展览，打算去看看广彩的制作过程", source: "recording", imp: 0.75, project: "project-3", category: "LEISURE" },
  { content: "过年期间广州就像个空城，这时候去珠江新城开车最爽", source: "manual", imp: 0.6, project: "project-3", category: "LEISURE" },
  { content: "给老妈准备了几个红包封，选了那种烫金镂空设计的", source: "manual", imp: 0.7, project: "project-3", category: "LEISURE" },
  { content: "东山口的那些红砖洋房，配上春节的灯笼", source: "recording", imp: 0.7, project: "project-3", category: "LEISURE" },
  { content: "想去沙面喝个咖啡，看着江边的老建筑发呆", source: "manual", imp: 0.8, project: "project-3", category: "LEISURE" },
  
  // 新公司装修
  { content: "跟工长吵了一架，那个强电箱的位置完全破坏了这面墙的完整性", source: "recording", imp: 0.9, project: "project-4", category: "CAREER" },
  { content: "正在画 Workshop 的布局图，3D 打印区必须要有独立的排风系统", source: "manual", imp: 0.8, project: "project-4", category: "CAREER" },
  { content: "Della 坚持要用全地毯，但我还是觉得抛光水泥自流平更有工业风", source: "recording", imp: 0.7, project: "project-4", category: "CAREER" },
  { content: "服务器机房的空调要装独立的，24小时恒温", source: "manual", imp: 0.8, project: "project-4", category: "CAREER" },
  { content: "看了三家玻璃隔断的样品，选了超白玻，普通玻璃泛绿", source: "manual", imp: 0.7, project: "project-4", category: "CAREER" },
  { content: "会议室的隔音棉要加厚，不能像现在这样", source: "recording", imp: 0.8, project: "project-4", category: "CAREER" },
  { content: "天花板决定不吊顶了，直接喷黑，把管线露出来", source: "manual", imp: 0.6, project: "project-4", category: "CAREER" },
  { content: "检查水电走线，发现工人在我的工位下面少留了一个地插", source: "manual", imp: 0.9, project: "project-4", category: "CAREER" },
  { content: "灯光的显色指数 (CRI) 必须达到 Ra95 以上", source: "manual", imp: 0.9, project: "project-4", category: "CAREER" },
  { content: "试了五个色温，最后定了 3500K，比 4000K 温馨，比 3000K 精神", source: "recording", imp: 0.7, project: "project-4", category: "CAREER" },
  { content: "去建材市场看乳胶漆，佐敦的那个'复古灰'涂出来有点发蓝", source: "manual", imp: 0.8, project: "project-4", category: "CAREER" },
  { content: "卫生间的五金件不能省，一定要买哑光黑的", source: "manual", imp: 0.6, project: "project-4", category: "CAREER" },
  { content: "前台的 Logo 墙打算用不锈钢拉丝工艺，背发光", source: "recording", imp: 0.7, project: "project-4", category: "CAREER" },
  { content: "茶水间的台面选了岩板，虽然贵点，但是耐造", source: "manual", imp: 0.6, project: "project-4", category: "CAREER" },
  { content: "窗帘选了蜂巢帘，隔热效果好", source: "manual", imp: 0.5, project: "project-4", category: "CAREER" },
  { content: "Herman Miller 的人体工学椅到了，试坐了一下", source: "manual", imp: 0.9, project: "project-4", category: "CAREER" },
  { content: "为了省钱，升降桌的桌腿在 1688 上买的，桌面找木工厂定制的", source: "recording", imp: 0.8, project: "project-4", category: "CAREER" },
  { content: "正在设计展示架，要留出足够的高度放我们的原型机和手板", source: "manual", imp: 0.7, project: "project-4", category: "CAREER" },
  { content: "Della 买了很多绿萝和龟背竹，说是要净化甲醛", source: "recording", imp: 0.6, project: "project-4", category: "CAREER" },
  { content: "投影仪的幕布选了抗光幕，这样白天开会也不用拉全黑的窗帘", source: "manual", imp: 0.7, project: "project-4", category: "CAREER" },
  { content: "休息区买了个懒人沙发，午休的时候可以躺平", source: "recording", imp: 0.5, project: "project-4", category: "CAREER" },
  { content: "门禁系统决定用人脸识别，省得带卡了", source: "manual", imp: 0.6, project: "project-4", category: "CAREER" },
  { content: "今天做甲醛检测，数值 0.06，勉强合格", source: "manual", imp: 0.9, project: "project-4", category: "CAREER" },
  { content: "保洁阿姨打扫得不够干净，玻璃上全是水印", source: "recording", imp: 0.7, project: "project-4", category: "CAREER" },
  { content: "网络布线终于搞定了，全屋 WiFi 6 覆盖", source: "manual", imp: 0.8, project: "project-4", category: "CAREER" },
  { content: "把我的高达模型和设计奖杯搬到了新工位上", source: "manual", imp: 0.6, project: "project-4", category: "CAREER" },
  { content: "发现茶水间的冰箱尺寸买大了，凸出来一截", source: "recording", imp: 0.7, project: "project-4", category: "CAREER" },
  { content: "正在写搬家指南，告诉大家怎么打包显示器和主机", source: "manual", imp: 0.7, project: "project-4", category: "CAREER" },
  { content: "新办公室的咖啡机调试好了，第一杯浓缩油脂很丰富", source: "recording", imp: 0.6, project: "project-4", category: "CAREER" },
  { content: "虽然过程很痛苦，但看到这个属于我们自己的空间一点点成型", source: "manual", imp: 1.0, project: "project-4", category: "CAREER" },
];

// ========== 生成 1000 条模拟数据 ==========
function generateMockData(realData: typeof REAL_DATA): typeof REAL_DATA {
  const mockData: typeof REAL_DATA = [...realData];
  const categories = ["CAREER", "GROWTH", "FAMILY", "LEISURE", "SOCIAL", "HEALTH", "WEALTH"] as const;
  const projects = ["project-1", "project-2", "project-3", "project-4"];
  const sources = ["recording", "manual"] as const;
  
  const topics = {
    CAREER: ["项目进度", "代码评审", "技术方案", "团队协作", "会议纪要", "产品需求", "设计稿", "测试报告", "Bug 修复", "性能优化"],
    GROWTH: ["学习笔记", "读书心得", "技能提升", "反思总结", "目标规划", "习惯养成", "知识体系", "复盘思考", "能力边界", "认知升级"],
    FAMILY: ["家庭聚会", "亲子时光", "家务事", "家庭旅行", "家人健康", "亲友往来", "节日安排", "生活琐事", "家庭财务", "家居改善"],
    LEISURE: ["电影推荐", "音乐分享", "游戏体验", "运动健身", "美食探店", "旅行计划", "阅读分享", "兴趣爱好", "周末活动", "放松方式"],
    SOCIAL: ["朋友聊天", "社交活动", "人脉维护", "团队建设", "沟通技巧", "关系处理", "聚会安排", "社交媒体", "Networking", "合作机会"],
    HEALTH: ["身体检查", "运动记录", "饮食控制", "睡眠质量", "心理健康", "医疗保健", "健身计划", "体能测试", "健康习惯", "疾病预防"],
    WEALTH: ["理财规划", "投资记录", "消费记录", "储蓄目标", "税务规划", "收入分析", "支出控制", "资产配置", "财务自由", "保险规划"]
  };
  
  const actions = {
    CAREER: ["完成了", "优化了", "解决了", "讨论了", "规划了", "分析了", "调研了", "实现了", "测试了", "review了"],
    GROWTH: ["学到了", "思考了", "总结了", "记录了", "反思了", "规划了", "阅读了", "练习了", "掌握了", "分享了"],
    FAMILY: ["陪伴了", "安排了", "整理了", "照顾了", "沟通了", "计划了", "参与了", "处理了", "庆祝了", "组织了"],
    LEISURE: ["看了", "玩了", "吃了", "去了", "尝试了", "体验了", "放松了", "享受了", "分享了", "推荐了"],
    SOCIAL: ["聊了", "见了", "参加了", "组织了", "维护了", "沟通了", "互动了", "认识了", "感谢了", "回应了"],
    HEALTH: ["检查了", "运动了", "调整了", "记录了", "关注了", "改善了", "治疗了", "坚持了", "监测了", "预防了"],
    WEALTH: ["规划了", "投资了", "记录了", "分析了", "控制了", "节省了", "检查了", "优化了", "储蓄了", "理财了"]
  };
  
  // 生成剩余的 770 条数据
  while (mockData.length < 1000) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const project = projects[Math.floor(Math.random() * projects.length)];
    const source = sources[Math.floor(Math.random() * sources.length)];
    const topic = topics[category][Math.floor(Math.random() * topics[category].length)];
    const action = actions[category][Math.floor(Math.random() * actions[category].length)];
    const importance = 0.4 + Math.random() * 0.6; // 0.4 - 1.0
    
    const templates = [
      `今天${action}关于${topic}的事情，收获很大。`,
      `记录一下今天的${topic}进展，需要继续努力。`,
      `${topic}方面有了新的想法，值得尝试。`,
      `本周的${topic}计划完成得不错，给自己点个赞。`,
      `${topic}遇到了一些问题，需要想办法解决。`,
      `关于${topic}，有一些新的发现和思考。`,
      `${topic}是一个长期的过程，需要持续投入。`,
      `今天在${topic}上花了些时间，效果还可以。`,
      `${topic}相关的资料收集了一些，后面慢慢消化。`,
      `总结一下这段时间${topic}的心得体会。`
    ];
    
    const content = templates[Math.floor(Math.random() * templates.length)];
    
    mockData.push({
      content,
      imp: importance,
      source,
      project,
      category
    });
  }
  
  return mockData;
}

// 生成唯一 ID
function generateId(): string {
  return 'xxxx-xxxx'.replace(/x/g, () => {
    return Math.floor(Math.random() * 16).toString(16);
  });
}

// 从数据数组生成 Stardust 记录
function generateStardustFromData(
  data: typeof REAL_DATA
): DatabaseStardust[] {
  const now = Date.now();
  const timeRange = 365 * 24 * 60 * 60 * 1000; // 1年

  return data.map((item, index) => {
    // 时间分布：越新的数据越靠前
    const progress = index / data.length;
    const timeOffset = progress * timeRange + (Math.random() - 0.5) * 7 * 24 * 60 * 60 * 1000;
    const timestamp = now - timeOffset;

    return {
      id: `stardust-${index}`,
      content: item.content,
      title: item.content.length > 25 ? item.content.substring(0, 25) + "..." : item.content,
      category: item.category,
      importance: item.imp,
      created_at: Math.floor(timestamp),
      updated_at: Math.floor(timestamp),
      source_type: item.source,
      metadata: {
        source: item.source,
        projectId: item.project
      },
      project_id: item.project
    };
  });
}

// 加载所有数据
export async function loadDatabaseData(): Promise<{
  projects: DatabaseProject[];
  stardusts: DatabaseStardust[];
}> {
  // 添加项目
  const projects: DatabaseProject[] = Object.entries(PROJECT_MAP).map(([id, info]) => ({
    id,
    name: info.name,
    description: info.description,
    created_at: Date.now() - 90 * 24 * 60 * 60 * 1000
  }));

  // 生成 1000 条数据
  const fullData = generateMockData(REAL_DATA);
  const stardusts = generateStardustFromData(fullData);

  console.log(`📦 加载了 ${projects.length} 个项目，${stardusts.length} 条星尘数据`);
  return { projects, stardusts };
}

// 转换为 NebulaPoint 格式（用于 3D 渲染）
export interface NebulaPoint {
  id: string;
  type: "dust" | "crystal";
  content: string;
  title?: string;
  category: string;
  timestamp: number;
  importance: number;
  shape?: "cube" | "star" | "diamond" | "sphere";
  projectIds: string[];
  // 3D 位置
  position?: [number, number, number];
}

export function stardustsToNebulaPoints(stardusts: DatabaseStardust[]): NebulaPoint[] {
  return stardusts.map((s, index) => {
    // 使用球面分布算法，让点在3D空间中自然散开
    const phi = Math.acos(-1 + (2 * index) / stardusts.length);
    const theta = Math.sqrt(stardusts.length * Math.PI) * phi;
    
    // 距离中心越远，点越稀疏
    const radius = 10 + Math.random() * 5 + (1 - s.importance) * 3;
    
    const x = radius * Math.cos(theta) * Math.sin(phi);
    const y = radius * Math.sin(theta) * Math.sin(phi);
    const z = radius * Math.cos(phi);
    
    return {
      id: s.id,
      type: "dust" as const,
      content: s.content,
      title: s.title,
      category: s.category,
      timestamp: s.created_at,
      importance: s.importance,
      shape: undefined,
      projectIds: s.project_id ? [s.project_id] : [],
      position: [x, y, z]
    };
  });
}

// 按项目筛选
export function filterByProject(
  points: NebulaPoint[], 
  projectId: string | null
): NebulaPoint[] {
  if (!projectId) return points;
  return points.filter(p => p.projectIds.includes(projectId));
}

// 按分类统计
export function countByCategory(points: NebulaPoint[]): Record<string, number> {
  const counts: Record<string, number> = {};
  points.forEach(p => {
    counts[p.category] = (counts[p.category] || 0) + 1;
  });
  return counts;
}
