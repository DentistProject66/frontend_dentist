import { Sparkles } from "lucide-react";

export default function Logo() {
  return (
    <div className="flex items-center gap-1">
      <Sparkles className="text-blue-600" size={20} />
      <span className="text-blue-700 font-[cursive] text-3xl">logo</span>
    </div>
  );
}
