import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card.js';
import { Badge } from '../../components/ui/Badge.js';
import { Button } from '../../components/ui/Button.js';
import { 
  Star, 
  Search, 
  MessageSquare, 
  ThumbsUp, 
  Sparkles, 
  UtensilsCrossed, 
  User, 
  Clock,
  Filter,
  CheckCircle2
} from 'lucide-react';

interface FoodReview {
  id: number;
  studentName: string;
  studentClass: string;
  foodName: string;
  rating: number;
  comment: string;
  sentiment: 'POSITIVE' | 'NEUTRAL' | 'CRITICAL';
  createdAt: string;
  likes: number;
  canteenName: string;
}

export const ReviewsPage: React.FC = () => {
  const [filterRating, setFilterRating] = useState<number | 'ALL'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const reviews: FoodReview[] = [
    {
      id: 1,
      studentName: 'Nguyễn Thành Nam',
      studentClass: 'K16 Khoa CNTT DNU',
      foodName: 'Cơm Rang Dưa Bò Hà Nội',
      rating: 5,
      comment: 'Cơm rang hạt giòn tơi, thịt bò xào mềm thơm và dưa chua rất vừa miệng. Suất ăn 35k đầy đặn no cả buổi chiều học lập trình!',
      sentiment: 'POSITIVE',
      createdAt: 'Hôm nay, 12:15',
      likes: 24,
      canteenName: 'Căng tin Tòa G (Hà Đông)',
    },
    {
      id: 2,
      studentName: 'Lê Khánh Hòa',
      studentClass: 'K17 Khoa Dược DNU',
      foodName: 'Bún Chả Hà Nội Nướng Than',
      rating: 5,
      comment: 'Chả nướng thơm lừng mùi than hoa đặc trưng Hà Nội. Nước chấm đu đủ cà rốt giòn ngọt thanh, bún tươi sạch sẽ!',
      sentiment: 'POSITIVE',
      createdAt: 'Hôm nay, 12:30',
      likes: 18,
      canteenName: 'Căng tin Tòa G (Hà Đông)',
    },
    {
      id: 3,
      studentName: 'Trần Tiến Đạt',
      studentClass: 'K17 Khoa Y Khoa DNU',
      foodName: 'Trà Đào Cam Sả Hà Đông',
      rating: 5,
      comment: 'Trà đào rất thơm mát, đào miếng giòn sần sật. Uống sau giờ thực hành giải nhiệt cực kỳ tốt.',
      sentiment: 'POSITIVE',
      createdAt: 'Hôm qua, 15:20',
      likes: 15,
      canteenName: 'Căng tin DNU Garden & Coffee',
    },
    {
      id: 4,
      studentName: 'Phạm Quỳnh Nga',
      studentClass: 'K18 Quản Trị Kinh Doanh',
      foodName: 'Bánh Mì Chảo Đặc Biệt DNU',
      rating: 4,
      comment: 'Pate rất thơm, trứng lòng đào chuẩn vị. Nếu quán cho thêm một ít sốt cà chua nữa thì sẽ hoàn hảo 10/10.',
      sentiment: 'NEUTRAL',
      createdAt: 'Hôm qua, 08:45',
      likes: 9,
      canteenName: 'Căng tin Tòa A-B DNU',
    },
    {
      id: 5,
      studentName: 'Hoàng Minh Quân',
      studentClass: 'K16 Khoa Truyền Thông',
      foodName: 'Phở Bò Tái Lăn DNU',
      rating: 5,
      comment: 'Bò tái lăn xào tỏi thơm nức mũi, nước dùng ninh xương đậm đà. Ăn kèm 2 chiếc quẩy giòn no căng bụng!',
      sentiment: 'POSITIVE',
      createdAt: '2 ngày trước',
      likes: 31,
      canteenName: 'Căng tin Tòa G (Hà Đông)',
    },
  ];

  const filteredReviews = reviews.filter((r) => {
    const matchRating = filterRating === 'ALL' || r.rating === filterRating;
    const matchSearch =
      r.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.foodName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.comment.toLowerCase().includes(searchTerm.toLowerCase());
    return matchRating && matchSearch;
  });

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground tracking-tight">Đánh Giá & Phản Hồi Món Ăn DNU</h2>
          <p className="text-xs text-muted-foreground">Lắng nghe ý kiến của sinh viên Đại Học Đại Nam để liên tục nâng cao chất lượng ẩm thực học đường</p>
        </div>
      </div>

      {/* Rating Overview KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 bg-amber-500/10 border-amber-500/20">
          <div className="flex items-center gap-3">
            <div className="text-3xl font-extrabold text-amber-600 dark:text-amber-400">4.9★</div>
            <div>
              <div className="flex items-center text-amber-500">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-500" />
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">Điểm trung bình toàn trường (1.420 đánh giá)</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-emerald-500/10 border-emerald-500/20">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground">Tỷ Lệ Hài Lòng</p>
              <p className="text-lg font-bold text-foreground">98.5% Sinh viên DNU yêu thích</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-blue-500/10 border-blue-500/20">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-600 dark:text-blue-400">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground">Món Được Khen Nhiều Nhất</p>
              <p className="text-sm font-bold text-foreground truncate">Cơm Rang Dưa Bò & Bún Chả</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filter Bar */}
      <Card>
        <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo món ăn, sinh viên hoặc bình luận..."
              className="w-full pl-9 pr-3.5 py-2 bg-muted/50 border border-input rounded-lg text-xs focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {['Tất cả', '5 Sao ⭐', '4 Sao ⭐', '3 Sao ⭐'].map((label, idx) => {
              const val = idx === 0 ? 'ALL' : 6 - idx;
              return (
                <button
                  key={label}
                  onClick={() => setFilterRating(val as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                    filterRating === val
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Reviews List */}
      <div className="space-y-3">
        {filteredReviews.map((rev) => (
          <Card key={rev.id} className="hover:border-primary/40 transition-all shadow-xs">
            <CardContent className="p-5 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center">
                    {rev.studentName.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-xs text-foreground">{rev.studentName}</h3>
                      <span className="text-[10px] text-muted-foreground font-mono">({rev.studentClass})</span>
                    </div>
                    <p className="text-[11px] text-primary font-semibold flex items-center gap-1">
                      <UtensilsCrossed className="w-3 h-3" />
                      <span>{rev.foodName}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center text-amber-500">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                    ))}
                  </div>
                  <span className="text-[11px] text-muted-foreground">{rev.createdAt}</span>
                </div>
              </div>

              <p className="text-xs text-foreground leading-relaxed bg-muted/30 p-3 rounded-lg border border-border/50">
                "{rev.comment}"
              </p>

              <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
                <span>Tại: <strong className="text-foreground">{rev.canteenName}</strong></span>
                <span className="flex items-center gap-1 text-primary font-semibold">
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>{rev.likes} sinh viên thấy hữu ích</span>
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
