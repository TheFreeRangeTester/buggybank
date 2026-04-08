"use client";

import { qaModeEnabled } from "@/config/bugFlags";
import {
  qaHintsCatalog,
  type QaEvent,
  type QaHintDifficulty,
  type QaHintItem,
  type QaHintPlacement,
  type QaScope
} from "@/data/qa-hints-catalog";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

type EventCounters = Record<string, number>;

type QaContextValue = {
  enabled: boolean;
  active: boolean;
  panelOpen: boolean;
  setActive: (value: boolean) => void;
  togglePanel: () => void;
  trackEvent: (event: QaEvent) => void;
  getHints: (scope: QaScope, placement?: QaHintPlacement) => QaHintItem[];
  getHintById: (id: string) => QaHintItem | null;
};

const QaContext = createContext<QaContextValue | undefined>(undefined);

const rankDifficulty: Record<QaHintDifficulty, number> = {
  starter: 1,
  intermediate: 2,
  advanced: 3
};

const isHintUnlocked = (hint: QaHintItem, events: EventCounters): boolean => {
  if (!hint.trigger?.event) {
    return true;
  }

  const minCount = hint.trigger.minCount ?? 1;
  const currentCount = events[hint.trigger.event] ?? 0;
  return currentCount >= minCount;
};

export const QaProvider = ({ children }: { children: ReactNode }) => {
  const [active, setActive] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [events, setEvents] = useState<EventCounters>({});

  useEffect(() => {
    const storedMode = window.localStorage.getItem("bb.qa.active");
    const storedPanel = window.localStorage.getItem("bb.qa.panel");
    const storedEvents = window.localStorage.getItem("bb.qa.events");

    if (storedMode) {
      setActive(storedMode === "true");
    }

    if (storedPanel) {
      setPanelOpen(storedPanel === "true");
    }

    if (storedEvents) {
      try {
        const parsed = JSON.parse(storedEvents) as EventCounters;
        setEvents(parsed);
      } catch {
        setEvents({});
      }
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("bb.qa.active", String(active));
  }, [active]);

  useEffect(() => {
    window.localStorage.setItem("bb.qa.panel", String(panelOpen));
  }, [panelOpen]);

  useEffect(() => {
    window.localStorage.setItem("bb.qa.events", JSON.stringify(events));
  }, [events]);

  const activeMode = qaModeEnabled ? active : false;

  const setActiveSafe = useCallback((next: boolean) => {
    setActive(next);
    if (!next) {
      setPanelOpen(false);
    }
  }, []);

  const togglePanel = useCallback(() => {
    setPanelOpen((prev) => !prev);
  }, []);

  const trackEvent = useCallback((event: QaEvent) => {
    setEvents((prev) => ({
      ...prev,
      [event]: (prev[event] ?? 0) + 1
    }));
  }, []);

  const getHints = useCallback(
    (scope: QaScope, placement?: QaHintPlacement): QaHintItem[] => {
      if (!activeMode) return [];

      const scoped = qaHintsCatalog.filter((hint) => {
        const scopeMatch = hint.scope === scope || hint.scope === "global";
        const placementMatch = placement ? hint.placement === placement : true;
        return scopeMatch && placementMatch;
      });

      return scoped
        .filter((hint) => isHintUnlocked(hint, events))
        .sort((a, b) => rankDifficulty[a.difficulty] - rankDifficulty[b.difficulty]);
    },
    [activeMode, events]
  );

  const getHintById = useCallback(
    (id: string): QaHintItem | null => {
      if (!activeMode) return null;
      const hint = qaHintsCatalog.find((item) => item.id === id);
      if (!hint) return null;
      if (!isHintUnlocked(hint, events)) return null;
      return hint;
    },
    [activeMode, events]
  );

  const value = useMemo<QaContextValue>(() => {
    return {
      enabled: qaModeEnabled,
      active: activeMode,
      panelOpen,
      setActive: setActiveSafe,
      togglePanel,
      trackEvent,
      getHints,
      getHintById
    };
  }, [activeMode, panelOpen, setActiveSafe, togglePanel, trackEvent, getHints, getHintById]);

  return <QaContext.Provider value={value}>{children}</QaContext.Provider>;
};

export const useQaMode = (): QaContextValue => {
  const context = useContext(QaContext);
  if (!context) {
    throw new Error("useQaMode must be used within QaProvider");
  }
  return context;
};
