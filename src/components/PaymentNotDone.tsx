import { AlertTriangle } from "lucide-react";

export default function PaymentNotDone() {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-zinc-800">
      {/* Background path designs */}
      <div className="absolute inset-0 opacity-10">
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <pattern
            id="pattern-circles"
            x="0"
            y="0"
            width="50"
            height="50"
            patternUnits="userSpaceOnUse"
            patternContentUnits="userSpaceOnUse"
          >
            <circle cx="10" cy="10" r="2" fill="white" />
            <circle cx="25" cy="25" r="1" fill="white" />
            <circle cx="40" cy="40" r="2" fill="white" />
            <path d="M0 25 L50 25" stroke="white" strokeWidth="0.5" />
            <path d="M25 0 L25 50" stroke="white" strokeWidth="0.5" />
          </pattern>
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="url(#pattern-circles)"
          />
        </svg>
      </div>

      <div className="z-10 max-w-md p-8 text-center">
        <AlertTriangle className="mx-auto mb-6 h-16 w-16 text-yellow-400" />
        <h1 className="mb-4 text-2xl font-bold text-[#ff9a8a] md:text-3xl">
          Access to this website has been temporarily suspended due to
          outstanding payment.
        </h1>
        <p className="text-lg text-[#ff9a8a]">
          We are working to resolve the matter promptly. Thank you for your
          cooperation.
        </p>
      </div>
    </div>
  );
}
