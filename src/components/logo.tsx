import { Leaf } from 'lucide-react';

export function Logo() {
  return (
    <div className="flex items-center gap-2" aria-label="BuntuBuild Home">
      <div className="bg-primary p-2 rounded-lg">
        <Leaf className="text-primary-foreground h-6 w-6" />
      </div>
      <span className="font-bold text-2xl font-headline text-primary tracking-wide">
        BuntuBuild
      </span>
    </div>
  );
}
