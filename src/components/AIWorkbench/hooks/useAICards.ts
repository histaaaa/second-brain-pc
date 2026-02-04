"use client";

import { useState, useCallback } from "react";

export interface AICardData {
  id: string;
  title: string;
  summary: string;
  content: string;
  sourceMessageId: string;
  sourceConversationId: string;
  tags: string[];
  createdAt: Date;
  position: { x: number; y: number };
}

export interface UseAICardsReturn {
  cards: AICardData[];
  addCard: (card: Omit<AICardData, "id" | "createdAt">) => string;
  updateCard: (id: string, updates: Partial<AICardData>) => void;
  deleteCard: (id: string) => void;
  moveCard: (id: string, position: { x: number; y: number }) => void;
  addTag: (cardId: string, tag: string) => void;
  removeTag: (cardId: string, tag: string) => void;
  clearAllCards: () => void;
  selectedCards: string[];
  toggleSelectCard: (id: string) => void;
  clearSelection: () => void;
  bulkDeleteCards: (ids: string[]) => void;
}

export function useAICards(initialCards: AICardData[] = []): UseAICardsReturn {
  const [cards, setCards] = useState<AICardData[]>(initialCards);
  const [selectedCards, setSelectedCards] = useState<string[]>([]);

  const addCard = useCallback((card: Omit<AICardData, "id" | "createdAt">) => {
    const newCard: AICardData = {
      ...card,
      id: `card-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
    };
    setCards((prev) => [...prev, newCard]);
    return newCard.id;
  }, []);

  const updateCard = useCallback((id: string, updates: Partial<AICardData>) => {
    setCards((prev) =>
      prev.map((card) => (card.id === id ? { ...card, ...updates } : card))
    );
  }, []);

  const deleteCard = useCallback((id: string) => {
    setCards((prev) => prev.filter((card) => card.id !== id));
    setSelectedCards((prev) => prev.filter((cardId) => cardId !== id));
  }, []);

  const moveCard = useCallback(
    (id: string, position: { x: number; y: number }) => {
      setCards((prev) =>
        prev.map((card) =>
          card.id === id ? { ...card, position } : card
        )
      );
    },
    []
  );

  const addTag = useCallback((cardId: string, tag: string) => {
    setCards((prev) =>
      prev.map((card) =>
        card.id === cardId && !card.tags.includes(tag)
          ? { ...card, tags: [...card.tags, tag] }
          : card
      )
    );
  }, []);

  const removeTag = useCallback((cardId: string, tag: string) => {
    setCards((prev) =>
      prev.map((card) =>
        card.id === cardId
          ? { ...card, tags: card.tags.filter((t) => t !== tag) }
          : card
      )
    );
  }, []);

  const clearAllCards = useCallback(() => {
    setCards([]);
    setSelectedCards([]);
  }, []);

  const toggleSelectCard = useCallback((id: string) => {
    setSelectedCards((prev) =>
      prev.includes(id) ? prev.filter((cardId) => cardId !== id) : [...prev, id]
    );
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedCards([]);
  }, []);

  const bulkDeleteCards = useCallback((ids: string[]) => {
    setCards((prev) => prev.filter((card) => !ids.includes(card.id)));
    setSelectedCards((prev) => prev.filter((id) => !ids.includes(id)));
  }, []);

  return {
    cards,
    addCard,
    updateCard,
    deleteCard,
    moveCard,
    addTag,
    removeTag,
    clearAllCards,
    selectedCards,
    toggleSelectCard,
    clearSelection,
    bulkDeleteCards,
  };
}