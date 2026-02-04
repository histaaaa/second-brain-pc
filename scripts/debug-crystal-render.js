/**
 * 详细调试脚本：检查 NebulaPoint 中的结晶渲染状态
 * 
 * 在浏览器控制台执行，查看结晶的 type 和 shape 属性
 */

(async () => {
  console.log("%c🔍 详细检查结晶渲染状态...", "color: #00ff88; font-size: 14px; font-weight: bold;");
  console.log("%c" + "=".repeat(60), "color: #666;");

  if (typeof db === 'undefined') {
    console.error("❌ db 对象未找到，请确保在应用页面中执行");
    return;
  }

  // 1. 检查结晶数据
  const crystals = await db.crystals.toArray();
  console.log(`\n📊 数据库中的结晶数量: ${crystals.length}`);

  if (crystals.length === 0) {
    console.log("❌ 数据库中没有结晶数据");
    return;
  }

  // 2. 统计各种形状
  const shapes = { cube: 0, diamond: 0, star: 0, sphere: 0, undefined: 0 };
  crystals.forEach(c => {
    if (c.shape && shapes.hasOwnProperty(c.shape)) {
      shapes[c.shape]++;
    } else {
      shapes.undefined++;
    }
  });

  console.log(`\n📐 形状分布:`);
  Object.entries(shapes).forEach(([shape, count]) => {
    const icon = { cube: '🔷', diamond: '💎', star: '⭐', sphere: '⭕', undefined: '❓' }[shape];
    console.log(`   ${icon} ${shape}: ${count} 个`);
  });

  // 3. 检查 person_card 类型
  const personCards = crystals.filter(c => c.template_id === 'person_card');
  console.log(`\n👤 人物卡数量: ${personCards.length}`);

  if (personCards.length > 0) {
    const first = personCards[0];
    console.log(`   示例人物卡:`);
    console.log(`   - ID: ${first.id}`);
    console.log(`   - 名称: ${first.payload.name}`);
    console.log(`   - shape: ${first.shape}`);
    console.log(`   - template_id: ${first.template_id}`);
  }

  // 4. 检查 NebulaPoint 数据流（如果 NebulaView 已加载）
  if (typeof window !== 'undefined' && document.querySelector('canvas')) {
    console.log(`\n🎨 Canvas 已检测到，检查渲染数据...`);
    
    // 尝试访问 NebulaCanvas 组件中的 dataRef
    const canvas = document.querySelector('canvas');
    if (canvas && canvas.parentElement) {
      // 查找包含 NebulaCanvas 的组件实例
      const componentEl = canvas.parentElement.closest('[data-testid], [class*="nebula"]');
      if (componentEl) {
        console.log(`   找到 NebulaCanvas 容器`);
      }
    }
    
    console.log(`\n💡 建议:`);
    console.log(`   1. 按 F12 打开开发者工具`);
    console.log(`   2. 在 Network 标签中禁用缓存 (Disable cache)`);
    console.log(`   3. 刷新页面 (Ctrl+F5)`);
    console.log(`   4. 放大视图滚轮滚动，看是否有更大的旋转形状出现`);
  } else {
    console.log(`\n⚠️  Canvas 未检测到，请在星云视图页面执行此脚本`);
  }

  // 5. 列出所有 person_card 结晶
  console.log(`\n📋 所有人物卡列表:`);
  personCards.forEach((c, i) => {
    const payload = c.payload;
    const shapeIcon = { cube: '🔷', diamond: '💎', star: '⭐', sphere: '⭕' }[c.shape] || '❓';
    console.log(`   ${i + 1}. ${shapeIcon} ${payload.name} (${c.shape})`);
  });

  console.log(`\n✅ 检查完成`);
})();
