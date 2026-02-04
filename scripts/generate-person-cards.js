/**
 * 结晶生成器 - 为人物卡片创建结晶并关联星尘来源
 * 
 * 运行方式：
 * 1. 启动开发服务器: npm run dev
 * 2. 打开 http://localhost:3000
 * 3. 打开浏览器开发者工具 (F12) -> Console
 * 4. 粘贴并执行此脚本
 */

(function() {
  console.log("%c🚀 开始生成人物卡结晶...", "color: #00ff88; font-size: 14px; font-weight: bold;");
  console.log("%c" + "=".repeat(60), "color: #666;");

  // 工具函数：生成 UUID
  function uuid() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  // 人物定义
  const PERSONS = [
    {
      name: "Joe",
      relationship: "技术合伙人 / 硬件工程师",
      context: "第二大脑和投影仪项目的核心技术伙伴，负责硬件方案和API接口对接",
      notes: [
        "对技术细节要求严格，经常挑战我的设计方案",
        "倾向于实用主义，我倾向于设计美感，需要平衡",
        "在投影仪项目中多次提供结构工程的专业意见",
        "对新技术持开放态度，愿意尝试新的开发方式"
      ],
      tags: ["技术合伙人", "硬件", "结构工程师", "Kairos Innovation"],
      sourceKeywords: ["Joe"],
      projectIds: ["project-1", "project-2"],
      category: "CAREER",
      shape: "cube"
    },
    {
      name: "Della",
      relationship: "设计师 / 供应链负责人",
      context: "团队核心设计师，同时负责供应链管理和CMF方案",
      notes: [
        "审美眼光独到，经常能指出我忽略的细节",
        "供应链资源丰富，帮我们谈下了多个优惠",
        "建议从'Flux'改名为更具象的名字，虽然我很喜欢Flux",
        "下周是她生日，可以用 Flux 生成一张友谊结晶卡片"
      ],
      tags: ["设计师", "CMF", "供应链", "Kairos Innovation", "女性合伙人"],
      sourceKeywords: ["Della"],
      projectIds: ["project-1", "project-2", "project-4"],
      category: "CAREER",
      shape: "diamond"
    },
    {
      name: "老板",
      relationship: "Kairos Innovation 创始人 / 投资人",
      context: "公司的创始人和主要决策者，对项目有最终话语权",
      notes: [
        "非常关注产品的差异化价值，我们的星云3D可视化让他印象深刻",
        "对隐私问题非常重视，这是他反复强调的红线",
        "对第二大脑项目的期待值很高",
        "在投影仪项目中关注成本控制和上市时间"
      ],
      tags: ["创始人", "投资人", "决策者", "Kairos Innovation"],
      sourceKeywords: ["老板", "投资人"],
      projectIds: ["project-1", "project-2"],
      category: "CAREER",
      shape: "sphere"
    }
  ];

  // 查找与人物相关的星尘
  async function findRelatedStardusts(keywords) {
    if (typeof db === 'undefined') {
      console.error("❌ db 对象未找到，请确保在应用页面中执行此脚本");
      return [];
    }
    const allStardusts = await db.stardust.toArray();
    
    return allStardusts
      .filter(stardust => {
        return keywords.some(keyword => 
          stardust.content.toLowerCase().includes(keyword.toLowerCase()) ||
          (stardust.title && stardust.title.toLowerCase().includes(keyword.toLowerCase()))
        );
      })
      .map(s => s.id);
  }

  // 创建人物卡结晶
  async function createPersonCard(person) {
    console.log(`\n🔨 正在为 ${person.name} 创建人物卡...`);
    console.log(`%c   ${"-".repeat(50)}`, "color: #444;");
    
    const now = Date.now();
    const crystalId = uuid();
    
    // 1. 查找相关的星尘
    const relatedStardustIds = await findRelatedStardusts(person.sourceKeywords);
    console.log(`   📦 找到 ${relatedStardustIds.length} 条相关星尘`);
    
    // 2. 创建结晶记录
    const crystal = {
      id: crystalId,
      template_id: "person_card",
      payload: {
        name: person.name,
        relationship: person.relationship,
        context: person.context,
        notes: person.notes,
        tags: person.tags
      },
      title: `${person.name} - 人物卡片`,
      content: `${person.name} | ${person.relationship}`,
      category: person.category,
      importance: 0.9,
      shape: person.shape,
      created_at: now,
      updated_at: now
    };
    
    await db.crystals.add(crystal);
    console.log(`   ✨ 结晶创建成功: ${crystalId}`);
    
    // 3. 建立结晶与星尘的来源关系
    for (let i = 0; i < relatedStardustIds.length; i++) {
      await db.crystal_sources.add({
        crystal_id: crystalId,
        stardust_id: relatedStardustIds[i],
        order: i
      });
    }
    console.log(`   🔗 已关联 ${relatedStardustIds.length} 条来源星尘`);
    
    // 4. 为结晶关联项目
    for (const projectId of person.projectIds) {
      await db.entry_projects.add({
        entry_type: "crystal",
        entry_id: crystalId,
        project_id: projectId
      });
    }
    console.log(`   📁 已关联到 ${person.projectIds.length} 个项目`);
    
    // 5. 显示结晶详情
    console.log(`\n   📋 ${person.name} 结晶详情:`);
    console.log(`      名称: ${person.name}`);
    console.log(`      关系: ${person.relationship}`);
    console.log(`      上下文: ${person.context}`);
    console.log(`      标签: ${person.tags.join(", ")}`);
    console.log(`      备注数量: ${person.notes.length}`);
    
    return crystal;
  }

  // 主函数
  async function main() {
    try {
      // 检查 db 是否可用
      if (typeof db === 'undefined') {
        console.error("%c❌ 错误: db 对象未找到", "color: #ff4444; font-size: 14px;");
        console.log("%c请确保：", "color: #ff6666;");
        console.log("1. 页面已完全加载");
        console.log("2. 你在 Nebula 应用的页面中执行此脚本");
        console.log("3. Dexie 数据库已初始化");
        return;
      }

      const startCount = await db.crystals.count();
      console.log(`\n📊 初始结晶数量: ${startCount}`);

      // 逐个创建人物卡
      for (const person of PERSONS) {
        await createPersonCard(person);
      }

      const endCount = await db.crystals.count();
      const newCount = endCount - startCount;

      console.log(`\n%c${"=".repeat(60)}`, "color: #666;");
      console.log("%c✅ 所有人物卡结晶生成完成！", "color: #00ff88; font-size: 14px; font-weight: bold;");
      console.log(`%c📈 结晶数量: ${startCount} -> ${endCount} (+${newCount})`, "color: #00ccff;");
      
      // 列出新创建的人物卡
      const personCards = await db.crystals
        .where("template_id")
        .equals("person_card")
        .toArray();
      
      console.log(`\n%c👤 人物卡列表:`, "color: #ff66aa; font-weight: bold;");
      for (const card of personCards) {
        const payload = card.payload;
        console.log(`   • ${payload.name} (${payload.relationship})`);
      }

      console.log(`\n%c💡 提示: 刷新页面查看新生成的人物卡结晶`, "color: #888; font-style: italic;");

    } catch (err) {
      console.error("%c❌ 执行失败:", "color: #ff4444;", err);
    }
  }

  // 执行
  main();
})();
