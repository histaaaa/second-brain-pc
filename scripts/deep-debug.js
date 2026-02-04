/**
 * 深度调试脚本 - 检查渲染问题的根源
 * 
 * 在浏览器控制台执行
 */

(async () => {
  console.log("%c🔬 深度渲染诊断", "color: #ff6600; font-size: 18px; font-weight: bold;");
  console.log("%c" + "=".repeat(70), "color: #666;");

  if (typeof db === 'undefined') {
    console.error("❌ db 未初始化");
    return;
  }

  // ========== 第一步：检查数据库 ==========
  console.log("\n📊 【步骤1】检查数据库");
  console.log("-".repeat(50));
  
  const crystals = await db.crystals.toArray();
  const personCards = crystals.filter(c => c.template_id === 'person_card');
  
  console.log(`总结晶数: ${crystals.length}`);
  console.log(`人物卡数: ${personCards.length}`);
  
  if (personCards.length === 0) {
    console.log("❌ 严重问题: 数据库中没有人物卡结晶！");
    return;
  }

  // 检查 shape
  const shapes = {};
  personCards.forEach(c => {
    shapes[c.shape] = (shapes[c.shape] || 0) + 1;
  });
  console.log("形状分布:", shapes);

  // ========== 第二步：检查 NebulaPoint ==========
  console.log("\n📊 【步骤2】检查 NebulaPoint 数据流");
  console.log("-".repeat(50));
  
  // 这里需要用户手动调用或检查 NebulaCanvas 组件
  // 我们模拟检查逻辑
  console.log("请在控制台输入以下命令检查 dataRef:");
  console.log("  document.querySelector('canvas')?.parentElement?.__reactFiber?.memoizedProps");
  
  // ========== 第三步：检查 Canvas ==========
  console.log("\n📊 【步骤3】检查 Canvas 渲染");
  console.log("-".repeat(50));
  
  const canvas = document.querySelector('canvas');
  if (canvas) {
    console.log(`✅ Canvas 存在: ${canvas.width}x${canvas.height}`);
    console.log(`样式: ${getComputedStyle(canvas).background}`);
    
    // 检查是否有透明度问题
    const ctx = canvas.getContext('2d');
    if (ctx) {
      console.log(`混合模式: ${ctx.globalCompositeOperation}`);
    }
  } else {
    console.log("❌ Canvas 不存在");
    return;
  }

  // ========== 第四步：检查渲染条件 ==========
  console.log("\n📊 【步骤4】模拟渲染逻辑测试");
  console.log("-".repeat(50));
  
  // 测试数据
  const testData = [
    { type: "crystal", shape: "cube", id: "test1" },
    { type: "crystal", shape: "sphere", id: "test2" },
    { type: "dust", shape: undefined, id: "test3" },
  ];
  
  testData.forEach(p => {
    const condition = p.type === "crystal" && p.shape;
    console.log(`${p.id}: type="${p.type}", shape="${p.shape}" → ${condition ? '✅ 绘制' : '❌ 跳过'}`);
  });

  // ========== 第五步：检查分类 ==========
  console.log("\n📊 【步骤5】检查人物卡分类");
  console.log("-".repeat(50));
  
  const categories = {};
  personCards.forEach(c => {
    categories[c.category] = (categories[c.category] || 0) + 1;
  });
  console.log("人物卡分类分布:", categories);

  // ========== 生成测试报告 ==========
  console.log("\n" + "=".repeat(70));
  console.log("📋 测试结论:");
  console.log("=".repeat(70));
  
  console.log(`
🔍 可能的问题原因:

1. 【数据问题】
   - 检查数据库中是否有结晶数据 ✓ 已验证
   - 检查 shape 字段是否正确 ✓ 已验证

2. 【渲染问题】
   - drawParticles 函数可能没有被调用
   - dataRef.current.points 可能为空
   - 结晶的 opacity 可能为 0
   - 结晶可能被过滤掉了

3. 【位置问题】
   - 结晶位置可能在屏幕外
   - 相机 zoom 太小

💡 建议操作:
   1. 放大视图 (滚轮)
   2. 在 Canvas 上点击右键 "检查元素"
   3. 查看 React 组件的 props 和 state
   4. 在 drawParticles 函数开头添加 console.log
`);

  console.log("✅ 诊断完成");
})();
