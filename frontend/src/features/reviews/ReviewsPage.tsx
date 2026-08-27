import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card.js';
import { Badge } from '../../components/ui/Badge.js';
import { Button } from '../../components/ui/Button.js';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../components/ui/dialog.js';
import { dnuStore, DishReview, ReviewReply } from '../../services/dnuStore.js';
import { orderStorage } from '../../services/orderStorage.js';
import { useAuth } from '../../contexts/AuthContext.js';
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
  Store,
  Trash2,
  Reply,
  Send,
  ShieldCheck,
  MessageCircle,
  AlertTriangle
} from 'lucide-react';

export const ReviewsPage: React.FC = () => {
  const { user, isStudent, hasRole } = useAuth();
  const isAdminOrManager = !isStudent && (hasRole('SUPER_ADMIN') || hasRole('ADMIN') || hasRole('CANTEEN_MANAGER'));

  const [reviews, setReviews] = useState<DishReview[]>(() => dnuStore.getReviews());
  const [stats, setStats] = useState(() => dnuStore.getReviewStats());
  const [filterRating, setFilterRating] = useState<number | 'ALL'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Student Ordered Dishes
  const orderedFoods = orderStorage.getStudentOrderedFoods(user?.fullName, user?.username);

  // Student Add Review Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [foods] = useState(() => dnuStore.getFoods());
  const [newReview, setNewReview] = useState({
    studentName: user?.fullName || 'Nguyễn Thành Nam',
    studentClass: isStudent ? (user?.username || 'K16 Khoa CNTT DNU') : 'K16 Khoa CNTT DNU',
    foodName: orderedFoods[0]?.foodName || 'Cơm Rang Dưa Bò Hà Nội',
    rating: 5,
    comment: '',
    sentiment: 'POSITIVE' as const,
    canteenName: 'Căng tin Tòa G (Hà Đông)',
  });

  // Admin Reply Modal
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [selectedReviewForReply, setSelectedReviewForReply] = useState<DishReview | null>(null);
  const [adminReplyText, setAdminReplyText] = useState('');

  // Student Inline Comment Form State
  const [activeCommentReviewId, setActiveCommentReviewId] = useState<number | null>(null);
  const [inlineCommentText, setInlineCommentText] = useState('');

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

  const handleOpenAddModal = () => {
    setNewReview({
      studentName: user?.fullName || 'Nguyễn Thành Nam',
      studentClass: isStudent ? (user?.username || 'K16 Khoa CNTT DNU') : 'K16 Khoa CNTT DNU',
      foodName: foods[0]?.name || 'Cơm Gà Xối Mỡ Giòn Da',
      rating: 5,
      comment: '',
      sentiment: 'POSITIVE' as const,
      canteenName: 'Căng tin Tòa G (Hà Đông)',
    });
    setShowAddModal(true);
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

    setActionSuccess(`Cảm ơn bạn! Đánh giá món "${newReview.foodName}" đã được gửi thành công!`);
    setShowAddModal(false);
    setNewReview({
      ...newReview,
      comment: '',
      rating: 5,
    });
    setTimeout(() => setActionSuccess(null), 3000);
  };

  // Admin Delete Review
  const handleDeleteReview = (id: number, foodName: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa bài đánh giá món "${foodName}" này không?`)) {
      dnuStore.deleteReview(id);
      setActionSuccess(`Đã xóa thành công bài đánh giá món "${foodName}".`);
      setTimeout(() => setActionSuccess(null), 3000);
    }
  };

  // Admin Reply Submission
  const handleSubmitAdminReply = () => {
    if (!selectedReviewForReply || !adminReplyText.trim()) return;

    dnuStore.replyReview(selectedReviewForReply.id, {
      replierName: 'Căng tin Đại Nam',
      content: adminReplyText.trim(),
    });

    setShowReplyModal(false);
    setAdminReplyText('');
    setSelectedReviewForReply(null);
    setActionSuccess(`Đã gửi phản hồi từ Căng tin Đại Nam tới sinh viên ${selectedReviewForReply.studentName}!`);
    setTimeout(() => setActionSuccess(null), 3000);
  };

  // Student / User Inline Comment Submission
  const handleSendInlineComment = (reviewId: number) => {
    if (!inlineCommentText.trim()) return;

    dnuStore.addReplyToReview(reviewId, {
      authorName: isStudent ? (user?.fullName || 'Sinh viên DNU') : 'Căng tin Đại Nam',
      authorRole: isStudent ? 'STUDENT' : 'ADMIN',
      authorClass: isStudent ? (user?.username || 'SV DNU') : 'Ban Quản Lý Căng Tin',
      content: inlineCommentText.trim(),
    });

    setInlineCommentText('');
    setActiveCommentReviewId(null);
    setActionSuccess('Bình luận của bạn đã được đăng thành công!');
    setTimeout(() => setActionSuccess(null), 2500);
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
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center justify-between animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{actionSuccess}</span>
          </div>
          <button onClick={() => setActionSuccess(null)} className="text-emerald-700 font-bold hover:underline">
            ✕
          </button>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-foreground tracking-tight">
              {isStudent ? '⭐ Đánh Giá & Cảm Nhận Món Ăn' : 'Quản Lý & Kiểm Duyệt Đánh Giá Sinh Viên'}
            </h2>
            <Badge variant="primary" className="bg-amber-600 text-white font-mono text-[10px]">
              {reviews.length} REVIEW
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            {isStudent
              ? 'Sinh viên DNU cùng thảo luận, chia sẻ cảm nhận và đánh giá chất lượng món ăn căng tin'
              : 'Ban Quản Lý theo dõi phản hồi, trả lời thắc mắc và kiểm duyệt đánh giá từ sinh viên'}
          </p>
        </div>

        {/* Only STUDENTS can create new dish reviews */}
        {isStudent && (
          <Button
            onClick={handleOpenAddModal}
            variant="default"
            size="sm"
            className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs"
            leftIcon={<Plus className="w-4 h-4" />}
          >
            + Viết Đánh Giá Món Ăn
          </Button>
        )}

        {isAdminOrManager && (
          <Badge variant="primary" className="bg-slate-800 text-amber-300 text-xs py-1.5 px-3 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Quyền Quản Trị & Kiểm Duyệt</span>
          </Badge>
        )}
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
                Điểm trung bình ({stats.total} đánh giá từ sinh viên)
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
                {foods[0]?.name || 'Cơm Gà Xối Mỡ Giòn Da'}
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
              placeholder="Tìm theo món ăn, tên sinh viên hoặc nội dung..."
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
      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <Card className="p-8 text-center text-muted-foreground text-xs">
            Chưa có đánh giá nào phù hợp với bộ lọc tìm kiếm.
          </Card>
        ) : (
          filteredReviews.map((rev) => (
            <Card key={rev.id} className="hover:border-amber-500/40 transition-all shadow-xs overflow-hidden">
              <CardContent className="p-5 space-y-3.5">
                {/* Header of review */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white font-bold text-sm flex items-center justify-center shadow-xs">
                      {rev.studentName.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-xs text-foreground">{rev.studentName}</h3>
                        <span className="text-[10px] text-muted-foreground font-mono">({rev.studentClass})</span>
                      </div>
                      <p className="text-[11px] text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1">
                        <UtensilsCrossed className="w-3.5 h-3.5" />
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

                {/* Review Body */}
                <p className="text-xs text-foreground leading-relaxed bg-muted/30 p-3 rounded-xl border border-border/50">
                  "{rev.comment}"
                </p>

                {/* Official Admin Reply Box (If exists) */}
                {rev.adminReply && (
                  <div className="p-3 bg-amber-500/10 border-l-4 border-amber-500 rounded-r-xl space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-bold text-amber-900 dark:text-amber-300">
                        <ShieldCheck className="w-4 h-4 text-amber-600" />
                        <span>Phản Hồi Từ {rev.adminReply.replierName || 'Căng tin Đại Nam'}:</span>
                      </div>
                      <span className="text-[10px] text-muted-foreground font-mono">{rev.adminReply.repliedAt}</span>
                    </div>
                    <p className="text-foreground/90 pl-5">{rev.adminReply.content}</p>
                  </div>
                )}

                {/* Other Students' Replies / Comments */}
                {rev.replies && rev.replies.length > 0 && (
                  <div className="space-y-2 pl-3 border-l-2 border-slate-200 dark:border-slate-800">
                    {rev.replies.map((reply) => (
                      <div key={reply.id} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-border/40 text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-foreground">
                            {reply.authorName} <span className="text-[10px] text-muted-foreground font-normal">({reply.authorClass})</span>
                          </span>
                          <span className="text-[10px] text-muted-foreground font-mono">{reply.createdAt}</span>
                        </div>
                        <p className="text-foreground/90 text-[11px]">{reply.content}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Inline Comment Input (When open) */}
                {activeCommentReviewId === rev.id && (
                  <div className="p-3 bg-muted/40 rounded-xl border border-border space-y-2 animate-in fade-in">
                    <label className="block text-[11px] font-bold text-foreground">
                      Bình luận / Xác nhận cảm nhận của bạn:
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={inlineCommentText}
                        onChange={(e) => setInlineCommentText(e.target.value)}
                        placeholder="Ví dụ: Mình cũng ăn món này rồi, rất ngon và nóng sốt..."
                        className="flex-1 px-3 py-1.5 bg-background border border-input rounded-lg text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSendInlineComment(rev.id);
                        }}
                      />
                      <Button
                        onClick={() => handleSendInlineComment(rev.id)}
                        variant="default"
                        size="sm"
                        className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs"
                      >
                        <Send className="w-3.5 h-3.5 mr-1" />
                        Gửi
                      </Button>
                      <Button
                        onClick={() => {
                          setActiveCommentReviewId(null);
                          setInlineCommentText('');
                        }}
                        variant="outline"
                        size="sm"
                        className="text-xs"
                      >
                        Hủy
                      </Button>
                    </div>
                  </div>
                )}

                {/* Card Action Footer */}
                <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t border-border/40">
                  <span className="truncate max-w-[200px]">Tại: <strong className="text-foreground">{rev.canteenName}</strong></span>

                  <div className="flex items-center gap-2">
                    {/* Like / Agree Button */}
                    <button
                      type="button"
                      onClick={() => handleLike(rev.id)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-muted/60 hover:bg-amber-500/10 hover:text-amber-600 transition-colors font-semibold"
                    >
                      <ThumbsUp className="w-3.5 h-3.5 text-amber-600" />
                      <span>{rev.likes} Hữu ích</span>
                    </button>

                    {/* Student Comment / Confirm Button */}
                    <button
                      type="button"
                      onClick={() => {
                        setActiveCommentReviewId(activeCommentReviewId === rev.id ? null : rev.id);
                        setInlineCommentText('');
                      }}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-muted/60 hover:bg-blue-500/10 hover:text-blue-600 transition-colors font-semibold"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-blue-600" />
                      <span>{rev.replies?.length || 0} Bình luận</span>
                    </button>

                    {/* Admin Actions: Reply & Delete */}
                    {isAdminOrManager && (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedReviewForReply(rev);
                            setAdminReplyText(rev.adminReply?.content || '');
                            setShowReplyModal(true);
                          }}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-400 hover:bg-amber-500/20 font-bold transition-colors"
                          title="Trả lời chính thức từ Ban Quản Lý"
                        >
                          <Reply className="w-3.5 h-3.5" />
                          <span>Trả Lời</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteReview(rev.id, rev.foodName)}
                          className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-500/10 rounded-lg transition-colors"
                          title="Xóa đánh giá này (Quyền Admin)"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* ========================================================= */}
      {/* MODAL 1: VIẾT ĐÁNH GIÁ MÓN ĂN (CHỈ DÀNH CHO SINH VIÊN)     */}
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

          {orderedFoods.length === 0 ? (
            <div className="py-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 mx-auto flex items-center justify-center">
                <UtensilsCrossed className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-foreground">Bạn Cần Đặt Món Trước Khi Đánh Giá</h4>
              <p className="text-xs text-muted-foreground px-4">
                Nhằm đảm bảo tính xác thực và khách quan, hệ thống chỉ cho phép bạn đánh giá các món ăn mà bạn đã đặt và nhận món thành công tại Căng tin DNU.
              </p>
              <div className="pt-2">
                <Button
                  onClick={() => {
                    setShowAddModal(false);
                    window.location.href = '/student/home';
                  }}
                  variant="default"
                  className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs"
                >
                  Khám Phá Thực Đơn & Đặt Món
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleCreateReview} className="space-y-3.5 py-2 text-xs">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-foreground">Món ăn bạn đã đặt & dùng bữa *</label>
                  <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Xác thực đơn hàng DNU</span>
                  </span>
                </div>
                <select
                  value={newReview.foodName}
                  onChange={(e) => setNewReview({ ...newReview, foodName: e.target.value })}
                  className="w-full px-3 py-2 bg-muted/40 border border-input rounded-lg font-bold text-foreground"
                >
                  {orderedFoods.map((f, idx) => (
                    <option key={idx} value={f.foodName}>
                      {f.foodName} (Mã đơn: {f.orderCode})
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
                  <span className="ml-auto font-mono font-bold text-amber-600 text-sm">
                    {newReview.rating} / 5 Sao
                  </span>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-foreground mb-1">Cảm nhận chi tiết của bạn *</label>
                <textarea
                  rows={3}
                  required
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  placeholder="Món ăn vừa miệng, thịt thơm giòn, cơm dẻo, phục vụ nhiệt tình..."
                  className="w-full px-3 py-2 bg-muted/40 border border-input rounded-lg resize-none"
                />
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
          )}
        </DialogContent>
      </Dialog>

      {/* ========================================================= */}
      {/* MODAL 2: TRẢ LỜI ĐÁNH GIÁ (DÀNH CHO ADMIN / QUẢN LÝ)       */}
      {/* ========================================================= */}
      <Dialog open={showReplyModal} onOpenChange={setShowReplyModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-foreground">
              <span className="p-2 rounded-xl bg-amber-500/15 text-amber-600">
                <Reply className="w-5 h-5 text-amber-600" />
              </span>
              <span>Căng Tin Đại Nam Phản Hồi Sinh Viên</span>
            </DialogTitle>
            <DialogDescription>
              Gửi phản hồi chính thức từ Căng Tin Đại Nam tới sinh viên {selectedReviewForReply?.studentName}
            </DialogDescription>
          </DialogHeader>

          {selectedReviewForReply && (
            <div className="space-y-3.5 py-2 text-xs">
              <div className="p-3 bg-muted/50 rounded-xl border border-border space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-foreground">{selectedReviewForReply.studentName}</span>
                  <span className="text-amber-500 font-bold">{selectedReviewForReply.rating}★</span>
                </div>
                <p className="text-muted-foreground text-[11px]">"{selectedReviewForReply.comment}"</p>
              </div>

              <div>
                <label className="block font-semibold text-foreground mb-1">
                  Nội dung phản hồi của Ban Quản Lý *
                </label>
                <textarea
                  rows={4}
                  required
                  value={adminReplyText}
                  onChange={(e) => setAdminReplyText(e.target.value)}
                  placeholder="Căng tin DNU trân trọng cảm ơn bạn đã góp ý. Nhà bếp sẽ kiểm tra và điều chỉnh hương vị ngay trong ca ăn tới..."
                  className="w-full px-3 py-2 bg-muted/40 border border-input rounded-lg resize-none"
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShowReplyModal(false)}>
                  Hủy
                </Button>
                <Button
                  type="button"
                  onClick={handleSubmitAdminReply}
                  variant="default"
                  className="bg-amber-600 hover:bg-amber-700 text-white font-bold"
                >
                  Gửi Phản Hồi Chính Thức
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
