import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import type { Character, CharacterStatus, Seat, ToastItem, ChatMessage, DimensionId } from './types/game';
import { INITIAL_COLLEAGUES, OFFICE_RANDOM_CHATS } from './constants/colleagues';
import { DIMENSIONS, MAP_WIDTH, MAP_HEIGHT } from './constants/officeLayout';
import { VietnamClock } from './components/VietnamClock';
import { CharacterCreator } from './components/CharacterCreator';
import { GameCanvas } from './components/GameCanvas';
import { ChatBar } from './components/ChatBar';
import { Minimap } from './components/Minimap';
import { DimensionNavHUD } from './components/DimensionNavHUD';
import { ToastContainer } from './components/ToastContainer';
import { ExitModal } from './components/ExitModal';
import { LogOut, UserCheck, Sparkles } from 'lucide-react';

const STORAGE_KEY = 'office_game_user_character';
const DIMENSION_KEY = 'office_game_dimension';

export function App() {
  const [currentDimension, setCurrentDimension] = useState<DimensionId>(() => {
    try {
      const saved = localStorage.getItem(DIMENSION_KEY);
      if (saved) return saved as DimensionId;
    } catch {}
    return 'office';
  });

  const [userCharacter, setUserCharacter] = useState<Character | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          status: 'online',
          isMoving: false,
          isSitting: parsed.isSitting || false,
          dimensionId: parsed.dimensionId || 'office',
        };
      }
    } catch (e) {
      console.error('Failed to load user character', e);
    }
    return null;
  });

  const [colleagues, setColleagues] = useState<Character[]>(INITIAL_COLLEAGUES);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [isEditingCharacter, setIsEditingCharacter] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [focusCoord, setFocusCoord] = useState<{ x: number; y: number } | null>(null);

  const userCharRef = useRef<Character | null>(userCharacter);
  userCharRef.current = userCharacter;
  const currentDimRef = useRef(currentDimension);
  currentDimRef.current = currentDimension;

  // Single authoritative physics & movement state (bypasses React render delays for true 60-120 FPS)
  const playerPhysRef = useRef({
    x: userCharacter?.position.x ?? 1210,
    y: userCharacter?.position.y ?? 520,
    targetX: null as number | null,
    targetY: null as number | null,
    isMoving: false,
    direction: (userCharacter?.direction ?? 'down') as 'left' | 'right' | 'up' | 'down',
  });
  const keysDownRef = useRef(new Set<string>());
  const lastWsSendRef = useRef<number>(0);

  const channelRef = useRef<BroadcastChannel | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const saveCharacterToStorage = useCallback((char: Character) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(char));
    } catch (err) {
      console.error('Save to localStorage failed', err);
    }
  }, []);

  // Save position and set status to offline when closing/exiting browser
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (userCharacter) {
        const offlineChar: Character = {
          ...userCharacter,
          status: 'offline',
          isMoving: false,
        };
        saveCharacterToStorage(offlineChar);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [userCharacter, saveCharacterToStorage]);

  // Handle incoming or new chat message and create appropriate toast
  const handleIncomingChatMessage = useCallback((message: ChatMessage) => {
    const isLong = message.content.length > 50 || message.content.includes('\n');

    const newToast: ToastItem = {
      id: `toast-${Date.now()}-${Math.random()}`,
      message,
      isExpanded: false,
      isLong,
      createdAt: Date.now(),
    };

    setToasts((prev) => [newToast, ...prev.slice(0, 5)]);
  }, []);

  // Real-time WebSocket connection to production server
  useEffect(() => {
    let socket: WebSocket | null = null;
    try {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws`;
      socket = new WebSocket(wsUrl);
      wsRef.current = socket;

      socket.onopen = () => {
        if (userCharacter) {
          socket?.send(
            JSON.stringify({
              type: 'PLAYER_JOIN',
              data: {
                ...userCharacter,
                dimensionId: currentDimension,
              },
            })
          );
        }
      };

      socket.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          const { type, data } = payload;

          if (type === 'NEW_CHAT') {
            handleIncomingChatMessage(data);
          } else if (type === 'INIT_STATE') {
            if (data?.players && Array.isArray(data.players)) {
              const curUserId = userCharRef.current?.id;
              const curUserName = userCharRef.current?.name;
              setColleagues((prev) => {
                const merged = [...prev];
                for (const p of data.players) {
                  if (p.id === curUserId || p.name === curUserName) continue;
                  if (!merged.some((c) => c.id === p.id || c.name === p.name)) {
                    merged.push({ ...p, isUser: false });
                  }
                }
                return merged;
              });
            }
          } else if (type === 'PLAYER_JOINED') {
            const curUserId = userCharRef.current?.id;
            const curUserName = userCharRef.current?.name;
            if (data.id === curUserId || data.name === curUserName) {
              return; // Never duplicate the user character
            }
            setColleagues((prev) => {
              if (prev.some((c) => c.id === data.id || c.name === data.name)) return prev;
              return [...prev, { ...data, isUser: false }];
            });
          } else if (type === 'PLAYER_MOVED') {
            const curUserId = userCharRef.current?.id;
            if (data.id === curUserId) {
              return; // Ignore server echo of our own movement
            }
            setColleagues((prev) =>
              prev.map((c) =>
                c.id === data.id
                  ? {
                      ...c,
                      position: data.position,
                      direction: data.direction,
                      isMoving: data.isMoving,
                      isSitting: data.isSitting,
                      sittingSeatId: data.sittingSeatId,
                      currentAction: data.currentAction,
                      dimensionId: data.dimensionId || c.dimensionId || 'office',
                    }
                  : c
              )
            );
          } else if (type === 'PLAYER_STATUS_CHANGED') {
            setColleagues((prev) =>
              prev.map((c) => (c.id === data.id ? { ...c, status: data.status } : c))
            );
          } else if (type === 'PLAYER_LEFT') {
            setColleagues((prev) => prev.filter((c) => c.id !== data.id));
          }
        } catch (e) {
          console.error('WS parse error', e);
        }
      };
    } catch {
      // WS fallback
    }

    return () => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, [handleIncomingChatMessage, userCharacter, currentDimension]);

  // Multi-tab BroadcastChannel setup as local backup
  useEffect(() => {
    try {
      const channel = new BroadcastChannel('office_game_sync');
      channelRef.current = channel;

      channel.onmessage = (event) => {
        const { type, data } = event.data;
        if (type === 'NEW_CHAT') {
          handleIncomingChatMessage(data);
        } else if (type === 'REMOTE_USER_MOVE') {
          setColleagues((prev) =>
            prev.map((c) => (c.id === data.id ? { ...c, position: data.position } : c))
          );
        }
      };

      return () => {
        channel.close();
      };
    } catch {
      // BroadcastChannel fallback
    }
  }, [handleIncomingChatMessage]);

  // Dimension Warp / Teleport Handler
  const handleTeleport = useCallback(
    (dimId: DimensionId) => {
      setCurrentDimension(dimId);
      try {
        localStorage.setItem(DIMENSION_KEY, dimId);
      } catch {}

      const curChar = userCharRef.current;
      if (curChar) {
        const targetConfig = DIMENSIONS.find((d) => d.id === dimId);
        const spawnCoord = targetConfig?.defaultSpawn || { x: 1210, y: 520 };

        playerPhysRef.current.x = spawnCoord.x;
        playerPhysRef.current.y = spawnCoord.y;
        playerPhysRef.current.targetX = null;
        playerPhysRef.current.targetY = null;
        playerPhysRef.current.isMoving = false;

        const updatedUser: Character = {
          ...curChar,
          dimensionId: dimId,
          position: spawnCoord,
          targetPosition: undefined,
          isMoving: false,
          isSitting: false,
          sittingSeatId: undefined,
        };
        setUserCharacter(updatedUser);
        saveCharacterToStorage(updatedUser);

        const timeStr = new Date().toLocaleTimeString('vi-VN', {
          hour: '2-digit',
          minute: '2-digit',
        });
        const warpMsg: ChatMessage = {
          id: `warp-${Date.now()}`,
          senderId: updatedUser.id,
          senderName: updatedUser.name,
          senderRole: updatedUser.role,
          senderAppearance: updatedUser.appearance,
          content: `Vừa bước qua Cổng Không Gian dịch chuyển đến: ${targetConfig?.name || dimId}! 🌌✨`,
          timestamp: timeStr,
          mentions: [],
          isLong: false,
          dimensionId: dimId,
        };
        handleIncomingChatMessage(warpMsg);

        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.send(
            JSON.stringify({
              type: 'PLAYER_MOVE',
              data: {
                position: updatedUser.position,
                direction: updatedUser.direction,
                isMoving: false,
                isSitting: false,
                dimensionId: dimId,
              },
            })
          );
        }
      }
    },
    [handleIncomingChatMessage, saveCharacterToStorage]
  );

  // Dispatch a new chat message from player
  const handleSendMessage = (content: string, mentions: string[]) => {
    if (!userCharacter) return;

    const timeStr = new Date().toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    });

    const updatedUser: Character = {
      ...userCharacter,
      lastMessage: content,
      lastMessageTime: timeStr,
      dimensionId: currentDimension,
    };
    setUserCharacter(updatedUser);
    saveCharacterToStorage(updatedUser);

    const currentConfig = DIMENSIONS.find((d) => d.id === currentDimension);
    const chatMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: updatedUser.id,
      senderName: updatedUser.name,
      senderRole: `${updatedUser.role} [${currentConfig?.icon || '🏢'}]`,
      senderAppearance: updatedUser.appearance,
      content,
      timestamp: timeStr,
      mentions,
      isLong: content.length > 50,
      dimensionId: currentDimension,
    };

    handleIncomingChatMessage(chatMsg);

    // Send via WebSocket to server
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: 'NEW_CHAT',
          data: chatMsg,
        })
      );
    }

    // Broadcast to other tabs
    channelRef.current?.postMessage({
      type: 'NEW_CHAT',
      data: chatMsg,
    });

    // If any colleague was tagged, make them respond contextually
    if (mentions.length > 0) {
      mentions.forEach((taggedName) => {
        const colleague = colleagues.find((c) => c.name === taggedName);
        if (colleague) {
          setTimeout(() => {
            const replies = [
              `Chào @${userCharacter.name}, tôi nghe đây! Cần hỗ trợ gì về dự án không? 🤝`,
              `@${userCharacter.name} ơi, tôi vừa nhận được thông tin rồi, để tôi check ngay nhé! ✨`,
              `Đồng ý với @${userCharacter.name}, lát mình thảo luận kỹ hơn nhé! 👍`,
              `@${userCharacter.name} tag chuẩn ghê, tôi cũng đang ở đây nè! 🚀`,
            ];
            const replyContent = replies[Math.floor(Math.random() * replies.length)];
            makeColleagueChat(colleague.id, replyContent);
          }, 2000 + Math.random() * 2000);
        }
      });
    }
  };

  // Helper to make a colleague chat
  const makeColleagueChat = (colleagueId: string, content: string) => {
    const timeStr = new Date().toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    });

    setColleagues((prev) =>
      prev.map((c) => {
        if (c.id === colleagueId) {
          const updated = {
            ...c,
            lastMessage: content,
            lastMessageTime: timeStr,
          };

          const chatMsg: ChatMessage = {
            id: `msg-${Date.now()}-${c.id}`,
            senderId: c.id,
            senderName: c.name,
            senderRole: c.role,
            senderAppearance: c.appearance,
            content,
            timestamp: timeStr,
            mentions: [],
            isLong: content.length > 50,
            dimensionId: c.dimensionId || 'office',
          };
          handleIncomingChatMessage(chatMsg);

          return updated;
        }
        return c;
      })
    );
  };

  // Spontaneous occasional office chatter
  useEffect(() => {
    const interval = setInterval(() => {
      const randomColleague = colleagues[Math.floor(Math.random() * colleagues.length)];
      const randomChat = OFFICE_RANDOM_CHATS[Math.floor(Math.random() * OFFICE_RANDOM_CHATS.length)];
      if (randomColleague && randomChat) {
        makeColleagueChat(randomColleague.id, randomChat.content);
      }
    }, 28000);

    return () => clearInterval(interval);
  }, [colleagues]);

  // Unified, Authoritative Physics & Movement Loop (WASD + Click-to-Move at pure 60-120 FPS)
  const startMovementLoop = useCallback(() => {
    if (animFrameRef.current) return; // Loop already active

    const updateMovement = () => {
      const phys = playerPhysRef.current;
      const keys = keysDownRef.current;
      let moved = false;

      // 1. WASD & Arrow Keys
      const hasKeyMovement =
        keys.has('w') ||
        keys.has('a') ||
        keys.has('s') ||
        keys.has('d') ||
        keys.has('arrowup') ||
        keys.has('arrowdown') ||
        keys.has('arrowleft') ||
        keys.has('arrowright');

      if (hasKeyMovement) {
        let dx = 0;
        let dy = 0;
        if (keys.has('w') || keys.has('arrowup')) dy -= 1;
        if (keys.has('s') || keys.has('arrowdown')) dy += 1;
        if (keys.has('a') || keys.has('arrowleft')) dx -= 1;
        if (keys.has('d') || keys.has('arrowright')) dx += 1;

        if (dx !== 0 || dy !== 0) {
          const len = Math.hypot(dx, dy);
          const isShift = keys.has('shift');
          const speed = isShift ? 10.5 : 7.0;

          phys.x = Math.max(120, Math.min(MAP_WIDTH - 120, phys.x + (dx / len) * speed));
          phys.y = Math.max(160, Math.min(MAP_HEIGHT - 120, phys.y + (dy / len) * speed));

          let dir: 'left' | 'right' | 'up' | 'down' = 'down';
          if (Math.abs(dx) > Math.abs(dy)) {
            dir = dx > 0 ? 'right' : 'left';
          } else {
            dir = dy > 0 ? 'down' : 'up';
          }
          phys.direction = dir;
          phys.isMoving = true;
          moved = true;
        }
      }
      // 2. Click to Move (if no WASD keys currently held)
      else if (phys.targetX !== null && phys.targetY !== null) {
        const dx = phys.targetX - phys.x;
        const dy = phys.targetY - phys.y;
        const dist = Math.hypot(dx, dy);
        const speed = 7.5;

        if (dist <= speed) {
          phys.x = phys.targetX;
          phys.y = phys.targetY;
          phys.targetX = null;
          phys.targetY = null;
          phys.isMoving = false;
          moved = true;
        } else {
          const angle = Math.atan2(dy, dx);
          phys.x += Math.cos(angle) * speed;
          phys.y += Math.sin(angle) * speed;

          let dir: 'left' | 'right' | 'up' | 'down' = 'down';
          if (Math.abs(dx) > Math.abs(dy)) {
            dir = dx > 0 ? 'right' : 'left';
          } else {
            dir = dy > 0 ? 'down' : 'up';
          }
          phys.direction = dir;
          phys.isMoving = true;
          moved = true;
        }
      }

      if (moved) {
        setUserCharacter((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            position: { x: phys.x, y: phys.y },
            direction: phys.direction,
            isMoving: phys.isMoving,
            targetPosition:
              phys.targetX !== null && phys.targetY !== null
                ? { x: phys.targetX, y: phys.targetY }
                : undefined,
            isSitting: false,
            sittingSeatId: undefined,
          };
        });

        // Throttle WebSocket sync to 100ms
        const now = performance.now();
        if (now - lastWsSendRef.current > 100) {
          lastWsSendRef.current = now;
          if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(
              JSON.stringify({
                type: 'PLAYER_MOVE',
                data: {
                  position: { x: phys.x, y: phys.y },
                  direction: phys.direction,
                  isMoving: phys.isMoving,
                  isSitting: false,
                  dimensionId: currentDimRef.current,
                },
              })
            );
          }
        }
      }

      // Check whether to continue loop
      const stillHasKeys =
        keysDownRef.current.has('w') ||
        keysDownRef.current.has('a') ||
        keysDownRef.current.has('s') ||
        keysDownRef.current.has('d') ||
        keysDownRef.current.has('arrowup') ||
        keysDownRef.current.has('arrowdown') ||
        keysDownRef.current.has('arrowleft') ||
        keysDownRef.current.has('arrowright');
      const stillHasTarget = phys.targetX !== null && phys.targetY !== null;

      if (stillHasKeys || stillHasTarget) {
        animFrameRef.current = requestAnimationFrame(updateMovement);
      } else {
        // Stopped completely!
        animFrameRef.current = null;
        phys.isMoving = false;

        setUserCharacter((prev) => {
          if (!prev) return null;
          const stoppedChar = {
            ...prev,
            position: { x: phys.x, y: phys.y },
            direction: phys.direction,
            isMoving: false,
            targetPosition: undefined,
          };
          saveCharacterToStorage(stoppedChar);
          return stoppedChar;
        });

        // Final arrival sync via WebSocket
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.send(
            JSON.stringify({
              type: 'PLAYER_MOVE',
              data: {
                position: { x: phys.x, y: phys.y },
                direction: phys.direction,
                isMoving: false,
                isSitting: false,
                dimensionId: currentDimRef.current,
              },
            })
          );
        }
      }
    };

    animFrameRef.current = requestAnimationFrame(updateMovement);
  }, [saveCharacterToStorage]);

  // Global Keyboard Listener for WASD & Arrow Keys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      if (
        activeEl &&
        (activeEl.tagName === 'INPUT' ||
          activeEl.tagName === 'TEXTAREA' ||
          activeEl.getAttribute('contenteditable') === 'true')
      ) {
        return;
      }

      const key = e.key.toLowerCase();
      if (
        key === 'w' ||
        key === 'a' ||
        key === 's' ||
        key === 'd' ||
        key === 'arrowup' ||
        key === 'arrowdown' ||
        key === 'arrowleft' ||
        key === 'arrowright' ||
        key === 'shift'
      ) {
        e.preventDefault();
        keysDownRef.current.add(key);
        // Pressing keys immediately cancels any previous floor-click destination
        playerPhysRef.current.targetX = null;
        playerPhysRef.current.targetY = null;
        startMovementLoop();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      keysDownRef.current.delete(key);
    };

    const handleBlur = () => {
      keysDownRef.current.clear();
    };

    window.addEventListener('keydown', handleKeyDown, { passive: false });
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
    };
  }, [startMovementLoop]);

  // Move user on floor click
  const handleMoveUser = useCallback(
    (tX: number, tY: number) => {
      playerPhysRef.current.targetX = tX;
      playerPhysRef.current.targetY = tY;
      playerPhysRef.current.isMoving = true;
      startMovementLoop();
    },
    [startMovementLoop]
  );

  // Seat user on chair click
  const handleSeatUser = useCallback(
    (seat: Seat) => {
      const curChar = userCharRef.current;
      if (!curChar) return;

      playerPhysRef.current.x = seat.x;
      playerPhysRef.current.y = seat.y;
      playerPhysRef.current.targetX = null;
      playerPhysRef.current.targetY = null;
      playerPhysRef.current.isMoving = false;
      playerPhysRef.current.direction = seat.direction;

      let action: any = 'working';
      if (seat.type === 'dining') action = 'eating';
      else if (seat.type === 'cinema') action = 'watching';
      else if (seat.type === 'card') action = 'cards';
      else if (seat.type === 'gaming') action = 'gaming';
      else if (seat.type === 'fishing') action = 'fishing';
      else if (seat.type === 'bar') action = 'drinking';
      else if (seat.type === 'pool') action = 'swimming';
      else if (seat.type === 'telescope') action = 'stargazing';
      else if (seat.type === 'music') action = 'music';
      else if (seat.type === 'quantum') action = 'quantum';
      else if (seat.type === 'hack') action = 'hacking';
      else if (seat.type === 'tea') action = 'tea';
      else if (seat.type === 'zen' || seat.type === 'onsen') action = 'zen';

      const seatedUser: Character = {
        ...curChar,
        position: { x: seat.x, y: seat.y },
        targetPosition: undefined,
        isMoving: false,
        isSitting: true,
        sittingSeatId: seat.id,
        direction: seat.direction,
        currentAction: action,
        dimensionId: currentDimRef.current,
      };

      setUserCharacter(seatedUser);
      saveCharacterToStorage(seatedUser);

      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(
          JSON.stringify({
            type: 'PLAYER_MOVE',
            data: {
              position: seatedUser.position,
              direction: seatedUser.direction,
              isMoving: false,
              isSitting: true,
              sittingSeatId: seat.id,
              currentAction: action,
              dimensionId: currentDimRef.current,
            },
          })
        );
      }
    },
    [saveCharacterToStorage]
  );

  // Update Status
  const handleUpdateStatus = useCallback(
    (status: CharacterStatus) => {
      const curChar = userCharRef.current;
      if (!curChar) return;
      const updated = { ...curChar, status };
      setUserCharacter(updated);
      saveCharacterToStorage(updated);

      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(
          JSON.stringify({
            type: 'PLAYER_STATUS',
            data: { status },
          })
        );
      }
    },
    [saveCharacterToStorage]
  );

  // Dismiss Toast
  const handleDismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Toggle Toast Expand
  const handleToggleExpandToast = useCallback((id: string) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isExpanded: !t.isExpanded } : t))
    );
  }, []);

  // Clear focus coordinate
  const handleClearFocus = useCallback(() => {
    setFocusCoord(null);
  }, []);

  const handleFocusLocation = useCallback((x: number, y: number) => {
    setFocusCoord({ x, y });
  }, []);

  // Confirm Exit
  const handleConfirmExit = useCallback(() => {
    const curChar = userCharRef.current;
    if (curChar) {
      const offlineChar: Character = {
        ...curChar,
        status: 'offline',
        isMoving: false,
      };
      saveCharacterToStorage(offlineChar);
      setUserCharacter(offlineChar);

      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(
          JSON.stringify({
            type: 'PLAYER_STATUS',
            data: { status: 'offline' },
          })
        );
      }
    }
    setShowExitModal(false);
  }, [saveCharacterToStorage]);

  // Trigger interactive in-game events
  const handleTriggerEvent = useCallback(
    (title: string, message: string) => {
      const curChar = userCharRef.current;
      if (!curChar) return;
      const timeStr = new Date().toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
      });

      const isLong = message.length > 50;
      const chatMsg: ChatMessage = {
        id: `event-${Date.now()}`,
        senderId: curChar.id,
        senderName: `${curChar.name} (${title})`,
        senderRole: 'Vũ Trụ Event',
        senderAppearance: curChar.appearance,
        content: message,
        timestamp: timeStr,
        mentions: [],
        isLong,
        dimensionId: currentDimRef.current,
      };
      handleIncomingChatMessage(chatMsg);

      setUserCharacter((prev) =>
        prev ? { ...prev, lastMessage: message, lastMessageTime: timeStr } : null
      );

      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(
          JSON.stringify({
            type: 'NEW_CHAT',
            data: chatMsg,
          })
        );
      }
    },
    [handleIncomingChatMessage]
  );

  const allCharacters = useMemo(() => {
    if (!userCharacter) return colleagues;
    const filteredColleagues = colleagues.filter(
      (c) => c.id !== userCharacter.id && c.name !== userCharacter.name
    );
    return [userCharacter, ...filteredColleagues];
  }, [userCharacter, colleagues]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 font-game">
      {/* 1. VIETNAM CLOCK (Top-Left Corner) */}
      <VietnamClock />

      {/* 2. TOP CENTER MULTIDIMENSIONAL WARP NAV HUD */}
      {userCharacter && (
        <DimensionNavHUD
          currentDimension={currentDimension}
          onSelectDimension={handleTeleport}
          allCharacters={allCharacters}
        />
      )}

      {/* 3. TOP RIGHT HUD ACTIONS */}
      <div className="fixed top-4 right-4 z-40 flex items-center gap-2 pointer-events-auto">
        {userCharacter && (
          <>
            <button
              type="button"
              onClick={() => setIsEditingCharacter(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 shadow-xl text-xs font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer"
              title="Đổi diện mạo, màu tóc, da, trang phục"
            >
              <UserCheck className="w-4 h-4 text-indigo-400" />
              <span className="hidden sm:inline">Tạo Hình Nhân Vật</span>
            </button>

            <button
              type="button"
              onClick={() => setShowExitModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-950/80 hover:bg-rose-900/90 text-rose-200 border border-rose-800/80 shadow-xl text-xs font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer"
              title="Thoát & Lưu vị trí"
            >
              <LogOut className="w-4 h-4 text-rose-400" />
              <span className="hidden sm:inline">Thoát Website</span>
            </button>
          </>
        )}
      </div>

      {/* 4. TOAST NOTIFICATIONS (Top-Right) */}
      <div className="fixed top-16 right-4 z-50">
        <ToastContainer
          toasts={toasts}
          onDismiss={handleDismissToast}
          onToggleExpand={handleToggleExpandToast}
        />
      </div>

      {/* 5. MAIN INTERACTIVE 3D GAME WORLD CANVAS */}
      {userCharacter ? (
        <GameCanvas
          userCharacter={userCharacter}
          allCharacters={allCharacters}
          currentDimension={currentDimension}
          onTeleport={handleTeleport}
          onMoveUser={handleMoveUser}
          onSeatUser={handleSeatUser}
          onTriggerEvent={handleTriggerEvent}
          focusCoord={focusCoord}
          onClearFocus={handleClearFocus}
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950 text-slate-400">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 animate-pulse mb-3">
            <Sparkles className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold">Đang tải vũ trụ không gian đa chiều...</p>
        </div>
      )}

      {/* 6. MINIMAP OVERLAY (Bottom Right) */}
      {userCharacter && (
        <Minimap
          characters={allCharacters}
          userCharacter={userCharacter}
          onFocusLocation={handleFocusLocation}
          viewportCenter={userCharacter.position}
        />
      )}

      {/* 7. CHAT BAR (Bottom Center) */}
      {userCharacter && (
        <ChatBar
          userCharacter={userCharacter}
          allCharacters={allCharacters}
          onSendMessage={handleSendMessage}
          onUpdateStatus={handleUpdateStatus}
        />
      )}

      {/* 8. CHARACTER CREATOR MODAL */}
      {(!userCharacter || isEditingCharacter) && (
        <CharacterCreator
          initialCharacter={userCharacter}
          isEditing={!!userCharacter}
          onCancel={() => setIsEditingCharacter(false)}
          onSave={(savedChar) => {
            const charWithDim = { ...savedChar, dimensionId: currentDimension };
            playerPhysRef.current.x = charWithDim.position.x;
            playerPhysRef.current.y = charWithDim.position.y;
            playerPhysRef.current.targetX = null;
            playerPhysRef.current.targetY = null;
            playerPhysRef.current.isMoving = false;
            setUserCharacter(charWithDim);
            saveCharacterToStorage(charWithDim);
            setIsEditingCharacter(false);

            const timeStr = new Date().toLocaleTimeString('vi-VN', {
              hour: '2-digit',
              minute: '2-digit',
            });
            handleIncomingChatMessage({
              id: `welcome-${Date.now()}`,
              senderId: charWithDim.id,
              senderName: charWithDim.name,
              senderRole: charWithDim.role,
              senderAppearance: charWithDim.appearance,
              content: `Chào mọi người, tôi vừa tạo hình nhân vật và gia nhập Vũ Trụ Đa Chiều! Rất vui được làm quen! 🎉✨`,
              timestamp: timeStr,
              mentions: [],
              isLong: false,
              dimensionId: currentDimension,
            });

            if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
              wsRef.current.send(
                JSON.stringify({
                  type: 'PLAYER_JOIN',
                  data: charWithDim,
                })
              );
            }
          }}
        />
      )}

      {/* 9. EXIT / SAVE MODAL */}
      {showExitModal && userCharacter && (
        <ExitModal
          userCharacter={userCharacter}
          onConfirmExit={handleConfirmExit}
          onCancel={() => setShowExitModal(false)}
        />
      )}
    </div>
  );
}

export default App;
