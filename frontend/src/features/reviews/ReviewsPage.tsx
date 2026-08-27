import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card.js';
import { Badge } from '../../components/ui/Badge.js';
import { Button } from '../../components/ui/Button.js';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../components/ui/dialog.js';
import { dnuStore, DishReview } from '../../services/dnuStore.js';
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
  CheckCircle2,
  Plus,
  Heart,
  Store
} from 'lucide-react';

export const ReviewsPage: React.FC = () => {
  const [reviews, setReviews] = useState<DishReview[]>(() => dnuStore.getReviews());
  const [stats, setStats] = useState(() => dnuStore.getReviewStats());
  const [filterRating, setFilterRating] = useState<number | 'ALL'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const [showAddModal, setShowAddModal] = useState(false);
  const [foods] = useState(() => dnuStore.getFoods());
  const [newReview, setNewReview] = useState({
    studentName: 'Nguyễn Thành Nam',
    studentClass: 'K16 Khoa CNTT DNU',
    foodName: foods[0]?.name || 'Cơm Gà Xối Mỡ Giòn Da',
    rating: 5,
    comment: '',
    sentiment: 'POSITIVE' as const,
    canteenName: 'Căng tin Tòa G (Hà Đông)',
  });
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Sync with dnuStore
  useEffect(() => {
    const handleSync = () => {
      setReviews(dnuStore.getReviews());
      setStats(dnuStore.getReviewStats());
    };
    window.addEventListener('dnu_store_updated', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('dnu_store_updated', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  const handleLike = (id: number) => {
    dnuStore.likeReview(id);
  };

  const handleCreateReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.comment.trim()) return;

    dnuStore.addReview({
      studentName: newReview.studentName,
      studentClass: newReview.studentClass,
      foodName: newReview.foodName,
      rating: newReview.rating,
      comment: newReview.comment,
      sentiment: newReview.rating >= 4 ? 'POSITIVE' : newReview.rating === 3 ? 'NEUTRAL' : 'CRITICAL',
      canteenName: newReview.canteenName,
    });

    setActionSuccess(`Cảm ơn bạn! Đánh giá món "${newReview.foodName}" đã được lưu thành công!`);
    setShowAddModal(false);
    setNewReview({
      ...newReview,
      comment: '',
      rating: 5,
    });
    setTimeout(() => setActionSuccess(null), 3000);
  };

  const filteredReviews = reviews.filter((r) => {
    const matchRating = filterRating === 'ALL' || r.rating === filterRating;
    const matchSearch =
      r.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.foodName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.studentClass.toLowerCase().includes(searchTerm.toLowerCase());
    return matchRating && matchSearch;
  });

  return (
    <div className="space-y-5">
      {/* Toast Alert */}
      {actionSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 flex items-center justify-between shadow-xs animate-in slide-in-from-top-2">
          <div className="flex items-center gap-2 text-xs font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{actionSuccess}</span>
          </div>
          <button onClick={() => setActionSuccess(null)} className="text-xs font-semibold opacity-70 hover:opacity-100">
            ✕ Đóng
          </button>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-foreground tracking-tight">Đánh Giá & Phản Hồi Món Ăn DNU</h2>
            <Badge variant="primary" className="bg-amber-600 text-white font-mono text-[10px]">
              {reviews.length} REVIEW
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Lắng nghe ý kiến của sinh viên Đại Học Đại Nam để liên tục nâng cao chất lượng ẩm thực học đường
          </p>
        </div>

        <Button
          onClick={() => setShowAddModal(true)}
          variant="default"
          size="sm"
          className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs"
          leftIcon={<Plus className="w-4 h-4" />}
        >
          + Viết Đánh Giá Món Ăn
        </Button>
      </div>

      {/* Rating Overview KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 bg-amber-500/10 border-amber-500/20">
          <div className="flex items-center gap-3">
            <div className="text-3xl font-black text-amber-600 dark:text-amber-400 font-mono">
              {stats.avgRating}★
            </div>
            <div>
              <div className="flex items-center text-amber-500">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i <= Math.round(stats.avgRating) ? 'fill-amber-500' : 'text-amber-500/30'}`}
                  />
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Điểm trung bình ({stats.total} lượt đánh giá thực tế)
              </p>
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
              <p className="text-lg font-bold text-foreground">
                {stats.satisfactionRate}% Sinh viên DNU đánh giá tốt
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-blue-500/10 border-blue-500/20">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-600 dark:text-blue-400">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground">Món Được Yêu Thích Nhất</p>
              <p className="text-sm font-bold text-foreground truncate">
                {foods[0]?.name || 'Cơm Rang Dưa Bò Hà Nội'}
              </p>
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
              className="w-full pl-9 pr-3.5 py-2 bg-muted/50 border border-input rounded-xl text-xs focus:ring-2 focus:ring-ring text-foreground"
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
                      ? 'bg-amber-600 text-white font-bold'
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
        {filteredReviews.length === 0 ? (
          <Card className="p-8 text-center text-muted-foreground text-xs">
            Chưa có đánh giá nào phù hợp với bộ lọc tìm kiếm.
          </Card>
        ) : (
          filteredReviews.map((rev) => (
            <Card key={rev.id} className="hover:border-amber-500/40 transition-all shadow-xs">
              <CardContent className="p-5 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 font-bold text-sm flex items-center justify-center">
                      {rev.studentName.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-xs text-foreground">{rev.studentName}</h3>
                        <span className="text-[10px] text-muted-foreground font-mono">({rev.studentClass})</span>
                      </div>
                      <p className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1">
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
                    <span className="text-[11px] text-muted-foreground font-mono">{rev.createdAt}</span>
                  </div>
                </div>

                <p className="text-xs text-foreground leading-relaxed bg-muted/30 p-3 rounded-xl border border-border/50">
                  "{rev.comment}"
                </p>

                <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
                  <span>Tại: <strong className="text-foreground">{rev.canteenName}</strong></span>
                  <button
                    type="button"
                    onClick={() => handleLike(rev.id)}
                    className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-muted/60 hover:bg-amber-500/10 hover:text-amber-600 transition-colors font-medium"
                  >
                    <ThumbsUp className="w-3.5 h-3.5 text-amber-600" />
                    <span>{rev.likes} Hữu ích</span>
                  </button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* ========================================================= */}
      {/* MODAL: VIẾT ĐÁNH GIÁ MÓN ĂN                              */}
      {/* ========================================================= */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-foreground">
              <span className="p-2 rounded-xl bg-amber-500/15 text-amber-600">
                <Star className="w-5 h-5 fill-amber-500" />
              </span>
              <span>Viết Đánh Giá & Góp Ý Món Ăn</span>
            </DialogTitle>
            <DialogDescription>
              Chia sẻ cảm nhận chân thật về món ăn để căng tin phục vụ bạn ngày càng tốt hơn
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateReview} className="space-y-3.5 py-2 text-xs">
            <div>
              <label className="block font-semibold text-foreground mb-1">Món ăn bạn muốn đánh giá *</label>
              <select
                value={newReview.foodName}
                onChange={(e) => setNewReview({ ...newReview, foodName: e.target.value })}
                className="w-full px-3 py-2 bg-muted/40 border border-input rounded-lg"
              >
                {foods.map((f) => (
                  <option key={f.id} value={f.name}>
                    {f.name} ({f.category})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-foreground mb-1">Số sao đánh giá (Rating) *</label>
              <div className="flex items-center gap-2 p-2 bg-muted/40 rounded-lg border border-input">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewReview({ ...newReview, rating: star })}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= newReview.rating
                          ? 'fill-amber-500 text-amber-500'
                          : 'text-muted-foreground/30'
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-2 font-bold text-amber-600">
                  {newReview.rating === 5 ? 'Tuyệt hảo (5/5)' : newReview.rating === 4 ? 'Rất ngon (4/5)' : newReview.rating === 3 ? 'Bình thường (3/5)' : 'Cần cải thiện'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-foreground mb-1">Tên sinh viên / người đánh giá</label>
                <input
                  type="text"
                  required
                  value={newReview.studentName}
                  onChange={(e) => setNewReview({ ...newReview, studentName: e.target.value })}
                  className="w-full px-3 py-2 bg-muted/40 border border-input rounded-lg font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-foreground mb-1">Khóa & Lớp học</label>
                <input
                  type="text"
                  required
                  value={newReview.studentClass}
                  onChange={(e) => setNewReview({ ...newReview, studentClass: e.target.value })}
                  className="w-full px-3 py-2 bg-muted/40 border border-input rounded-lg font-mono text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-foreground mb-1">Nhận xét chi tiết *</label>
              <textarea
                required
                rows={3}
                placeholder="VD: Cơm rang dưa bò thơm giòn, thịt bò mềm và dưa vừa ăn. Rất ngon miệng!"
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                className="w-full px-3 py-2 bg-muted/40 border border-input rounded-lg"
              />
            </div>

            <div>
              <label className="block font-semibold text-foreground mb-1">Cơ sở căng tin</label>
              <select
                value={newReview.canteenName}
                onChange={(e) => setNewReview({ ...newReview, canteenName: e.target.value })}
                className="w-full px-3 py-2 bg-muted/40 border border-input rounded-lg"
              >
                <option value="Căng tin Tòa G (Hà Đông)">Căng tin Tòa G (Hà Đông)</option>
                <option value="Căng tin Tòa A-B DNU">Căng tin Tòa A-B DNU</option>
                <option value="Căng tin DNU Garden & Coffee">Căng tin DNU Garden & Coffee</option>
              </select>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowAddModal(false)}>
                Hủy
              </Button>
              <Button type="submit" variant="default" className="bg-amber-600 hover:bg-amber-700 text-white font-bold">
                Gửi Đánh Giá Ngay
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
