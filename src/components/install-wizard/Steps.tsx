
import React from "react";
import { CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepsProps {
  steps: string[];
  current: number;
}

export function Steps({ steps, current }: StepsProps) {
  return (
    <nav aria-label="Progress" className="py-4">
      <ol
        role="list"
        className="space-y-4 md:flex md:space-y-0 md:space-x-8"
      >
        {steps.map((step, index) => (
          <li key={step} className="md:flex-1">
            <div
              className={cn(
                "group flex flex-col border-l-4 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4",
                index <= current
                  ? "border-primary"
                  : "border-gray-200"
              )}
            >
              <span
                className={cn(
                  "text-sm font-medium",
                  index < current
                    ? "text-primary"
                    : index === current
                    ? "text-primary"
                    : "text-gray-500"
                )}
              >
                Step {index + 1}
              </span>
              <span className="flex items-center text-sm font-medium">
                {index < current ? (
                  <CheckCircle2
                    className="mr-2 h-5 w-5 text-primary"
                    aria-hidden="true"
                  />
                ) : index === current ? (
                  <Circle
                    className="mr-2 h-5 w-5 text-primary"
                    aria-hidden="true"
                  />
                ) : (
                  <Circle
                    className="mr-2 h-5 w-5 text-gray-300"
                    aria-hidden="true"
                  />
                )}
                {step}
              </span>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
}
