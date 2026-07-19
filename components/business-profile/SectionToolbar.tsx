// components/business-profile/SectionToolbar.tsx
"use client";

import { useState } from "react";
import {
  Edit,
  Eye,
  EyeOff,
  GripVertical,
  MoreHorizontal,
  Settings,
  Plus,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface SectionToolbarProps {
  title: string;
  isOwner: boolean;
  isHidden?: boolean;
  isFirst?: boolean;
  isLast?: boolean;
  onEdit?: () => void;
  onHide?: () => void;
  onPreview?: () => void;
  onReorder?: () => void;
  onSettings?: () => void;
  onAdd?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  className?: string;
  children?: React.ReactNode;
}

export default function SectionToolbar({
  title,
  isOwner,
  isHidden = false,
  isFirst = false,
  isLast = false,
  onEdit,
  onHide,
  onPreview,
  onReorder,
  onSettings,
  onAdd,
  onMoveUp,
  onMoveDown,
  className,
  children,
}: SectionToolbarProps) {
  const [isHovered, setIsHovered] = useState(false);

  if (!isOwner) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-2 py-1 px-2 -mx-2 rounded-lg transition-colors",
        isHovered ? "bg-background-elevated/20" : "bg-transparent",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span className="text-sm font-medium text-muted/60">{title}</span>

      <div className="flex items-center gap-0.5">
        {/* Reorder buttons - Up and Down */}
        {onMoveUp && (
          <button
            onClick={onMoveUp}
            disabled={isFirst}
            className={cn(
              "h-7 w-7 p-0 rounded-md transition",
              isFirst
                ? "text-muted/20 cursor-not-allowed"
                : "text-muted/40 hover:text-foreground hover:bg-background-elevated/30"
            )}
            title="Move section up"
          >
            <ChevronUp className="h-3.5 w-3.5" />
          </button>
        )}

        {onMoveDown && (
          <button
            onClick={onMoveDown}
            disabled={isLast}
            className={cn(
              "h-7 w-7 p-0 rounded-md transition",
              isLast
                ? "text-muted/20 cursor-not-allowed"
                : "text-muted/40 hover:text-foreground hover:bg-background-elevated/30"
            )}
            title="Move section down"
          >
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
        )}

        {children}

        {onAdd && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 text-muted/40 hover:text-foreground"
            onClick={onAdd}
          >
            <Plus className="h-3.5 w-3.5" />
          </Button>
        )}

        {onEdit && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 text-muted/40 hover:text-foreground"
            onClick={onEdit}
          >
            <Edit className="h-3.5 w-3.5" />
          </Button>
        )}

        {onHide && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 text-muted/40 hover:text-foreground"
            onClick={onHide}
          >
            {isHidden ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
          </Button>
        )}

        {(onPreview || onReorder || onSettings) && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 text-muted/40 hover:text-foreground"
              >
                <MoreHorizontal className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              {onPreview && (
                <DropdownMenuItem onClick={onPreview}>
                  <Eye className="mr-2 h-4 w-4" />
                  Preview
                </DropdownMenuItem>
              )}
              {onReorder && (
                <DropdownMenuItem onClick={onReorder}>
                  <GripVertical className="mr-2 h-4 w-4" />
                  Reorder
                </DropdownMenuItem>
              )}
              {onSettings && (
                <DropdownMenuItem onClick={onSettings}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
}