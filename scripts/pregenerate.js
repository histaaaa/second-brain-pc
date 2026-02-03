/**
 * 预生成种子数据脚本
 * 运行方式: node scripts/pregenerate.js
 */

const STARDUST_COUNT = 800;
const CRYSTAL_DOC_COUNT = 30;
const CRYSTAL_PERSON_COUNT = 25;
const CRYSTAL_TODO_COUNT = 35;

const CATEGORIES = [
  "DESIGN", "HCI", "RELATIONSHIPS", "TRAVEL", "FINANCE", 
  "WORK", "LEARNING", "ENTERTAINMENT", "HEALTH"
];

const PROJECT_NAMES = [
  "第二大脑项目",
  "投影仪ID项目", 
  "过年广东出游",
  "新公司装修项目",
];

const STARDUST_CONTENT = {
  DESIGN: [
    "研究 Material Design 3 的设计规范",
    "探索 Apple 的 Human Interface Guidelines",
    "学习 Figma 的自动布局功能",
    "分析 Dribbble 上的热门设计趋势",
    "创建个人设计系统文档",
    "优化移动端表单设计",
    "设计深色模式配色方案",
    "研究无障碍设计标准 WCAG",
    "学习动效设计 Principle",
    "探索 3D 渲染在 UI 中的应用",
    "设计图标系统的网格对齐",
    "研究微交互的最佳实践",
    "创建组件库的设计规范",
    "分析竞品的信息架构",
    "设计搜索功能的视觉反馈",
  ],
  HCI: [
    "学习交互设计基础原理",
    "研究菲茨定律 Fitts Law",
    "费茨定律点击目标大小",
    "希克定律选项数量",
    "操作法则 7±2 原则",
    "席克定律认知负荷",
    "特斯勒复杂度守恒",
    "雅各布定律用户习惯",
    "研究眼动追踪技术",
    "手势交互设计规范",
    "触摸交互设计原则",
    "语音交互 VUI 设计",
    "多模态交互设计",
    "无障碍设计 Accessibility",
    "可用性测试方法",
  ],
  RELATIONSHIPS: [
    "和奶奶打电话，她说腿好多了，下周去复查",
    "远程问诊约了明天下午，把检查报告准备好",
    "家庭聚餐定在周六，记得订位",
    "妈妈生日快到了，得想想送什么",
    "纪念日打算在家做顿饭",
    "和朋友讨论下个月的旅行计划",
    "感谢导师的推荐信",
    "和多年未见的老同学聚会",
    "参加公司组织的团建活动",
    "维护和前同事的联系",
    "加入兴趣小组认识新朋友",
    "处理和邻居的噪音纠纷",
    "和伴侣讨论未来的计划",
    "给孩子找合适的学校",
    "参加亲戚的婚礼",
  ],
  TRAVEL: [
    "计划五一去云南大理旅行",
    "日本签证办好了，行程规划中",
    "三亚亚特兰蒂斯酒店体验",
    "周末去杭州西湖灵隐寺",
    "北京故宫长城历史文化之旅",
    "云南丽江古城束河古镇",
    "西藏拉萨布达拉宫朝圣",
    "成都重庆美食探索之旅",
    "厦门鼓浪屿文艺小清新",
    "青岛啤酒节感受氛围",
    "西安兵马俑古城墙",
    "桂林阳朔山水甲天下",
    "张家界天门山玻璃栈道",
    "贵州黄果树瀑布壮观",
    "西双版纳热带雨林",
    "内蒙古呼伦贝尔大草原",
    "新疆天山喀纳斯湖",
    "敦煌莫高窟丝路历史",
    "青海湖环湖自驾",
    "香港澳门购物美食",
    "泰国曼谷清迈芭提雅",
    "新加坡圣淘沙鱼尾狮",
    "马尔代夫水上别墅",
    "冰岛极光追光之旅",
    "日本樱花季京都大阪",
  ],
  FINANCE: [
    "分析今天的股票行情",
    "设置每月的理财目标",
    "记录本月的消费账单",
    "研究基金的投资策略",
    "规划退休后的被动收入",
    "购买医疗保险保障家人",
    "学习基础的会计知识",
    "制定年度预算计划",
    "分析比特币的最新走势",
    "研究指数基金定投策略",
    "优化信用卡的使用权益",
    "设置自动转账储蓄功能",
    "审查保险合同的条款",
    "计算复利投资的收益",
    "学习基础的税务规划",
  ],
  WORK: [
    "第二大脑的星云交互方案讨论了一下",
    "投影仪 ID 的规格文档需要更新",
    "新公司装修进度：水电快完了",
    "设计评审会上提了几个动效建议",
    "人体工学椅到了，试坐一下",
    "会议纪要已发飞书",
    "完成本季度的 KPI 自评",
    "更新项目进度甘特图",
    "回复邮件处理待办事项",
    "准备下周一的项目汇报",
    "和团队进行代码评审",
    "优化数据库查询性能",
    "部署最新的代码到测试环境",
    "修复生产环境的紧急 bug",
    "整理技术债务清单",
  ],
  LEARNING: [
    "早上背了半小时意大利语，动词变位还是容易混",
    "荣格心理学那本书看到第三章，关于阴影的概念",
    "昨晚睡眠质量一般，半夜醒了一次",
    "今天读完《思考快与慢》最后一章",
    "写作练习：写了一段关于城市观察的随笔",
    "冥想十分钟，注意力还是容易飘",
    "学习 TypeScript 的高级类型",
    "读完《人类简史》",
    "练习吉他半小时，手指疼",
    "学习咖啡的冲煮技巧",
    "读完《穷爸爸富爸爸》",
    "上完一节在线瑜伽课",
    "学习 Python 数据分析",
    "读完《刻意练习》",
    "练习书法临摹赵孟頫",
  ],
  ENTERTAINMENT: [
    "周末在家看了一部科幻电影",
    "玩《缺氧》生存游戏",
    "新赛季王者荣耀冲分",
    "追更的动漫更新了",
    "听完一期关于 AI 的播客",
    "去看了周杰伦演唱会",
    "玩《塞尔达》开放世界",
    "读完一本悬疑小说",
    "看了一场足球比赛直播",
    "去电影院看了诺兰新片",
    "玩《原神》做日常任务",
    "补完了经典的科幻电影",
    "去 livehouse 听乐队演出",
    "看完了《权游》最后一季",
    "玩《我的世界》建造存档",
  ],
  HEALTH: [
    "今天体检报告出来了，基本正常",
    "开始每天喝八杯水",
    "跑步机上跑了三公里",
    "晚上十点前上床睡觉",
    "控制糖分摄入，减少奶茶",
    "预约了明天的牙科检查",
    "练习瑜伽放松身心",
    "补充维生素 D 和钙片",
    "关注了冥想类 App",
    "体重终于降到 70 公斤以下",
    "睡眠质量明显改善",
    "缓解颈椎酸痛的方法",
    "定期做眼科检查",
    "保持正确的坐姿",
    "每天散步半小时",
  ],
};

