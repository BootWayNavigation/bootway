import Link from "next/link";
import { MapPin, Clock, Briefcase, IndianRupee, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

interface JobCardProps {
  id: string;
  title: string;
  department: string;
  location: string;
  type: "full-time" | "part-time" | "contract" | "internship";
  salary?: string;
  postedAt: string;
  description: string;
}

const typeLabels = {
  "full-time": "Full Time",
  "part-time": "Part Time",
  contract: "Contract",
  internship: "Internship",
};

const JobCard = ({
  id,
  title,
  department,
  location,
  type,
  salary,
  postedAt,
  description,
}: JobCardProps) => {
  return (
    <Card className="group card-hover border-border/50 overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col gap-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                {title}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">{department}</p>
            </div>
            <span className="shrink-0 px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
              {typeLabels[type]}
            </span>
          </div>

          {/* Meta Info */}
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4" />
              <span>{location}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span>{postedAt}</span>
            </div>
            {salary && (
              <div className="flex items-center gap-1.5">
                <IndianRupee className="w-4 h-4" />
                <span>{salary}</span>
              </div>
            )}
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0 flex gap-3">
        <Button variant="outline" size="sm" asChild className="flex-1">
          <Link href={`/careers/${id}`}>
            <Briefcase className="w-4 h-4 mr-1" />
            View Details
          </Link>
        </Button>
        <Button size="sm" asChild className="flex-1">
          <Link href={`/careers/${id}/apply`}>
            Apply Now
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default JobCard;
