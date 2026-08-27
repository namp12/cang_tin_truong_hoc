import React, { useState } from 'react';
import { Bot, Sparkles, Send, X, Plus, Check, Flame } from 'lucide-react';
import { dnuStore } from '../../services/dnuStore.js';
import { formatCurrency } from '../../utils/format.js';

interface AiMessage {
  id: number;
  sender: 'AI' | 'USER';
  text: string;
  recommendedFoods?: any[];
}

export const AiFoodAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [addedItem, setAddedItem] = useState<number | null>(null);
  const [selectedPreference, setSelectedPreference] = useState<'NUTRITIOUS' | 'HEALTHY' | 'DRINK' | 'BUDGET'>('NUTRITIOUS');

  const [messages, setMessages] = useState<AiMessage[]>([
    {
      id: 1,
      sender: 'AI',
      text: 'Chào bạn! Mình là Trợ lý Dinh Dưỡng DNU AI. Bạn cần tìm món ăn theo sở thích nào trưa nay (ăn no, thanh mát giải nhiệt, ăn nhanh tiết kiệm)? Mình sẽ tìm những món bán chạy nhất hệ thống cho bạn!',
    },
  ]);

  const preferencesInfo = {
    NUTRITIOUS: { label: '🍚 Ăn No / Năng Lượng', desc: 'Món nhiều đạm, cơm trưa no lâu' },
    HEALTHY: { label: '🥗 Thanh Đạm / Healthy', desc: 'Ít dầu mỡ, nhiều chất xơ, giải nhiệt' },
    DRINK: { label: '🥤 Đồ Uống & Tráng Miệng', desc: 'Trà trái cây, cà phê, nước giải khát' },
    BUDGET: { label: '🥖 Ăn Nhanh / Tiết Kiệm', desc: 'Bữa ăn nhanh gọn dưới 25.000đ' },
  };

  const getAiRecommendations = (pref: 'NUTRITIOUS' | 'HEALTHY' | 'DRINK' | 'BUDGET') => {
    const allFoods = dnuStore.getFoods();
    let filtered = [...allFoods];

    if (pref === 'NUTRITIOUS') {
      filtered = allFoods.filter((f) =>
        f.category === 'Cơm Phần & Cơm Đĩa DNU' ||
        f.name.includes('Cơm') ||
        f.name.includes('Xôi') ||
        f.name.includes('Mỡ') ||
        f.name.includes('Bò')
      );
    } else if (pref === 'HEALTHY') {
      filtered = allFoods.filter((f) =>
        f.name.includes('Phở gà') ||
        f.name.includes('Cháo') ||
        f.name.includes('Rau') ||
        f.name.includes('Salad') ||
        f.name.includes('Suối') ||
        f.name.includes('Táo')
      );
    } else if (pref === 'DRINK') {
      filtered = allFoods.filter((f) =>
        f.category === 'Đồ Uống & Tráng Miệng' ||
        f.name.includes('Trà') ||
        f.name.includes('Cà phê') ||
        f.name.includes('Lon') ||
        f.name.includes('Sữa')
      );
    } else if (pref === 'BUDGET') {
      filtered = allFoods.filter((f) => f.price <= 25000);
    }

    // Sort by soldToday descending to get best-sellers
    return filtered
      .sort((a, b) => (b.soldToday || 0) - (a.soldToday || 0))
      .slice(0, 3);
  };

  const handleAddToCart = (food: any) => {
    dnuStore.addToStudentCart({
      id: food.id,
      name: food.name,
      price: food.price,
      imageUrl: food.imageUrl,
      category: food.category,
    });

    // Fire event to update StudentLayout cart badge
    window.dispatchEvent(new Event('dnu_store_updated'));

    setAddedItem(food.id);
    setTimeout(() => setAddedItem(null), 1200);
  };

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    const userMsg: AiMessage = {
      id: Date.now(),
      sender: 'USER',
      text: text,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt('');
    setIsTyping(true);

    setTimeout(() => {
      let recommendedFoods: any[] = [];
      let replyText = '';

      const query = text.toLowerCase();
      if (query.includes('no') || query.includes('đạm') || query.includes('ăn no') || query.includes('năng lượng') || query.includes('cơm')) {
        recommendedFoods = getAiRecommendations('NUTRITIOUS');
        setSelectedPreference('NUTRITIOUS');
        replyText = 'Dựa trên thống kê đơn hàng bán chạy nhất hôm nay, mình gợi ý cho bạn các món cơm trưa nhiều protein và no lâu này nhé:';
      } else if (query.includes('healthy') || query.includes('thanh đạm') || query.includes('mát') || query.includes('giải nhiệt') || query.includes('rau')) {
        recommendedFoods = getAiRecommendations('HEALTHY');
        setSelectedPreference('HEALTHY');
        replyText = 'Để thanh nhiệt cơ thể và hạn chế dầu mỡ, đây là các món ăn lành mạnh/healthy được sinh viên gọi nhiều nhất hôm nay:';
      } else if (query.includes('uống') || query.includes('nước') || query.includes('trà') || query.includes('giải khát') || query.includes('tráng miệng')) {
        recommendedFoods = getAiRecommendations('DRINK');
        setSelectedPreference('DRINK');
        replyText = 'Danh sách các thức uống lạnh giải khát cực mát đang cháy hàng hôm nay:';
      } else if (query.includes('rẻ') || query.includes('tiết kiệm') || query.includes('bánh mì') || query.includes('20k') || query.includes('25k')) {
        recommendedFoods = getAiRecommendations('BUDGET');
        setSelectedPreference('BUDGET');
        replyText = 'Dưới đây là các món ăn nhanh có mức giá cực sinh viên dưới 25.000đ giúp bạn tiết kiệm tối đa chi phí:';
      } else {
        // Search matching food names from store catalog
        const allFoods = dnuStore.getFoods();
        const matches = allFoods.filter((f) => f.name.toLowerCase().includes(query));
        if (matches.length > 0) {
          recommendedFoods = matches.slice(0, 3);
          replyText = `Mình tìm thấy các món ăn phù hợp với yêu cầu "${text}" của bạn:`;
        } else {
          // Fallback to current selected preference
          recommendedFoods = getAiRecommendations(selectedPreference);
          replyText = `Chào bạn! Mình chưa hiểu rõ lắm, nhưng đây là một số món nổi bật được đề cử theo xu hướng của bạn trưa nay:`;
        }
      }

      const aiResponse: AiMessage = {
        id: Date.now() + 1,
        sender: 'AI',
        text: replyText,
        recommendedFoods,
      };

      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="fixed bottom-20 right-4 z-50">
      {/* Trigger Floating Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-orange-600 via-amber-500 to-emerald-600 text-white font-extrabold text-xs shadow-xl shadow-orange-500/25 hover:scale-105 transition-transform"
        >
          <Bot className="w-4 h-4 animate-bounce" />
          <span>Gợi Ý Món AI</span>
        </button>
      )}

      {/* Chat Window Popup */}
      {isOpen && (
        <div className="w-80 sm:w-96 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[460px] animate-in fade-in zoom-in-95">
          {/* Header */}
          <div className="p-3.5 bg-gradient-to-r from-orange-600 to-amber-600 text-white flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-white/20">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-extrabold text-xs leading-tight">DNU Nutri-Food AI Assistant</h3>
                <p className="text-[9px] text-orange-100 font-medium">Đề xuất món ăn bán chạy & theo sở thích</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-1 text-white/80 hover:text-white rounded-lg">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Chat Messages Area */}
          <div className="flex-1 p-3 overflow-y-auto space-y-3 text-xs bg-slate-50/50">
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.sender === 'USER' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] p-3 rounded-2xl ${m.sender === 'USER'
                      ? 'bg-orange-600 text-white rounded-br-none shadow-xs'
                      : 'bg-white text-foreground rounded-bl-none border border-border/80 shadow-xs'
                    }`}
                >
                  <p className="leading-relaxed font-medium">{m.text}</p>

                  {/* Food Recommendations Cards inside Chat bubble */}
                  {m.recommendedFoods && m.recommendedFoods.length > 0 && (
                    <div className="mt-2.5 space-y-1.5">
                      {m.recommendedFoods.map((f) => (
                        <div key={f.id} className="p-2 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <p className="font-bold text-[11px] text-slate-800 truncate">{f.name}</p>
                            <div className="flex justify-between items-center text-[10px] mt-0.5">
                              <span className="text-orange-600 font-bold font-mono">{formatCurrency(f.price)}</span>
                              {f.soldToday > 0 && (
                                <span className="text-[9px] text-slate-400 font-bold">Đã bán: {f.soldToday}</span>
                              )}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleAddToCart(f)}
                            className={`p-1.5 rounded-lg transition-colors shrink-0 ${addedItem === f.id
                                ? 'bg-emerald-500 text-white'
                                : 'bg-orange-500/10 text-orange-600 hover:bg-orange-500 hover:text-white'
                              }`}
                            title="Thêm vào giỏ hàng"
                          >
                            {addedItem === f.id ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground italic pl-2">
                <Sparkles className="w-3.5 h-3.5 animate-spin text-orange-500" />
                <span>AI đang phân tích sở thích & lấy món bán chạy...</span>
              </div>
            )}
          </div>

          {/* Quick Questions Pills */}
          <div className="px-3 py-1.5 overflow-x-auto no-scrollbar flex items-center gap-1 bg-muted/40 border-t border-border shrink-0">
            {['Hôm nay có món gì bán chạy?', 'Trưa nay ăn gì no lâu dưới 40k?', 'Tìm đồ uống giải khát'].map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(q)}
                className="px-2.5 py-1 rounded-full bg-card border border-border text-[9px] font-bold text-muted-foreground hover:text-foreground whitespace-nowrap hover:border-orange-500 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(inputPrompt);
            }}
            className="p-2.5 bg-card border-t border-border flex items-center gap-2 shrink-0"
          >
            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder="Hỏi AI: Có món nào ăn trưa nhiều đạm?..."
              className="flex-1 px-3 py-1.5 bg-muted/50 border border-input rounded-xl text-xs focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            />
            <button
              type="submit"
              className="p-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl transition-colors shrink-0 shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