const CRYSTAL_DOCS = [
  { title: "产品需求文档 PRD", category: "WORK" },
  { title: "技术架构设计文档", category: "WORK" },
  { title: "用户研究分析报告", category: "HCI" },
  { title: "设计系统规范 v2.0", category: "DESIGN" },
  { title: "项目进度周报", category: "WORK" },
  { title: "交互规范说明文档", category: "HCI" },
  { title: "财务分析 Q4 报告", category: "FINANCE" },
  { title: "品牌视觉指南", category: "DESIGN" },
  { title: "旅行攻略清单", category: "TRAVEL" },
  { title: "年度总结与计划", category: "LEARNING" },
];

const CRYSTAL_PEOPLE = [
  { name: "张伟", category: "WORK" },
  { name: "李娜", category: "RELATIONSHIPS" },
  { name: "王强", category: "WORK" },
  { name: "刘洋", category: "DESIGN" },
  { name: "陈静", category: "HCI" },
  { name: "赵磊", category: "LEARNING" },
  { name: "孙燕", category: "HEALTH" },
  { name: "周华", category: "FINANCE" },
  { name: "吴超", category: "TRAVEL" },
  { name: "郑敏", category: "ENTERTAINMENT" },
];

const CRYSTAL_TODOS = [
  { title: "完成项目演示文稿", category: "WORK" },
  { title: "整理房间和衣柜", category: "HEALTH" },
  { title: "阅读一本专业书籍", category: "LEARNING" },
  { title: "计划下次旅行行程", category: "TRAVEL" },
  { title: "学习新的设计工具", category: "DESIGN" },
  { title: "优化网站用户流程", category: "HCI" },
  { title: "整理投资组合配置", category: "FINANCE" },
  { title: "看几部评分电影", category: "ENTERTAINMENT" },
  { title: "联系久未谋面的朋友", category: "RELATIONSHIPS" },
  { title: "练习一种乐器", category: "LEARNING" },
];

const fs = require("fs");
const path = require("path");

function randomDateMs(years) {
  const now = Date.now();
  const msPerDay = 24 * 60 * 60 * 1000;
  const days = Math.floor(Math.random() * years * 365);
  return now - days * msPerDay;
}

function shuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

