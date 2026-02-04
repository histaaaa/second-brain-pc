/**
 * 渲染验证脚本 - 验证结晶形状是否被正确绘制
 * 
 * 在浏览器控制台执行此脚本
 */

(async () => {
  console.log("%c🔬 渲染验证测试", "color: #00ff88; font-size: 16px; font-weight: bold;");
  console.log("%c" + "=".repeat(60), "color: #666;");

  if (typeof db === 'undefined') {
    console.error("❌ db 未初始化");
    return;
  }

  // 1. 检查数据库中的结晶
  const crystals = await db.crystals.toArray();
  const personCards = crystals.filter(c => c.template_id === 'person_card');
  
  console.log(`\n📊 数据统计:`);
  console.log(`   - 总结晶数: ${crystals.length}`);
  console.log(`   - 人物卡数: ${personCards.length}`);

  // 2. 检查 shape 分布
  const shapeStats = {};
  personCards.forEach(c => {
    const shape = c.shape || 'undefined';
    shapeStats[shape] = (shapeStats[shape] || 0) + 1;
  });

  console.log(`\n📐 人物卡形状分布:`);
  Object.entries(shapeStats).forEach(([shape, count]) => {
    const icons = { cube: '🔷', diamond: '💎', sphere: '⭕', star: '⭐', undefined: '❓' };
    console.log(`   ${icons[shape]} ${shape}: ${count}`);
  });

  // 3. 列出所有人物卡
  console.log(`\n📋 人物卡详情:`);
  personCards.forEach((c, i) => {
    const p = c.payload;
    const shape = c.shape || '❌';
    console.log(`   ${i+1}. ${shape} ${p.name} - ${p.relationship}`);
  });

  // 4. 模拟渲染逻辑测试
  console.log(`\n🧪 模拟渲染测试:`);
  console.log("   测试 drawParticles 中的条件判断...");
  
  const testPoints = personCards.slice(0, 3);
  testPoints.forEach((c, i) => {
    const p = c.payload;
    const type = "crystal";
    const shape = c.shape;
    
    // 模拟 drawParticles 中的判断逻辑
    const condition = type === "crystal" && shape;
    const result = condition ? `✅ 绘制形状: ${shape}` : `❌ 跳过`;
    
    console.log(`   ${p.name}: type="${type}", shape="${shape}" → ${result}`);
  });

  // 5. 检查是否有 Canvas
  const canvas = document.querySelector('canvas');
  console.log(`\n🎨 Canvas 检查:`);
  if (canvas) {
    console.log(`   ✅ Canvas 存在: ${canvas.width}x${canvas.height}`);
    
    // 检查 zoom 级别
    const nebulaView = document.querySelector('[class*="nebula"], [class*="canvas"]');
    console.log(`   容器: ${nebulaView ? '✅ 找到' : '❌ 未找到'}`);
  } else {
    console.log(`   ❌ Canvas 未找到（可能未进入星云视图）`);
  }

  // 6. 放大建议
  console.log(`\n💡 视觉建议:`);
  console.log(`   1. 使用鼠标滚轮放大视图 (zoom in)`);
  console.log(`   2. 结晶尺寸: 6-7px, 星尘尺寸: 0.6-1.7px`);
  console.log(`   3. 结晶形状: cube🔷 diamond💎 sphere⭕ star⭐`);
  console.log(`   4. 结晶会缓慢旋转，可以作为识别特征`);

  console.log(`\n✅ 验证完成`);
})();
