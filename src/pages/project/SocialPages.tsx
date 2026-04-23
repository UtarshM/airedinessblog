import { ComingSoonPage } from "./ComingSoonPage";
import { Share2 } from "lucide-react";
export function SocialPostsPage() {
  return <ComingSoonPage title="Social Media Post Creation" icon={Share2} description="Create engaging social media posts across all platforms with AI assistance." features={["AI Post Generation","Multi-platform Support (Instagram, LinkedIn, Twitter, Facebook)","Hashtag Suggestions","Image Prompt Generation"]} />;
}
export function SocialCalendarPage() {
  return <ComingSoonPage title="Post Scheduling Calendar" icon={Share2} description="Schedule and manage your social media posts across all platforms with a visual calendar." features={["Drag-and-drop scheduling","Multi-platform publishing","Best time to post AI recommendations","Team collaboration"]} />;
}
export function SocialReelsPage() {
  return <ComingSoonPage title="Video / Reel Generation" icon={Share2} description="Automatically generate short-form video scripts and reels from your blog content." features={["AI Video Script Generation","Reel Storyboard Creator","Platform-specific formatting (Instagram, TikTok, YouTube Shorts)","Auto-captioning"]} />;
}