async function generateData() {
  console.log("🚀 开始生成预置数据...");

  // 硬编码绝对路径避免中文编码问题
  const dbPath = "C:/Users/lenovo/Desktop/第二大脑PC/database/secondbrain";
  console.log(`📁 数据目录: ${dbPath}`);

  // 确保目录存在
  if (!fs.existsSync(dbPath)) {
    fs.mkdirSync(dbPath, { recursive: true });
    console.log(`📁 已创建目录`);
  }

  const projects = PROJECT_NAMES.map((name, idx) => ({
    id: `project-${idx + 1}`,
    name,
    created_at: randomDateMs(2),
    updated_at: randomDateMs(0.5),
  }));

  const stardusts = [];
  const crystals = [];

  let stardustIndex = 0;
  for (const category of CATEGORIES) {
    const contents = STARDUST_CONTENT[category] || [];
    const shuffledContents = shuffle(contents);
    const count = Math.floor(STARDUST_COUNT / CATEGORIES.length) + 
                  (Math.random() > 0.5 ? 1 : 0);
    
    for (let i = 0; i < count; i++) {
      const content = shuffledContents[i % shuffledContents.length];
      stardusts.push({
        id: `stardust-${String(stardustIndex++).padStart(4, "0")}`,
        content,
        title: content.slice(0, 25),
        category,
        importance: 0.3 + Math.random() * 0.7,
        created_at: randomDateMs(2),
        updated_at: randomDateMs(2),
        source_type: Math.random() < 0.6 ? "recording" : "manual",
        metadata: {},
      });
    }
  }

  for (let i = 0; i < CRYSTAL_DOC_COUNT; i++) {
    const template = CRYSTAL_DOCS[i % CRYSTAL_DOCS.length];
    const sourceIds = shuffle(stardusts)
      .slice(0, 3 + Math.floor(Math.random() * 3))
      .map((s) => s.id);
    
    crystals.push({
      id: `crystal-doc-${String(i).padStart(3, "0")}`,
      title: `${template.title} ${i + 1}`,
      type: "document",
      category: template.category,
      source_ids: sourceIds,
      content: `这是 ${template.title} 的详细内容...`,
      created_at: randomDateMs(2),
      updated_at: randomDateMs(2),
      metadata: {},
    });
  }

  for (let i = 0; i < CRYSTAL_PERSON_COUNT; i++) {
    const template = CRYSTAL_PEOPLE[i % CRYSTAL_PEOPLE.length];
    const sourceIds = shuffle(stardusts)
      .filter((s) => s.category === template.category)
      .slice(0, 2 + Math.floor(Math.random() * 4))
      .map((s) => s.id);
    
    crystals.push({
      id: `crystal-person-${String(i).padStart(3, "0")}`,
      title: `${template.name}的卡片`,
      type: "person",
      category: template.category,
      source_ids: sourceIds,
      content: `关于 ${template.name} 的关系网络...`,
      created_at: randomDateMs(2),
      updated_at: randomDateMs(2),
      metadata: {
        name: template.name,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${template.name}`,
      },
    });
  }

  for (let i = 0; i < CRYSTAL_TODO_COUNT; i++) {
    const template = CRYSTAL_TODOS[i % CRYSTAL_TODOS.length];
    const sourceIds = shuffle(stardusts)
      .slice(0, 1 + Math.floor(Math.random() * 2))
      .map((s) => s.id);
    
    crystals.push({
      id: `crystal-todo-${String(i).padStart(3, "0")}`,
      title: `${template.title} ${i + 1}`,
      type: "todo",
      category: template.category,
      source_ids: sourceIds,
      content: `完成 ${template.title} 的具体步骤...`,
      created_at: randomDateMs(2),
      updated_at: randomDateMs(2),
      metadata: {
        status: ["pending", "in_progress", "completed"][Math.floor(Math.random() * 3)],
        priority: ["low", "medium", "high"][Math.floor(Math.random() * 3)],
        due_date: randomDateMs(0.5),
      },
    });
  }

  const projectPoints = stardusts.map((s) => ({
    id: s.id,
    type: "stardust",
    project_id: projects[Math.floor(Math.random() * projects.length)].id,
  }));
  
  crystals.forEach((c) => {
    projectPoints.push({
      id: c.id,
      type: "crystal",
      project_id: projects[Math.floor(Math.random() * projects.length)].id,
    });
  });

  const saveJson = (filename, data) => {
    const filePath = dbPath + "/" + filename;
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2, "  "));
    console.log(`✅ 已生成 ${filename}`);
  };

  saveJson("projects.json", projects);
  saveJson("stardusts.json", stardusts);
  saveJson("crystals.json", crystals);
  saveJson("project_points.json", projectPoints);

  console.log(`\n📊 数据统计:`);
  console.log(`   - 项目: ${projects.length}`);
  console.log(`   - 星尘: ${stardusts.length}`);
  console.log(`   - 水晶: ${crystals.length}`);
  console.log(`   - 项目关联: ${projectPoints.length}`);
  
  console.log(`\n📈 各类别星尘分布:`);
  CATEGORIES.forEach(cat => {
    const count = stardusts.filter((s) => s.category === cat).length;
    console.log(`   - ${cat}: ${count}`);
  });
  
  console.log(`\n🎉 预置数据生成完成！`);
}

generateData().catch(console.error);
