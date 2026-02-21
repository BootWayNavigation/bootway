import { Check, Circle, X } from "lucide-react";
import { cn } from "@/lib/utils";

type StepStatus = "completed" | "current" | "upcoming" | "rejected";

interface Step {
  id: string;
  label: string;
  status: StepStatus;
}

interface PipelineStepperProps {
  currentStep: string;
  isRejected?: boolean;
  className?: string;
}

const PipelineStepper = ({ currentStep, isRejected = false, className }: PipelineStepperProps) => {
  const allSteps = [
    { id: "applied", label: "Applied" },
    { id: "under-review", label: "Under Review" },
    { id: "screening", label: "Screening" },
    { id: "shortlisted", label: "Shortlisted" },
    { id: "interview", label: "Interview" },
    { id: "selected", label: "Selected" },
  ];

  const currentIndex = allSteps.findIndex((s) => s.id === currentStep);

  const steps: Step[] = allSteps.map((step, index) => {
    let status: StepStatus = "upcoming";
    
    if (isRejected && index === currentIndex) {
      status = "rejected";
    } else if (index < currentIndex) {
      status = "completed";
    } else if (index === currentIndex) {
      status = "current";
    }

    return { ...step, status };
  });

  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex-1 flex items-center">
            {/* Step Circle */}
            <div className="relative flex flex-col items-center">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                  step.status === "completed" && "bg-success border-success text-success-foreground",
                  step.status === "current" && "bg-primary border-primary text-primary-foreground",
                  step.status === "upcoming" && "bg-white border-border text-muted-foreground",
                  step.status === "rejected" && "bg-destructive border-destructive text-destructive-foreground"
                )}
              >
                {step.status === "completed" && <Check className="w-5 h-5" />}
                {step.status === "current" && <Circle className="w-5 h-5 fill-current" />}
                {step.status === "upcoming" && <span className="text-sm font-medium">{index + 1}</span>}
                {step.status === "rejected" && <X className="w-5 h-5" />}
              </div>
              <span
                className={cn(
                  "absolute -bottom-6 whitespace-nowrap text-xs font-medium",
                  step.status === "completed" && "text-success",
                  step.status === "current" && "text-primary",
                  step.status === "upcoming" && "text-muted-foreground",
                  step.status === "rejected" && "text-destructive"
                )}
              >
                {step.label}
              </span>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-0.5 mx-2",
                  index < currentIndex ? "bg-success" : "bg-border"
                )}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PipelineStepper;
