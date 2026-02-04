"use client";

import { useState, useCallback, useRef } from "react";

export interface ConversationMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
  stage?: string;
  relatedCards?: string[];
}

export interface ConversationSession {
  id: string;
  title: string;
  projectId: string;
  messages: ConversationMessage[];
  createdAt: Date;
  updatedAt: Date;
  currentStage: string;
}

export interface UseConversationReturn {
  messages: ConversationMessage[];
  isLoading: boolean;
  session: ConversationSession | null;
  sendMessage: (content: string) => Promise<void>;
  regenerateLastResponse: () => Promise<void>;
  clearConversation: () => void;
  updateMessage: (id: string, updates: Partial<ConversationMessage>) => void;
  detectStage: (messages: ConversationMessage[]) => string;
}

export function useConversation(
  projectId?: string,
  sessionId?: string
): UseConversationReturn {
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [session, setSession] = useState<ConversationSession | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // 阶段检测逻辑
  const detectStage = useCallback((msgs: ConversationMessage[]): string => {
    if (msgs.length === 0) return "目标设定";
    if (msgs.length <= 2) return "信息收集";
    if (msgs.length <= 5) return "方案构思";
    if (msgs.length <= 8) return "深度讨论";
    return "总结输出";
  }, []);

  // 发送消息
  const sendMessage = useCallback(
    async (content: string) => {
      setIsLoading(true);

      // 创建用户消息
      const userMessage: ConversationMessage = {
        id: `msg-${Date.now()}`,
        role: "user",
        content,
        timestamp: new Date(),
      };

      // 添加用户消息到对话
      setMessages((prev) => [...prev, userMessage]);

      // 模拟 AI 流式响应
      try {
        abortControllerRef.current = new AbortController();

        // 创建空的 AI 消息占位
        const assistantMessageId = `msg-${Date.now() + 1}`;
        const assistantMessage: ConversationMessage = {
          id: assistantMessageId,
          role: "assistant",
          content: "",
          timestamp: new Date(),
          isStreaming: true,
          stage: detectStage(messages),
        };

        setMessages((prev) => [...prev, assistantMessage]);

        // 模拟流式输出（实际项目中替换为真实 API 调用）
        const responseContent = generateMockResponse(content, messages);
        const chunks = chunkText(responseContent, 50);

        for (const chunk of chunks) {
          if (abortControllerRef.current?.signal.aborted) break;

          await delay(30 + Math.random() * 50);

          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMessageId
                ? { ...msg, content: msg.content + chunk }
                : msg
            )
          );
        }

        // 标记流式结束
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? { ...msg, isStreaming: false }
              : msg
          )
        );

        // 更新会话状态
        setSession((prev) =>
          prev
            ? {
                ...prev,
                messages: [...messages, userMessage],
                updatedAt: new Date(),
                currentStage: detectStage(messages),
              }
            : {
                id: sessionId || `session-${Date.now()}`,
                title: content.slice(0, 30) + (content.length > 30 ? "..." : ""),
                projectId: projectId || "default",
                messages: [...messages, userMessage],
                createdAt: new Date(),
                updatedAt: new Date(),
                currentStage: detectStage(messages),
              }
        );
      } catch (error) {
        console.error("Failed to send message:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [messages, projectId, sessionId, detectStage]
  );

  // 重新生成最后一条回复
  const regenerateLastResponse = useCallback(async () => {
    const lastAssistantMessage = [...messages]
      .reverse()
      .find((msg) => msg.role === "assistant");

    if (!lastAssistantMessage) return;

    const userMessageBefore = [...messages]
      .reverse()
      .find((msg) => msg.id !== lastAssistantMessage.id && msg.role === "user");

    if (userMessageBefore) {
      await sendMessage(userMessageBefore.content);
    }
  }, [messages, sendMessage]);

  // 清空对话
  const clearConversation = useCallback(() => {
    setMessages([]);
    setSession(null);
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  // 更新特定消息
  const updateMessage = useCallback(
    (id: string, updates: Partial<ConversationMessage>) => {
      setMessages((prev) =>
        prev.map((msg) => (msg.id === id ? { ...msg, ...updates } : msg))
      );
    },
    []
  );

  return {
    messages,
    isLoading,
    session,
    sendMessage,
    regenerateLastResponse,
    clearConversation,
    updateMessage,
    detectStage,
  };
}

// 辅助函数：分块文本
function chunkText(text: string, chunkSize: number): string[] {
  const chunks: string[] = [];
  let i = 0;

  while (i < text.length) {
    let chunk = text.slice(i, i + chunkSize);

    // 确保在句号、问号、感叹号处断开
    const lastPunctuation = Math.max(
      chunk.lastIndexOf("。"),
      chunk.lastIndexOf("？"),
      chunk.lastIndexOf("！"),
      chunk.lastIndexOf("\n")
    );

    if (lastPunctuation > chunkSize * 0.5 && i + chunkSize < text.length) {
      chunk = chunk.slice(0, lastPunctuation + 1);
    }

    chunks.push(chunk);
    i += chunk.length;
  }

  return chunks;
}

// 辅助函数：延迟
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// 模拟 AI 响应
function generateMockResponse(
  userMessage: string,
  history: ConversationMessage[]
): string {
  const stage = history.length <= 2 ? "信息收集" : "方案构思";

  const responses: Record<string, string[]> = {
    目标设定: [
      `好的，我理解了您的目标。让我先了解一下相关背景。\n\n为了更好地帮您完成这个任务，我需要知道：\n1. 这个项目的目标用户是谁？\n2. 有没有具体的时间节点或里程碑？\n3. 您期望的交付物是什么形式的？`,
    ],
    信息收集: [
      `感谢您的补充信息。根据您提供的内容，我来做一些分析：\n\n**关键发现：**\n- 您提到的"${userMessage.slice(0, 20)}..."是一个重要的方向\n- 目前市场上类似的产品/方案主要有几类...`,
      `明白了，让我进一步细化。\n\n**建议的思考框架：**\n1. 首先明确核心价值主张\n2. 然后梳理用户痛点\n3. 最后设计解决方案\n\n您希望从哪个部分开始深入讨论？`,
    ],
    方案构思: [
      `基于之前的讨论，我为您梳理了以下几个方案：\n\n**方案一：渐进式推进**\n- 优点：风险可控，迭代灵活\n- 缺点：周期较长\n\n**方案二：一步到位**\n- 优点：速度快，效果明显\n- 缺点：前期投入大\n\n**方案三：混合策略**\n- 结合前两者的优势...\n\n您倾向于哪个方向？`,
    ],
    深度讨论: [
      `您提出了一个很关键的问题。让我详细分析一下：\n\n**多角度分析：**\n1. 从技术角度看...（此处应有技术评估）\n2. 从业务角度看...（此处应有业务分析）\n3. 从用户体验角度看...（此处应有用户研究）\n\n**我的建议是：**...`,
    ],
    总结输出: [
      `好的，我们已经讨论了很多内容。让我为您做一个总结：\n\n**核心结论：**\n1. ${userMessage.slice(0, 30)}的主要方向已经明确\n2. 建议采用 XX 方案，理由是...\n3. 下一步行动建议：\n   - 短期：XXX\n   - 中期：XXX\n   - 长期：XXX\n\n是否需要我将这些整理成正式的文档？`,
    ],
  };

  const stageResponses = responses[stage] || responses["信息收集"];
  return stageResponses[Math.floor(Math.random() * stageResponses.length)];
}