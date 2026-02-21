import { cn } from "@/lib/utils";

type StatusType =
  | "applied"
  | "under-review"
  | "screening"
  | "shortlisted"
  | "interview"
  | "selected"
  | "rejected"
  | "offer"
  | "onboarding"
  | "active"
  | "inactive";

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

const statusConfig: Record<StatusType, { label: string; className: string }> = {
  applied: {
    label: "Applied",
    className: "bg-info/10 text-info border-info/20",
  },
  "under-review": {
    label: "Under Review",
    className: "bg-warning/10 text-warning border-warning/20",
  },
  screening: {
    label: "Screening",
    className: "bg-warning/10 text-warning border-warning/20",
  },
  shortlisted: {
    label: "Shortlisted",
    className: "bg-primary/10 text-primary border-primary/20",
  },
  interview: {
    label: "Interview",
    className: "bg-accent/10 text-accent border-accent/20",
  },
  selected: {
    label: "Selected",
    className: "bg-success/10 text-success border-success/20",
  },
  rejected: {
    label: "Rejected",
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
  offer: {
    label: "Offer Sent",
    className: "bg-success/10 text-success border-success/20",
  },
  onboarding: {
    label: "Onboarding",
    className: "bg-primary/10 text-primary border-primary/20",
  },
  active: {
    label: "Active",
    className: "bg-success/10 text-success border-success/20",
  },
  inactive: {
    label: "Inactive",
    className: "bg-muted text-muted-foreground border-border",
  },
};

const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
};

export default StatusBadge;
