import React, { useState } from 'react';
import { Bot, Sparkles, Send, X, UtensilsCrossed, Plus, CheckCircle2 } from 'lucide-react';
import { formatCurrency } from '../../utils/format.js';

interface AiMessage {
  id: number;
  sender: 'AI' | 'USER';
  text: string;
  recommendedFoods?: { name: string; price: number; reason: string }[];
}

export const AiFoodAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [addedItem, setAddedItem] = useState<string | null>(null);

  const [messages, setMessages] = useState<AiMessage[]>([
    {
      id: 1,
      sender: 'AI',
      text: 'Chào bạn! Mình là Trợ lý Dinh Dưỡng DNU AI. Bạn có ngân sách bao nhiêu hoặc muốn ăn gì hôm nay (no lâu, giải nhiệt, ăn chay)?',
    },
  ]);

  const quickPrompts = [
    'Hôm nay 35k ăn gì no và nhiều đạm?',
    'Trưa nay nóng 34°C nên ăn & uống gì giải nhiệt?',
    'Gợi ý combo ăn sáng nhanh trước giờ học ca 1',
  ];

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
      let aiResponse: AiMessage;

      if (text.includes('35k') || text.includes('đạm') || text.includes('no')) {
        aiResponse = {
          id: Date.now() + 1,
          sender: 'AI',
          text: 'Với ngân sách 35.000đ, mình khuyên bạn nên chọn **Cơm Rang Dưa Bò Hà Nội** hoặc **Cơm Gà Xối Mỡ Giòn Da** tại Căng tin Tòa G. Món có đầy đủ tinh bột và protein giúp bạn no lâu cho ca thực hành buổi chiều!',
          recommendedFoods: [
            { name: 'Cơm Rang Dưa Bò Hà Nội', price: 35000, reason: 'Nhiều thịt bò mềm, dưa cải giòn rụm' },
            { name: 'Trà Tắc Mật Ong', price: 10000, reason: 'Uống kèm giải khát tuyệt vời' },
          ],
        };
      } else if (text.includes('nóng') || text.includes('giải nhiệt')) {
        aiResponse = {
          id: Date.now() + 1,
          sender: 'AI',
          text: 'Dự báo hôm nay Hà Đông nắng nóng 34°C! Bạn nên chọn món thanh mát như **Bún Chả Nướng Than** kèm một ly **Trà Đào Cam Sả Hà Đông** có nhiều vitamin C nhé!',
          recommendedFoods: [
            { name: 'Bún Chả Hà Nội Nướng Than', price: 35000, reason: 'Nước chấm đu đủ giòn mát' },
            { name: 'Trà Đào Cam Sả Hà Đông', price: 25000, reason: 'Đào miếng giòn ngọt, sả thanh mát' },
          ],
        };
      } else {
        aiResponse = {
          id: Date.now() + 1,
          sender: 'AI',
          text: 'Bữa sáng nhanh trước giờ học ca 1 tại Giảng đường Tòa A-B: Hãy thử ngay **Bánh Mì Chảo Đặc Biệt DNU** hoặc **Phở Bò Tái Lăn** kèm 1 ly **Cà Phê Sữa Đá** để tỉnh táo!',
          recommendedFoods: [
            { name: 'Bánh Mì Chảo Đặc Biệt DNU', price: 30000, reason: '2 trứng lòng đào, pate nóng' },
            { name: 'Cà Phê Sữa Đá Phin', price: 18000, reason: 'Đậm đà năng lượng sáng' },
          ],
        };
      }

      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1200);
  };

  const handleAddToCart = (foodName: string) => {
    setAddedItem(foodName);
    setTimeout(() => setAddedItem(null), 2000);
  };

  return (
    <div className="fixed bottom-20 right-4 z-50">
      {/* Trigger Floating Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-gradient-to-r from-orange-600 via-amber-500 to-emerald-600 text-white font-bold text-xs shadow-xl shadow-orange-500/25 hover:scale-105 transition-transform"
        >
          <Bot className="w-4 h-4 animate-bounce" />
          <span>Gợi Ý Món AI</span>
        </button>
      )}

      {/* Chat Window Popup */}
      {isOpen && (
        <div className="w-80 sm:w-96 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[460px] animate-in fade-in zoom-in-95">
          {/* Header */}
          <div className="p-3.5 bg-gradient-to-r from-orange-600 to-amber-600 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-xl bg-white/20">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-extrabold text-xs leading-tight">DNU Nutri-Food AI</h3>
                <p className="text-[10px] text-orange-100">Trợ lý dinh dưỡng & chọn món thông minh</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-1 text-white/80 hover:text-white rounded-lg">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-3 overflow-y-auto space-y-3 text-xs">
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.sender === 'USER' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] p-3 rounded-2xl ${
                    m.sender === 'USER'
                      ? 'bg-primary text-primary-foreground rounded-br-none'
                      : 'bg-muted/70 text-foreground rounded-bl-none border border-border/60'
                  }`}
                >
                  <p className="leading-relaxed">{m.text}</p>

                  {/* Food Recommendations Cards */}
                  {m.recommendedFoods && (
                    <div className="mt-2.5 space-y-1.5">
                      {m.recommendedFoods.map((f) => (
                        <div key={f.name} className="p-2 rounded-xl bg-card border border-border flex items-center justify-between gap-2">
                          <div>
                            <p className="font-bold text-[11px] text-foreground">{f.name}</p>
                            <p className="text-[10px] text-orange-600 font-bold">{formatCurrency(f.price)}</p>
                            <p className="text-[9px] text-muted-foreground">{f.reason}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleAddToCart(f.name)}
                            className="p-1.5 rounded-lg bg-orange-500/10 text-orange-600 hover:bg-orange-500 hover:text-white transition-colors shrink-0"
                            title="Thêm vào giỏ"
                          >
                            {addedItem === f.name ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Plus className="w-4 h-4" />}
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
                <span>AI đang tìm món ngon cho bạn...</span>
              </div>
            )}
          </div>

          {/* Quick Questions Pills */}
          <div className="px-3 py-1.5 overflow-x-auto no-scrollbar flex items-center gap-1 bg-muted/40 border-t border-border">
            {quickPrompts.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(q)}
                className="px-2.5 py-1 rounded-full bg-card border border-border text-[10px] text-muted-foreground hover:text-foreground whitespace-nowrap hover:border-primary transition-colors"
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
            className="p-2.5 bg-card border-t border-border flex items-center gap-2"
          >
            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder="Hỏi AI: Có món nào ăn trưa dưới 40k?..."
              className="flex-1 px-3 py-1.5 bg-muted/50 border border-input rounded-xl text-xs focus:ring-2 focus:ring-ring"
            />
            <button
              type="submit"
              className="p-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl transition-colors shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
