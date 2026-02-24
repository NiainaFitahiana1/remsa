interface GreetingProps {
  name: string;
}

export default function Greeting({ name }: GreetingProps) {
  return (
    <>
      <p className="text-secondary text-2xl lg:text-3xl font-bold tracking-tight">
        Hello, {name}!
      </p>
      <div className="flex items-center gap-3 mt-2">
        <span className="bg-secondary text-primary-foreground text-xs font-bold px-2.5 py-1 rounded uppercase tracking-wider">
          Level 4 Courier
        </span>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
          <p className="text-muted-foreground text-sm font-medium">Active Now</p>
        </div>
      </div>
    </>
  );
}