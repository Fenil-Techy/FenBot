import { type ComponentPropsWithoutRef, type ReactNode } from "react"

import { cn } from "@/lib/utils"

interface BentoGridProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode
  className?: string
}

interface BentoCardProps extends ComponentPropsWithoutRef<"div"> {
  name: string
  className: string
  background: ReactNode
  Icon: React.ElementType
  description: string
}

const BentoGrid = ({ children, className, ...props }: BentoGridProps) => {
  return (
    <div
      className={cn(
        "grid w-full auto-rows-[22rem] grid-cols-3 gap-4",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

const BentoCard = ({
  name,
  className,
  background,
  Icon,
  description,
  ...props
}: BentoCardProps) => {
  return (
    <div
      key={name}
      className={cn(
        "group relative col-span-3 flex flex-col justify-end overflow-hidden rounded-xl p-6 sm:p-8",
        // light styles
        "bg-background [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
        // dark styles
        "dark:bg-background transform-gpu dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset] dark:[border:1px_solid_rgba(255,255,255,.1)]",
        className
      )}
      {...props}
    >
      {/* Background container (absolute layout covering card) */}
      <div className="absolute inset-0 z-0">{background}</div>
      
      {/* Text block (anchored at the bottom relative to background flow) */}
      <div className="relative z-20 pointer-events-none flex flex-col gap-1.5 w-full">
        <Icon className="h-10 w-10 origin-left transform-gpu text-neutral-700 transition-all duration-300 ease-in-out group-hover:scale-90" />
        <h3 className="text-xl font-bold text-slate-800 dark:text-neutral-300 tracking-tight">
          {name}
        </h3>
        <p className="max-w-lg text-sm text-slate-500 font-medium leading-relaxed w-full">
          {description}
        </p>
      </div>

      <div className="pointer-events-none absolute inset-0 transform-gpu transition-all duration-300 group-hover:bg-black/3 group-hover:dark:bg-neutral-800/10" />
    </div>
  )
}

export { BentoCard, BentoGrid }
