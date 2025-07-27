import { Bookmark, Calendar, MessageSquare, User } from "@lucide/svelte";
import { Heart } from "lucide-svelte";

export const getActivityIcon = (type) => {
    switch (type) {
      case 'post': return Heart;
      case 'comment': return MessageSquare;
      case 'save': return Bookmark;
      case 'application': return Calendar;
      default: return User;
    }
  };