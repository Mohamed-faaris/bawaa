import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      position="top-center"
      closeButton
      expand={false}
      visibleToasts={4}
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg group-[.toaster]:rounded-xl group-[.toaster]:px-4 group-[.toaster]:py-3 group-[.toaster]:w-full group-[.toaster]:text-sm",
          description: "group-[.toast]:text-muted-foreground group-[.toast]:text-xs group-[.toast]:mt-0.5",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground group-[.toast]:rounded-lg group-[.toast]:text-xs group-[.toast]:px-3 group-[.toast]:h-8",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground group-[.toast]:rounded-lg group-[.toast]:text-xs group-[.toast]:px-3 group-[.toast]:h-8",
          closeButton: "group-[.toast]:text-muted-foreground group-[.toast]:hover:text-foreground",
          success:
            "group-[.toaster]:!bg-success group-[.toaster]:!text-success-foreground group-[.toaster]:!border-success",
          error:
            "group-[.toaster]:!bg-destructive group-[.toaster]:!text-destructive-foreground group-[.toaster]:!border-destructive",
          warning:
            "group-[.toaster]:!bg-warning group-[.toaster]:!text-warning-foreground group-[.toaster]:!border-warning",
          info:
            "group-[.toaster]:!bg-info group-[.toaster]:!text-info-foreground group-[.toaster]:!border-info",
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
