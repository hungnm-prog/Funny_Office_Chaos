import { useState, useEffect, useRef, useCallback } from 'react';
import type { Character, CharacterStatus, Seat, ToastItem, ChatMessage } from './types/game';
import { INITIAL_COLLEAGUES, OFFICE_RANDOM_CHATS } from './constants/colleagues';
import { VietnamClock } from './components/VietnamClock';
import { CharacterCreator } from './components/CharacterCreator';
import { GameCanvas } from './components/GameCanvas';
import { ChatBar } from './components/ChatBar';
import { Minimap } from './components/Minimap';
import { ToastContainer } from './components/ToastContainer';
import { ExitModal } from './components/ExitModal';
import { LogOut, UserCheck, Sparkles } from 'lucide-react';

const STORAGE_KEY = 'office_game_user_character';

export function App() {
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
              data: userCharacter,
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
          } else if (type === 'PLAYER_JOINED') {
            setColleagues((prev) => {
              if (prev.some((c) => c.id === data.id)) return prev;
              return [...prev, { ...data, isUser: false }];
            });
          } else if (type === 'PLAYER_MOVED') {
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
      // WS not available in dev mode or direct file opening
    }

    return () => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, [handleIncomingChatMessage, userCharacter]);

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
    };
    setUserCharacter(updatedUser);
    saveCharacterToStorage(updatedUser);

    const chatMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: updatedUser.id,
      senderName: updatedUser.name,
      senderRole: updatedUser.role,
      senderAppearance: updatedUser.appearance,
      content,
      timestamp: timeStr,
      mentions,
      isLong: content.length > 50,
    };

    // Trigger Toast Notification
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
              `Đồng ý với @${userCharacter.name}, lát 14h mình thảo luận kỹ hơn ở phòng họp nhé! 👍`,
              `@${userCharacter.name} tag chuẩn ghê, tôi cũng đang chuẩn bị gửi bản báo cáo cho team nè. 🚀`,
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

  // Smooth Movement interpolation loop
  useEffect(() => {
    const updateMovement = () => {
      if (userCharacter?.isMoving && userCharacter.targetPosition) {
        const { x: curX, y: curY } = userCharacter.position;
        const { x: tgtX, y: tgtY } = userCharacter.targetPosition;

        const dx = tgtX - curX;
        const dy = tgtY - curY;
        const dist = Math.hypot(dx, dy);

        const speed = 7.5;

        if (dist <= speed) {
          const arrivedChar: Character = {
            ...userCharacter,
            position: { x: tgtX, y: tgtY },
            targetPosition: undefined,
            isMoving: false,
          };
          setUserCharacter(arrivedChar);
          saveCharacterToStorage(arrivedChar);

          // Notify WS
          if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(
              JSON.stringify({
                type: 'PLAYER_MOVE',
                data: {
                  position: arrivedChar.position,
                  direction: arrivedChar.direction,
                  isMoving: false,
                  isSitting: arrivedChar.isSitting,
                  sittingSeatId: arrivedChar.sittingSeatId,
                  currentAction: arrivedChar.currentAction,
                },
              })
            );
          }
        } else {
          const angle = Math.atan2(dy, dx);
          const nextX = curX + Math.cos(angle) * speed;
          const nextY = curY + Math.sin(angle) * speed;

          let dir: 'left' | 'right' | 'up' | 'down' = 'down';
          if (Math.abs(dx) > Math.abs(dy)) {
            dir = dx > 0 ? 'right' : 'left';
          } else {
            dir = dy > 0 ? 'down' : 'up';
          }

          setUserCharacter((prev) =>
            prev
              ? {
                  ...prev,
                  position: { x: nextX, y: nextY },
                  direction: dir,
                  isMoving: true,
                  isSitting: false,
                  sittingSeatId: undefined,
                }
              : null
          );
        }
      }

      animFrameRef.current = requestAnimationFrame(updateMovement);
    };

    animFrameRef.current = requestAnimationFrame(updateMovement);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [userCharacter, saveCharacterToStorage]);

  // Move user on floor click
  const handleMoveUser = (targetX: number, targetY: number) => {
    if (!userCharacter) return;
    setUserCharacter((prev) =>
      prev
        ? {
            ...prev,
            targetPosition: { x: targetX, y: targetY },
            isMoving: true,
            isSitting: false,
            sittingSeatId: undefined,
            currentAction: 'idle',
          }
        : null
    );
  };

  // Seat user on chair click
  const handleSeatUser = (seat: Seat) => {
    if (!userCharacter) return;

    let action: 'working' | 'eating' | 'watching' | 'cards' | 'gaming' | 'fishing' = 'working';
    if (seat.type === 'dining') action = 'eating';
    else if (seat.type === 'cinema') action = 'watching';
    else if (seat.type === 'card') action = 'cards';
    else if (seat.type === 'gaming') action = 'gaming';
    else if (seat.type === 'fishing') action = 'fishing';

    const seatedUser: Character = {
      ...userCharacter,
      position: { x: seat.x, y: seat.y },
      targetPosition: undefined,
      isMoving: false,
      isSitting: true,
      sittingSeatId: seat.id,
      direction: seat.direction,
      currentAction: action,
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
          },
        })
      );
    }
  };

  // Update Status
  const handleUpdateStatus = (status: CharacterStatus) => {
    if (!userCharacter) return;
    const updated = { ...userCharacter, status };
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
  };

  // Dismiss Toast
  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Toggle Toast Expand
  const handleToggleExpandToast = (id: string) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isExpanded: !t.isExpanded } : t))
    );
  };

  // Confirm Exit
  const handleConfirmExit = () => {
    if (userCharacter) {
      const offlineChar: Character = {
        ...userCharacter,
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
  };

  // Trigger interactive in-game events
  const handleTriggerEvent = (title: string, message: string) => {
    if (!userCharacter) return;
    const timeStr = new Date().toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    });

    const isLong = message.length > 50;
    const chatMsg: ChatMessage = {
      id: `event-${Date.now()}`,
      senderId: userCharacter.id,
      senderName: `${userCharacter.name} (${title})`,
      senderRole: 'Công Sở Event',
      senderAppearance: userCharacter.appearance,
      content: message,
      timestamp: timeStr,
      mentions: [],
      isLong,
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
  };

  const allCharacters = userCharacter ? [userCharacter, ...colleagues] : colleagues;

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 font-game">
      {/* 1. VIETNAM CLOCK (Top-Left Corner) */}
      <VietnamClock />

      {/* 2. TOP RIGHT HUD ACTIONS */}
      <div className="fixed top-4 right-4 z-40 flex items-center gap-2 pointer-events-auto">
        {userCharacter && (
          <>
            <button
              type="button"
              onClick={() => setIsEditingCharacter(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 shadow-xl text-xs font-bold transition-all hover:scale-105 active:scale-95"
              title="Đổi diện mạo, màu tóc, da, trang phục"
            >
              <UserCheck className="w-4 h-4 text-indigo-400" />
              <span className="hidden sm:inline">Tạo Hình Nhân Vật</span>
            </button>

            <button
              type="button"
              onClick={() => setShowExitModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-950/80 hover:bg-rose-900/90 text-rose-200 border border-rose-800/80 shadow-xl text-xs font-bold transition-all hover:scale-105 active:scale-95"
              title="Thoát & Lưu vị trí"
            >
              <LogOut className="w-4 h-4 text-rose-400" />
              <span className="hidden sm:inline">Thoát Website</span>
            </button>
          </>
        )}
      </div>

      {/* 3. TOAST NOTIFICATIONS (Top-Right) */}
      <div className="fixed top-16 right-4 z-50">
        <ToastContainer
          toasts={toasts}
          onDismiss={handleDismissToast}
          onToggleExpand={handleToggleExpandToast}
        />
      </div>

      {/* 4. MAIN INTERACTIVE GAME WORLD CANVAS */}
      {userCharacter ? (
        <GameCanvas
          userCharacter={userCharacter}
          allCharacters={allCharacters}
          onMoveUser={handleMoveUser}
          onSeatUser={handleSeatUser}
          onTriggerEvent={handleTriggerEvent}
          focusCoord={focusCoord}
          onClearFocus={() => setFocusCoord(null)}
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950 text-slate-400">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 animate-pulse mb-3">
            <Sparkles className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold">Đang tải không gian công sở...</p>
        </div>
      )}

      {/* 5. MINIMAP OVERLAY (Bottom Right) */}
      {userCharacter && (
        <Minimap
          characters={allCharacters}
          userCharacter={userCharacter}
          onFocusLocation={(x, y) => setFocusCoord({ x, y })}
          viewportCenter={userCharacter.position}
        />
      )}

      {/* 6. CHAT BAR (Bottom Center) */}
      {userCharacter && (
        <ChatBar
          userCharacter={userCharacter}
          allCharacters={allCharacters}
          onSendMessage={handleSendMessage}
          onUpdateStatus={handleUpdateStatus}
        />
      )}

      {/* 7. CHARACTER CREATOR MODAL */}
      {(!userCharacter || isEditingCharacter) && (
        <CharacterCreator
          initialCharacter={userCharacter}
          isEditing={!!userCharacter}
          onCancel={() => setIsEditingCharacter(false)}
          onSave={(savedChar) => {
            setUserCharacter(savedChar);
            saveCharacterToStorage(savedChar);
            setIsEditingCharacter(false);

            const timeStr = new Date().toLocaleTimeString('vi-VN', {
              hour: '2-digit',
              minute: '2-digit',
            });
            handleIncomingChatMessage({
              id: `welcome-${Date.now()}`,
              senderId: savedChar.id,
              senderName: savedChar.name,
              senderRole: savedChar.role,
              senderAppearance: savedChar.appearance,
              content: `Chào mọi người, tôi vừa tạo hình nhân vật và tham gia công sở! Rất vui được làm quen với mọi người! 🎉✨`,
              timestamp: timeStr,
              mentions: [],
              isLong: false,
            });

            if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
              wsRef.current.send(
                JSON.stringify({
                  type: 'PLAYER_JOIN',
                  data: savedChar,
                })
              );
            }
          }}
        />
      )}

      {/* 8. EXIT / SAVE MODAL */}
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
