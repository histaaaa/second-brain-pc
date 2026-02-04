"use client";

import { useState, useEffect } from "react";

interface ProductDocumentProps {
  content: string;
  onAddToKnowledge?: () => void;
}

export function ProductDocument({ content, onAddToKnowledge }: ProductDocumentProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);
  const [showButton, setShowButton] = useState(false);

  // 内容更新时同步
  useEffect(() => {
    setEditedContent(content);
  }, [content]);

  // 当内容稳定后显示添加到知识库按钮
  useEffect(() => {
    if (content) {
      const timer = setTimeout(() => {
        setShowButton(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [content]);

  // 渲染 Markdown 简易版
  const renderContent = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, index) => {
      // 标题
      if (line.startsWith('## ')) {
        return (
          <h2 key={index} className="text-xl font-bold text-gray-800 mt-6 mb-3 pb-2 border-b border-gray-200">
            {line.replace('## ', '')}
          </h2>
        );
      }
      // 无序列表
      if (line.startsWith('- ')) {
        return (
          <li key={index} className="ml-4 text-gray-600 leading-relaxed">
            {line.replace('- ', '')}
          </li>
        );
      }
      // 有序列表
      if (/^\d+\. /.test(line)) {
        return (
          <li key={index} className="ml-4 text-gray-600 leading-relaxed list-decimal">
            {line.replace(/^\d+\. /, '')}
          </li>
        );
      }
      // 强调文本
      if (line.includes('**')) {
        const parts = line.split('**');
        return (
          <p key={index} className="text-gray-600 leading-relaxed mb-2">
            {parts.map((part, i) => 
              i % 2 === 1 ? <strong key={i} className="font-semibold text-gray-800">{part}</strong> : part
            )}
          </p>
        );
      }
      // 空行
      if (line.trim() === '') {
        return <br key={index} />;
      }
      // 普通段落
      return (
        <p key={index} className="text-gray-600 leading-relaxed mb-2">
          {line}
        </p>
      );
    });
  };

  if (!content) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400 text-sm">
        AI 生成的文档将显示在这里...
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* 标题栏 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-white font-medium">产品定义文档</h3>
            <p className="text-xs text-gray-500">AI 生成 · 可编辑</p>
          </div>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            isEditing 
              ? "bg-blue-500 text-white" 
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          {isEditing ? "完成编辑" : "编辑文档"}
        </button>
      </div>

      {/* 文档内容 */}
      <div className="flex-1 overflow-y-auto">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          {/* Word 风格工具栏 */}
          <div className="bg-gray-100 border-b border-gray-200 px-4 py-2 flex items-center gap-4">
            <div className="flex items-center gap-1 text-gray-500 text-xs">
              <span>文件</span>
              <span>|</span>
              <span>编辑</span>
              <span>|</span>
              <span>查看</span>
              <span>|</span>
              <span>插入</span>
            </div>
          </div>

          {/* 文档页面 */}
          <div 
            className={`
              p-8 min-h-[400px] font-serif
              ${isEditing ? "outline-none" : ""}
            `}
            contentEditable={isEditing}
            suppressContentEditableWarning
            onChange={(e) => setEditedContent(e.currentTarget.textContent || "")}
          >
            {isEditing ? (
              <pre className="whitespace-pre-wrap font-sans text-sm text-gray-700 leading-relaxed">
                {editedContent}
              </pre>
            ) : (
              <div className="prose prose-sm max-w-none">
                {renderContent(content)}
              </div>
            )}
          </div>

          {/* 页面底部装饰 */}
          <div className="bg-gray-50 border-t border-gray-200 px-4 py-2 flex items-center justify-between text-xs text-gray-400">
            <span>第二大脑 - AI 生成文档</span>
            <span>第 1 页，共 1 页</span>
          </div>
        </div>
      </div>

      {/* 添加到知识库按钮 */}
      {showButton && (
        <div className="mt-4 flex justify-end">
          <button
            onClick={onAddToKnowledge}
            className={`
              flex items-center gap-2 px-6 py-3 rounded-lg
              bg-gradient-to-r from-blue-500 to-purple-600
              text-white font-medium
              transform transition-all duration-300
              hover:scale-105 hover:shadow-lg hover:shadow-blue-500/30
              animate-fade-in-up
            `}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            将新知识加入知识库
          </button>
        </div>
      )}
    </div>
  );
}
