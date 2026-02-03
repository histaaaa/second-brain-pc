// 诊断脚本：检查数据库中的分类统计
// 使用方法：在浏览器控制台（F12 -> Console）中粘贴运行

(async () => {
  try {
    const { loadDatabaseData } = await import('/src/lib/db/local-data.ts');
    const { stardustsToNebulaPoints } = await import('/src/lib/db/local-data.ts');
    
    const { projects, stardusts } = await loadDatabaseData();
    const points = stardustsToNebulaPoints(stardusts);
    
    // 统计各类别数量
    const categoryCount = {};
    points.forEach(p => {
      categoryCount[p.category] = (categoryCount[p.category] || 0) + 1;
    });
    
    console.log('========== 数据诊断 ==========');
    console.log(`总点数: ${points.length}`);
    console.log(`项目数: ${projects.length}`);
    console.log('\n各类别统计:');
    
    const sorted = Object.entries(categoryCount).sort((a, b) => b[1] - a[1]);
    sorted.forEach(([cat, count]) => {
      console.log(`  ${cat}: ${count}`);
    });
    
    console.log('\n=============================');
    
    // 返回结果供进一步分析
    return { points, categoryCount };
  } catch (err) {
    console.error('诊断失败:', err);
    return null;
  }
})();
