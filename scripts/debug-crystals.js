/**
 * 调试脚本：检查结晶数据
 * 
 * 在浏览器控制台执行，查看当前数据库中的结晶
 */

(async () => {
  console.log("%c🔍 检查结晶数据...", "color: #00ff88; font-size: 14px;");
  console.log("%c" + "=".repeat(50), "color: #666;");

  if (typeof db === 'undefined') {
    console.error("❌ db 对象未找到");
    return;
  }

  // 1. 统计数量
  const crystalCount = await db.crystals.count();
  const stardustCount = await db.stardust.count();
  const sourceCount = await db.crystal_sources.count();

  console.log(`📊 数据统计:`);
  console.log(`   - 星尘总数: ${stardustCount}`);
  console.log(`   - 结晶总数: ${crystalCount}`);
  console.log(`   - 来源关联数: ${sourceCount}`);

  if (crystalCount === 0) {
    console.log(`\n⚠️  没有找到任何结晶！`);
    console.log(`💡 请先运行 generate-person-cards.js 脚本生成结晶`);
    return;
  }

  // 2. 列出所有结晶
  console.log(`\n📦 结晶列表:`);
  const crystals = await db.crystals.toArray();
  
  for (const crystal of crystals) {
    const payload = crystal.payload;
    console.log(`\n${"-".repeat(40)}`);
    console.log(`🆔 ID: ${crystal.id}`);
    console.log(`📛 名称: ${payload.name || crystal.title}`);
    console.log(`📐 形状: ${crystal.shape || '❌ 无'}`);
    console.log(`📅 创建时间: ${new Date(crystal.created_at).toLocaleString('zh-CN')}`);
    console.log(`🏷️ 模板类型: ${crystal.template_id}`);
  }

  // 3. 统计形状分布
  const shapeCounts = {};
  crystals.forEach(c => {
    const shape = c.shape || 'undefined';
    shapeCounts[shape] = (shapeCounts[shape] || 0) + 1;
  });

  console.log(`\n📈 形状分布:`);
  Object.entries(shapeCounts).forEach(([shape, count]) => {
    const icon = {
      'cube': '🔷',
      'diamond': '💎',
      'star': '⭐',
      'sphere': '⭕',
      'undefined': '❓'
    }[shape] || '•';
    console.log(`   ${icon} ${shape}: ${count} 个`);
  });

  // 4. 检查渲染相关字段
  console.log(`\n🎨 渲染检查:`);
  const firstCrystal = crystals[0];
  console.log(`   type: ${firstCrystal.type || '(无此字段)'}`);
  console.log(`   shape: ${firstCrystal.shape || '(无此字段)'}`);
  console.log(`   category: ${firstCrystal.category}`);

  console.log(`\n💡 提示: 确保结晶的 shape 字段不为空`);
})();
