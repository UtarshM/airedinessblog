import { useState } from "react";
import { useProject } from "./ProjectLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { SocialPostEditor } from "@/components/SocialPostEditor";
import { useQuery } from "@tanstack/react-query";
import {
  format, startOfMonth, endOfMonth, eachDayOfInterval,
  isSameDay, isSameMonth, addMonths, subMonths, isToday,
} from "date-fns";
import { ChevronLeft, ChevronRight, Plus, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const STATUS_COLORS: Record<string, string> = {
  draft: "bg-white/10 text-muted-foreground",
  scheduled: "bg-blue-500/80 text-white",
  published: "bg-green-500/80 text-white",
};

export function SocialCalendarPage() {
  const { project } = useProject();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editPost, setEditPost] = useState<any | null>(null);

  const { data: posts = [], refetch } = useQuery({
    queryKey: ["social_posts_calendar", project.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("social_posts" as any)
        .select("*")
        .eq("project_id", project.id)
        .order("scheduled_at", { ascending: true });
      return (data || []) as any[];
    },
  });

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Pad to start on Sunday
  const startPad = monthStart.getDay();
  const paddedDays = Array(startPad).fill(null).concat(days);

  const getPostsForDay = (day: Date) =>
    posts.filter((p: any) => p.scheduled_at && isSameDay(new Date(p.scheduled_at), day));

  const selectedDayPosts = selectedDay ? getPostsForDay(selectedDay) : [];

  const unscheduledPosts = posts.filter((p: any) => !p.scheduled_at && p.status === "draft");

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <h1 className="text-2xl font-bold">Social Calendar</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {posts.filter((p: any) => p.status === "scheduled").length} scheduled ·{" "}
            {posts.filter((p: any) => p.status === "published").length} published ·{" "}
            {unscheduledPosts.length} drafts
          </p>
        </div>
        <Button
          className="bg-gradient-to-r from-[#00f0ff] to-[#7000ff] text-white"
          onClick={() => { setEditPost(null); setEditorOpen(true); }}
        >
          <Plus className="h-4 w-4 mr-2" /> Schedule Post
        </Button>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs">
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-white/20" />Draft</span>
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-blue-500" />Scheduled</span>
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-green-500" />Published</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr,280px] gap-6">
        {/* Calendar */}
        <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
          {/* Month nav */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
            <h2 className="text-lg font-bold">{format(currentDate, "MMMM yyyy")}</h2>
            <div className="flex gap-1">
              <button
                onClick={() => setCurrentDate(subMonths(currentDate, 1))}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => setCurrentDate(new Date())}
                className="px-3 py-1.5 text-xs rounded-lg hover:bg-white/10 transition-colors text-muted-foreground"
              >
                Today
              </button>
              <button
                onClick={() => setCurrentDate(addMonths(currentDate, 1))}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 border-b border-white/10">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d} className="py-2 text-center text-xs font-semibold text-muted-foreground/60 uppercase tracking-wider">
                {d}
              </div>
            ))}
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7">
            {paddedDays.map((day, idx) => {
              if (!day) return <div key={`pad-${idx}`} className="border-b border-r border-white/5 min-h-[100px]" />;
              const dayPosts = getPostsForDay(day);
              const isSelected = selectedDay && isSameDay(day, selectedDay);
              const isCurrentDay = isToday(day);
              const inMonth = isSameMonth(day, currentDate);

              return (
                <div
                  key={day.toISOString()}
                  onClick={() => setSelectedDay(isSelected ? null : day)}
                  className={cn(
                    "border-b border-r border-white/5 min-h-[100px] p-2 cursor-pointer transition-all",
                    isSelected ? "bg-neon-blue/10 border-neon-blue/20" : "hover:bg-white/5",
                    !inMonth && "opacity-30"
                  )}
                >
                  <div className={cn(
                    "text-xs font-semibold w-6 h-6 flex items-center justify-center rounded-full mb-1.5",
                    isCurrentDay ? "bg-[#00f0ff] text-black" : "text-muted-foreground"
                  )}>
                    {format(day, "d")}
                  </div>

                  <div className="space-y-1">
                    {dayPosts.slice(0, 3).map((post: any) => (
                      <div
                        key={post.id}
                        onClick={(e) => { e.stopPropagation(); setEditPost(post); setEditorOpen(true); }}
                        className={cn(
                          "text-[10px] px-1.5 py-0.5 rounded truncate cursor-pointer hover:opacity-80 transition-opacity",
                          STATUS_COLORS[post.status] || "bg-white/10"
                        )}
                      >
                        {post.caption?.substring(0, 25)}...
                      </div>
                    ))}
                    {dayPosts.length > 3 && (
                      <div className="text-[10px] text-muted-foreground pl-1">+{dayPosts.length - 3} more</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sidebar: selected day or unscheduled drafts */}
        <div className="space-y-4">
          {selectedDay ? (
            <div>
              <h3 className="text-sm font-bold mb-3 text-muted-foreground">
                {format(selectedDay, "MMMM d, yyyy")}
              </h3>
              {selectedDayPosts.length === 0 ? (
                <div className="text-center py-8 border border-dashed border-white/10 rounded-xl">
                  <p className="text-xs text-muted-foreground mb-3">No posts on this day</p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-white/10 text-xs"
                    onClick={() => { setEditPost(null); setEditorOpen(true); }}
                  >
                    <Plus className="h-3 w-3 mr-1" /> Add Post
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedDayPosts.map((post: any) => (
                    <PostCard key={post.id} post={post} onEdit={() => { setEditPost(post); setEditorOpen(true); }} />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div>
              <h3 className="text-sm font-bold mb-3 text-muted-foreground">Unscheduled Drafts</h3>
              {unscheduledPosts.length === 0 ? (
                <div className="text-center py-8 border border-dashed border-white/10 rounded-xl">
                  <p className="text-xs text-muted-foreground">No unscheduled drafts</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {unscheduledPosts.map((post: any) => (
                    <PostCard key={post.id} post={post} onEdit={() => { setEditPost(post); setEditorOpen(true); }} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <SocialPostEditor
        open={editorOpen}
        onOpenChange={setEditorOpen}
        projectId={project.id}
        idea={null}
        existingPost={editPost}
        onSaved={refetch}
      />
    </div>
  );
}

function PostCard({ post, onEdit }: { post: any; onEdit: () => void }) {
  return (
    <div
      onClick={onEdit}
      className="p-3 rounded-xl border border-white/10 bg-white/5 cursor-pointer hover:border-white/20 transition-all group"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-white/10 flex items-center justify-center">
          {post.image_url ? (
            <img src={post.image_url} alt="" className="w-full h-full object-cover" />
          ) : (
            <ImageIcon className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium truncate">{post.caption?.substring(0, 50)}...</p>
          <div className="flex items-center gap-2 mt-1">
            <span className={cn(
              "text-[10px] px-1.5 py-0.5 rounded-full",
              STATUS_COLORS[post.status] || "bg-muted/50 text-muted-foreground"
            )}>
              {post.status}
            </span>
            {post.scheduled_at && (
              <span className="text-[10px] text-muted-foreground">
                {format(new Date(post.scheduled_at), "h:mm a")}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
