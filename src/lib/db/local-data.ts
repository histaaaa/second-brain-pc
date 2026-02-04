// 从 database 文件夹加载真实数据的工具
// 直接内嵌数据，避免 fetch 问题
// 包含 1400+ 条模拟数据用于展示

export interface DatabaseStardust {
  id: string;
  content: string;
  title: string;
  category: "CAREER" | "GROWTH" | "FAMILY" | "LEISURE" | "SOCIAL" | "HEALTH" | "WEALTH" | "DESIGN" | "HCI" | "TRAVEL";
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
  "project-1": { name: "第二大脑", description: "AI 穿戴设备的记忆管理系统" },
  "project-2": { name: "投影仪ID", description: "家居氛围投影仪工业设计" },
  "project-3": { name: "过年旅行", description: "2026年春节广东美食文化之旅" },
  "project-4": { name: "公司装修", description: "Kairos Innovation 工作室装修" },
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
const REAL_DATA: {
  content: string;
  imp: number;
  source: "recording" | "manual";
  project: string;
  category: MockCategory;
}[] = [
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

// ========== 生成 1400+ 条模拟数据 ==========
type MockCategory = "CAREER" | "GROWTH" | "FAMILY" | "LEISURE" | "SOCIAL" | "HEALTH" | "WEALTH" | "DESIGN" | "HCI" | "TRAVEL";

interface MockDataItem {
  content: string;
  imp: number;
  source: "recording" | "manual";
  project: string;
  category: MockCategory;
}

function generateMockData(realData: typeof REAL_DATA): MockDataItem[] {
  const mockData: MockDataItem[] = [...realData];
  const categories = ["CAREER", "GROWTH", "FAMILY", "LEISURE", "SOCIAL", "HEALTH", "WEALTH", "DESIGN", "HCI", "TRAVEL"] as const;
  const projects = ["project-1", "project-2", "project-3", "project-4"] as const;
  const sources = ["recording", "manual"] as const;
  
  const topics = {
    CAREER: ["项目进度", "代码评审", "技术方案", "团队协作", "会议纪要", "产品需求", "设计稿", "测试报告", "Bug 修复", "性能优化"],
    GROWTH: ["学习笔记", "读书心得", "技能提升", "反思总结", "目标规划", "习惯养成", "知识体系", "复盘思考", "能力边界", "认知升级"],
    FAMILY: ["家庭聚会", "亲子时光", "家务事", "家庭旅行", "家人健康", "亲友往来", "节日安排", "生活琐事", "家庭财务", "家居改善"],
    LEISURE: ["电影推荐", "音乐分享", "游戏体验", "运动健身", "美食探店", "旅行计划", "阅读分享", "兴趣爱好", "周末活动", "放松方式"],
    SOCIAL: ["朋友聊天", "社交活动", "人脉维护", "团队建设", "沟通技巧", "关系处理", "聚会安排", "社交媒体", "Networking", "合作机会"],
    HEALTH: ["身体检查", "运动记录", "饮食控制", "睡眠质量", "心理健康", "医疗保健", "健身计划", "体能测试", "健康习惯", "疾病预防"],
    WEALTH: ["理财规划", "投资记录", "消费记录", "储蓄目标", "税务规划", "收入分析", "支出控制", "资产配置", "财务自由", "保险规划"],
    // 设计/交互/旅行 分类
    DESIGN: ["UI设计", "视觉设计", "品牌设计", "插画设计", "动效设计", "设计系统", "排版设计", "色彩理论", "图标设计", "界面布局", "响应式设计", "设计规范", "设计评审", "设计提案", "用户研究", "设计迭代", "设计工具", "原型设计", "设计灵感", "设计趋势"],
    HCI: ["交互设计", "用户体验", "可用性测试", "用户旅程", "信息架构", "导航设计", "手势交互", "语音交互", "多模态交互", "无障碍设计", "界面动效", "微交互", "反馈设计", "表单设计", "搜索设计", "筛选排序", "分页设计", "加载状态", "空状态设计", "错误处理"],
    TRAVEL: ["旅行计划", "目的地探索", "美食体验", "文化之旅", "自然风光", "城市探索", "旅行摄影", "住宿选择", "交通规划", "预算控制", "旅行装备", "旅行笔记", "旅行回顾", "签证办理", "保险购买", "外汇兑换", "行程安排", "景点门票", "当地交通", "旅行灵感"]
  };
  
  const actions = {
    CAREER: ["完成了", "优化了", "解决了", "讨论了", "规划了", "分析了", "调研了", "实现了", "测试了", "review了"],
    GROWTH: ["学到了", "思考了", "总结了", "记录了", "反思了", "规划了", "阅读了", "练习了", "掌握了", "分享了"],
    FAMILY: ["陪伴了", "安排了", "整理了", "照顾了", "沟通了", "计划了", "参与了", "处理了", "庆祝了", "组织了"],
    LEISURE: ["看了", "玩了", "吃了", "去了", "尝试了", "体验了", "放松了", "享受了", "分享了", "推荐了"],
    SOCIAL: ["聊了", "见了", "参加了", "组织了", "维护了", "沟通了", "互动了", "认识了", "感谢了", "回应了"],
    HEALTH: ["检查了", "运动了", "调整了", "记录了", "关注了", "改善了", "治疗了", "坚持了", "监测了", "预防了"],
    WEALTH: ["规划了", "投资了", "记录了", "分析了", "控制了", "节省了", "检查了", "优化了", "储蓄了", "理财了"],
    // 设计/交互/旅行 动作
    DESIGN: ["设计了", "绘制了", "优化了", "调整了", "定稿了", "评审了", "提案了", "迭代了", "探索了", "研究了", "绘制了", "完善了", "输出了", "定义了", "创建了", "调研了", "收集了", "整理了", "输出了", "应用了"],
    HCI: ["设计了", "优化了", "测试了", "分析了", "改进了", "调研了", "验证了", "评估了", "完善了", "实现了", "调整了", "迭代了", "构建了", "梳理了", "定义了", "研究了", "诊断了", "重构了", "简化了", "提升了"],
    TRAVEL: ["规划了", "探索了", "体验了", "品尝了", "拍摄了", "记录了", "安排了", "预订了", "研究了", "整理了", "分享了", "重温了", "整理了", "查阅了", "购买了", "兑换了", "制定了", "预定了", "研究了", "构思了"]
  };
  
  // 生成剩余的 2570 条数据（原有230条 + 2570 = 2800条）
  while (mockData.length < 2800) {
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
  data: MockDataItem[]
): DatabaseStardust[] {
  const now = Date.now();
  const timeRange = 365 * 24 * 60 * 60 * 1000; // 1年

  return data.map((item, index) => {
    // 时间分布：更分散的随机分布
    // 使用平方根分布让时间更分散
    const progress = Math.pow(index / data.length, 0.7); // 非线性分布
    const timeOffset = progress * timeRange + (Math.random() - 0.5) * 20 * 24 * 60 * 60 * 1000;
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
  crystals: Array<{
    id: string;
    title: string;
    content?: string;
    category: string;
    importance: number;
    shape: "cube" | "star" | "diamond" | "sphere";
    created_at: number;
    projectIds: string[];
  }>;
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

  // ============== 关键词提取与关联 ==============
  
  // 停用词列表（中文常用词）
  const STOP_WORDS = new Set([
    '的', '了', '是', '在', '和', '也', '有', '就', '不', '我', '你', '他',
    '她', '它', '们', '这', '那', '上', '下', '中', '里', '后', '前',
    '会', '可以', '一个', '一些', '什么', '怎么', '为什么', '但是',
    '而且', '或者', '如果', '因为', '所以', '虽然', '但是', '然后',
    '时候', '自己', '没有', '已经', '非常', '可能', '应该', '需要'
  ]);

  // 从内容中提取关键词
  function extractKeywords(content: string): string[] {
    // 简单分词：按空格、标点分割
    const words = content
      .replace(/[\s，。！？、；：""''【】（）]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length >= 2); // 至少2个字符
    
    // 去重、过滤停用词
    const uniqueWords = new Set(
      words.filter(w => !STOP_WORDS.has(w) && /[\u4e00-\u9fa5]/.test(w))
    );
    const keywords = Array.from(uniqueWords);
    
    return keywords;
  }

  // 根据关键词查找相关内容散点
  function findRelatedStardusts(
    keywords: string[],
    stardustList: typeof stardusts,
    targetCount: number = 25
  ): string[] {
    // 第一步：基于关键词匹配
    const relatedIds = new Set<string>();
    
    stardustList.forEach(s => {
      const stardustKeywords = extractKeywords(s.content);
      // 检查是否有任意关键词匹配
      const hasMatch = keywords.some(kw => 
        s.content.includes(kw) || stardustKeywords.includes(kw)
      );
      if (hasMatch) {
        relatedIds.add(s.id);
      }
    });
    
    // 第二步：如果匹配不足，随机补充到目标数量
    const allIds = stardustList.map(s => s.id);
    const currentIds = Array.from(relatedIds);
    const needed = targetCount - currentIds.length;
    
    if (needed > 0) {
      // 排除已选中的，随机选取
      const availableIds = allIds.filter(id => !relatedIds.has(id));
      const shuffled = availableIds.sort(() => Math.random() - 0.5);
      shuffled.slice(0, needed).forEach(id => relatedIds.add(id));
    }
    
    return Array.from(relatedIds);
  }

  // ============== 为每个项目生成文档结晶（至少8篇） ==============
  
  const projectCrystalTemplates = {
    "project-1": [  // 第二大脑
      {
        title: "第二大脑交互设计心得",
        category: "CAREER" as const,
        content: "把原始数据叫'星尘'，处理后的叫'结晶'，这个隐喻太棒了。我们的核心壁垒不是录音，而是'主动连接'。双模态的设计解决了我的纠结：既要有 Notion 的秩序感，也要有 Atlas 的探索感。星云视图的粒子效果太炫了，数据可视化这边要用 Canvas 2D。"
      },
      {
        title: "AI 伴侣产品定位思考",
        category: "CAREER" as const,
        content: "现在的 AI 硬件都在做助理，我想做的是'伴侣'。第二大脑是外挂海马体，不是效率工具。搜索不应该只是出列表，应该是'点亮星空'。项目只是从星云里抽出来的一根线，这个交互逻辑简直是天才。"
      },
      {
        title: "技术架构复盘报告",
        category: "CAREER" as const,
        content: "Next.js 的 App Router 有时候会有坑，把 Zustand 装上了，用来管理'星云模式'和'归档模式'的状态切换。星云视图的粒子数设到 1000 个有点卡，得考虑性能优化。"
      },
      {
        title: "产品设计哲学总结",
        category: "DESIGN" as const,
        content: "'结晶'的形状必须有意义，立方体代表工作，六边形代表知识，菱形代表灵感。引入荣格的'阴影'概念，遗忘的记忆就是阴影区。AI 必须主动连接，告诉用户 A 和 B 的关系。"
      },
      {
        title: "项目里程碑与未来展望",
        category: "CAREER" as const,
        content: "我终于完成了第二大脑的原型，这是目前做过最酷的东西，它让我感觉自己在创造未来。跟 Joe 争论做 ToDo 还是灵感连接，最后选择了更自由的灵感连接模式。隐私是个大问题。"
      },
      {
        title: "星云视图渲染性能优化",
        category: "HCI" as const,
        content: "粒子效果渲染优化：使用 requestAnimationFrame 替代 setInterval，减少不必要的重绘。Canvas 2D 比 WebGL 更适合这种场景，因为粒子数在 500-1000 之间，不需要太复杂的 3D 效果。"
      },
      {
        title: "用户数据隐私保护方案",
        category: "WEALTH" as const,
        content: "所有数据存储在本地 IndexedDB，用户的记忆数据不会被上传到云端。这是与竞品最大的差异化。用户对自己的数据有完全的控制权，可以导出、导入、删除。"
      },
      {
        title: "时间线视图交互设计",
        category: "HCI" as const,
        content: "时间线视图展示用户情绪的起伏，每个节点代表一个重要的记忆点。用户可以拖拽时间轴快速浏览历史，也可以点击节点查看详情。情绪用颜色编码，暖色代表积极，冷色代表消极。"
      },
    ],
    "project-2": [  // HKUST 申请
      {
        title: "香港科技大学申请文书构思",
        category: "GROWTH" as const,
        content: "文书的核心要突出我对人机交互的热爱，以及为什么想来 HKUST 学习。导师的研究方向是情感计算和智能助手，这跟我的第二大脑项目高度契合。"
      },
      {
        title: "推荐信准备与沟通",
        category: "CAREER" as const,
        content: "联系了 Prof. Wang 和 Dr. Liu 写推荐信。Prof. Wang 是我本科的毕业设计导师，对我的项目能力很了解。Dr. Liu 是实习期间的主管，可以证明我的工程能力。"
      },
      {
        title: "英语考试成绩总结",
        category: "GROWTH" as const,
        content: " TOEFL 103 分， Speaking 部分 23 分，总算是够用了。口语还是弱项，到了香港要好好练习。HKUST 的要求是总分 80，我这个分数应该是够了。"
      },
      {
        title: "HKUST 工学院课程设置研究",
        category: "GROWTH" as const,
        content: "研究了一下 HKUST 工学院的课程设置，有很多关于人工智能和人机交互的课程。COMP 5411 人机交互，COMP 5211 人工智能，这些课程都非常吸引我。"
      },
      {
        title: "个人陈述修改记录",
        category: "GROWTH" as const,
        content: "第三版文书改完了，这次重点突出了我的产品思维和用户研究能力。加入了很多关于情感计算和记忆增强的思考，希望能让评审眼前一亮。"
      },
      {
        title: "面试准备与模拟练习",
        category: "CAREER" as const,
        content: "收到面试通知了，下周一面。准备了常见的面试问题：为什么选择 HKUST？未来的研究方向是什么？第二大脑项目中最有挑战的部分是什么？"
      },
      {
        title: "申请材料清单与检查",
        category: "GROWTH" as const,
        content: "材料清单：申请表、个人陈述、简历、推荐信、成绩单、英语成绩、作品集。每个材料都检查了三遍，确保没有拼写错误和格式问题。"
      },
      {
        title: "作品集整理与优化",
        category: "DESIGN" as const,
        content: "作品集收录了五个项目：第二大脑、校园导航 App、情感日记、智能家居控制面板、个人博客。每个项目都包含设计过程、最终效果和技术实现。"
      },
    ],
    "project-3": [  // 搬家
      {
        title: "新办公室装修进度汇报",
        category: "CAREER" as const,
        content: "新办公室的装修已经完成了一大半，墙面刷成了浅灰色，地面铺了木纹地板。工位布局采用了开放式设计，方便团队协作。窗边特意留了一块休息区。"
      },
      {
        title: "搬家物品清单与打包计划",
        category: "FAMILY" as const,
        content: "列了一个详细的打包清单：办公设备、个人物品、书籍、装饰品。每个箱子都标注了类别和目的地。贵重物品自己搬，易碎品用气泡膜包好。"
      },
      {
        title: "新办公室网络布线方案",
        category: "CAREER" as const,
        content: "全屋 WiFi 6 覆盖，每个房间一个 AP。工位预留网口，以备不时之需。机房设在杂物间，配了 UPS 电源，确保服务器稳定运行。"
      },
      {
        title: "绿植选购与摆放计划",
        category: "LEISURE" as const,
        content: "买了几盆绿萝和龟背竹，放在窗台和工位旁边。绿植能净化空气，也能缓解视觉疲劳。特意选了容易养活的品种，适合我这种经常出差的人。"
      },
      {
        title: "新办公室咖啡机选购",
        category: "LEISURE" as const,
        content: "研究了半个月的咖啡机，最后选了半自动的意式咖啡机。胶囊机太贵，手冲太麻烦，半自动刚刚好。每天早上给自己做一杯咖啡，开启美好的一天。"
      },
      {
        title: "搬家费用预算与控制",
        category: "WEALTH" as const,
        content: "搬家总费用包括：装修费、家具费、搬迁费、绿植费。装修超支了一点，但总体还在预算范围内。搬家找的是朋友介绍的公司，打了个八折。"
      },
      {
        title: "新办公室安全系统配置",
        category: "CAREER" as const,
        content: "安装了智能门禁系统，支持人脸识别和手机解锁。监控摄像头覆盖了所有出入口和公共区域。消防设施也检查了一遍，确保符合安全标准。"
      },
      {
        title: "搬家后的团队聚餐安排",
        category: "SOCIAL" as const,
        content: "搬家后第一次团队聚餐，选了附近新开的一家日料店。大家都对新办公室很满意，气氛很活跃。聊了聊接下来的项目计划，充满了干劲。"
      },
    ],
    "project-4": [  // 生活
      {
        title: "健身计划与执行记录",
        category: "HEALTH" as const,
        content: "重新开始健身了，一周三次，每次一个小时。主要练胸、背、腿三个部位。饮食上减少了碳水摄入，增加了蛋白质。一个月下来，体重减轻了两公斤。"
      },
      {
        title: "年度阅读计划与书单",
        category: "GROWTH" as const,
        content: "今年计划读 24 本书，平均一个月两本。书单包括：《设计心理学》《情感化设计》《认知心理学》《上瘾》。每天睡前阅读半小时，已经成了习惯。"
      },
      {
        title: "周末户外活动记录",
        category: "LEISURE" as const,
        content: "这个周末去了白云山徒步，呼吸新鲜空气，锻炼身体。山顶的风景很美，拍照发朋友圈收获了很多赞。下次准备去白云嶂挑战一下。"
      },
      {
        title: "家庭聚会与亲情时光",
        category: "FAMILY" as const,
        content: "这个周末回了趟老家，陪父母吃饭、聊天、散步。聊了很多小时候的趣事，也说了说最近的工作和生活。父母年纪大了，要多抽时间陪陪他们。"
      },
      {
        title: "投资理财月度总结",
        category: "WEALTH" as const,
        content: "这个月的投资收益还不错，股票涨了 5%，基金涨了 3%。继续定投，每个月固定投入 2000 元。长期持有，不做短线操作。"
      },
      {
        title: "社交活动与人脉维护",
        category: "SOCIAL" as const,
        content: "参加了一场产品经理的线下分享会，认识了几个同行。大家交流了各自的从业经历和产品心得，还交换了联系方式。职场人脉很重要，要经常维护。"
      },
      {
        title: "睡眠质量监测与改善",
        category: "HEALTH" as const,
        content: "用睡眠监测 app 分析了一个月的睡眠数据，发现深度睡眠比例偏低。尝试了睡前冥想和远离电子设备，效果不错，继续保持。"
      },
      {
        title: "兴趣爱好培养计划",
        category: "LEISURE" as const,
        content: "重拾了吉他，每周找时间练习一小时。从最基础的指法开始练起，希望能弹出几首完整的歌。音乐能让人放松，是很好的减压方式。"
      },
    ],
  };
  
  // 为每个项目生成结晶
  const allCrystals: any[] = [];
  
  projects.forEach((project) => {
    const templates = projectCrystalTemplates[project.id as keyof typeof projectCrystalTemplates] || [];
    const projectStardusts = stardusts.filter(s => s.project_id === project.id);
    
    templates.forEach((template, idx) => {
      // 结晶时间分散开：每篇间隔 30 天（一个月）
      const dayOffset = 30 + idx * 30;
      allCrystals.push({
        id: `crystal-${project.id}-${idx}`,
        title: template.title,
        content: template.content,
        category: template.category,
        importance: 0.7 + Math.random() * 0.3,
        shape: "sphere" as const,
        created_at: Date.now() - dayOffset * 24 * 60 * 60 * 1000,
        projectIds: [project.id],
        sourceStardustIds: findRelatedStardusts(
          extractKeywords(template.content),
          projectStardusts,
          15
        ),
      });
    });
  });
  
  console.log(`📦 加载了 ${projects.length} 个项目，${stardusts.length} 条星尘数据，${allCrystals.length} 条结晶数据`);
  return { projects, stardusts, crystals: allCrystals };
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
  // 来源星尘（仅结晶有）
  sourceStardustIds?: string[];
  // 3D 位置
  position?: [number, number, number];
}

export function stardustsToNebulaPoints(stardusts: DatabaseStardust[]): NebulaPoint[] {
  // 按分类分组处理，让每个分类的点形成独立聚类
  
  // 先按分类分组
  const categoryGroups: Record<string, DatabaseStardust[]> = {};
  stardusts.forEach(s => {
    if (!categoryGroups[s.category]) {
      categoryGroups[s.category] = [];
    }
    categoryGroups[s.category].push(s);
  });
  
  const allPoints: NebulaPoint[] = [];
  const categoryList = Object.keys(categoryGroups);
  
  // 为每个分类计算其在球面上的扇区中心
  const categoryCenters: Record<string, [number, number, number]> = {};
  const numCategories = categoryList.length;
  
  categoryList.forEach((cat, index) => {
    // 使用斐波那契球面分布算法，让分类中心均匀分布在球面上
    const phi = Math.acos(-1 + (2 * index) / numCategories);
    const theta = Math.sqrt(numCategories * Math.PI) * phi;
    // 根据重要性分布，半径有变化：有些分类靠近中心，有些远离
    const baseRadius = 20 + (index % 3) * 15; // 20, 35, 50 交替
    const randomVariation = (Math.random() - 0.5) * 5; // 随机波动
    const radius = baseRadius + randomVariation;
    
    categoryCenters[cat] = [
      radius * Math.cos(theta) * Math.sin(phi),
      radius * Math.sin(theta) * Math.sin(phi),
      radius * Math.cos(phi)
    ];
  });
  
  // 处理每个分类的点
  categoryList.forEach((cat, catIndex) => {
    const items = categoryGroups[cat];
    const center = categoryCenters[cat];
    const numItems = items.length;
    
    items.forEach((s, index) => {
      // 在分类中心周围生成点，形成紧密的聚类
      const phi = Math.acos(-1 + (2 * index) / numItems);
      const theta = Math.sqrt(numItems * Math.PI) * phi;
      
      // 聚类内部半径（较小，形成紧凑的聚类）
      const clusterRadius = 4 + Math.random() * 3;
      
      // 计算基础位置（在分类中心周围）
      const baseX = center[0] + clusterRadius * Math.cos(theta) * Math.sin(phi);
      const baseY = center[1] + clusterRadius * Math.sin(theta) * Math.sin(phi);
      const baseZ = center[2] + clusterRadius * Math.cos(phi);
      
      // 添加微小的随机偏移，让点不完全在同一个球面上
      const randomJitter = (Math.random() - 0.5) * 0.5;
      
      // 根据重要性调整距离中心的位置
      const importanceRadius = (1 - s.importance) * 3;
      
      const x = baseX + randomJitter + importanceRadius;
      const y = baseY + randomJitter + importanceRadius;
      const z = baseZ + randomJitter + importanceRadius;
      
      allPoints.push({
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
      });
    });
  });
  
  return allPoints;
}

/**
 * 将结晶数据转换为 NebulaPoint 格式
 */
export function crystalsToNebulaPoints(
  crystals: Array<{
    id: string;
    title: string;
    content?: string;
    category: string;
    importance: number;
    shape: "cube" | "star" | "diamond" | "sphere";
    created_at: number;
    projectIds: string[];
    sourceStardustIds?: string[];
  }>,
  existingPoints: NebulaPoint[] = []
): NebulaPoint[] {
  // 获取现有的分类中心位置
  const existingByCategory: Record<string, NebulaPoint[]> = {};
  existingPoints.forEach(p => {
    if (!existingByCategory[p.category]) {
      existingByCategory[p.category] = [];
    }
    existingByCategory[p.category].push(p);
  });

  // 计算每个分类的中心点
  const categoryCenters: Record<string, [number, number, number]> = {};
  Object.entries(existingByCategory).forEach(([cat, pts]) => {
    if (pts.length > 0) {
      let sumX = 0, sumY = 0, sumZ = 0;
      let count = 0;
      for (const p of pts) {
        if (p.position) {
          sumX += p.position[0];
          sumY += p.position[1];
          sumZ += p.position[2];
          count++;
        }
      }
      if (count > 0) {
        categoryCenters[cat] = [sumX / count, sumY / count, sumZ / count];
      }
    }
  });

  return crystals.map(c => {
    // 结晶放置在分类中心附近
    let center = categoryCenters[c.category];
    if (!center) {
      // 如果没有现有点，随机生成一个位置
      const phi = Math.random() * Math.PI * 2;
      const theta = Math.random() * Math.PI;
      const radius = 30 + Math.random() * 10;
      center = [
        radius * Math.sin(theta) * Math.cos(phi),
        radius * Math.sin(theta) * Math.sin(phi),
        radius * Math.cos(theta)
      ];
    }

    // 结晶位置稍微偏移分类中心
    const offsetAngle = Math.random() * Math.PI * 2;
    const offsetRadius = 3 + Math.random() * 2;
    const x = center[0] + offsetRadius * Math.cos(offsetAngle);
    const y = center[1] + offsetRadius * Math.sin(offsetAngle);
    const z = center[2] + (Math.random() - 0.5) * 2;

    return {
      id: c.id,
      type: "crystal" as const,
      content: c.content ?? c.title,
      title: c.title,
      category: c.category,
      timestamp: c.created_at,
      importance: c.importance,
      shape: c.shape,
      projectIds: c.projectIds,
      sourceStardustIds: c.sourceStardustIds ?? [],
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
