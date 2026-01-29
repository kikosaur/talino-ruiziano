import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section
      className="min-h-screen pt-20 relative overflow-hidden"
      style={{
        backgroundColor: "#F5D9A5", // Cream/Tan background
      }}
    >
      {/* Left side - Tagline text */}
      <div className="absolute left-8 md:left-16 top-1/2 -translate-y-1/2 z-10">
        <h2
          className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight italic"
          style={{ color: "#4A0E0E", fontFamily: "Georgia, serif" }}
        >
          What
          <br />
          haffen,
          <br />
          Ruizians?
          <br />
          I know
          <br />
          I.L.T.
          <br />
          rayt??
          <br />
          I.L.T. will
          <br />
          feyt to
          <br />
          us...
        </h2>
      </div>

      {/* Center - Signboard with Logo */}
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-5rem)] px-4">

        {/* Wooden Signboard */}
        <div className="relative">
          <img
            src="/Signboard.png"
            alt="Wooden Signboard"
            className="w-[300px] md:w-[400px] lg:w-[450px] object-contain drop-shadow-2xl"
          />

          {/* Signage image overlay on signboard */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <img
              src="/Signage.png"
              alt="Talino Ruiziano"
              className="w-48 md:w-64 lg:w-72 object-contain"
            />

            {/* Login Button */}
            <Link to="/login" className="mt-2">
              <Button
                className="px-8 py-2 text-lg font-semibold rounded-full hover:opacity-90 transition-opacity"
                style={{
                  backgroundColor: "#801B1B",
                  color: "#fff",
                }}
              >
                Log in
              </Button>
            </Link>
          </div>
        </div>

        {/* Instruction text */}
        <p
          className="text-xs md:text-sm text-center mt-4 max-w-xs font-medium"
          style={{ color: "#4A0E0E" }}
        >
          Click 'Join' first to create your account.
          <br />
          Then, click 'Log in' to continue.
        </p>
      </div>

      {/* Right side - Navigation buttons */}
      <div className="absolute right-8 md:right-16 top-1/2 -translate-y-1/2 z-10 flex flex-col gap-4">
        <Link to="/about">
          <Button
            variant="outline"
            className="w-36 py-6 text-lg font-semibold rounded-full border-2 shadow-md hover:scale-105 transition-transform"
            style={{
              backgroundColor: "#FFF9F0",
              borderColor: "#d4c5b5",
              color: "#4A0E0E",
            }}
          >
            About
          </Button>
        </Link>
        <Link to="/programs">
          <Button
            variant="outline"
            className="w-36 py-6 text-lg font-semibold rounded-full border-2 shadow-md hover:scale-105 transition-transform"
            style={{
              backgroundColor: "#FFF9F0",
              borderColor: "#d4c5b5",
              color: "#4A0E0E",
            }}
          >
            Learn More
          </Button>
        </Link>
        <Link to="/bulletin">
          <Button
            variant="outline"
            className="w-36 py-6 text-lg font-semibold rounded-full border-2 shadow-md hover:scale-105 transition-transform"
            style={{
              backgroundColor: "#FFF9F0",
              borderColor: "#d4c5b5",
              color: "#4A0E0E",
            }}
          >
            Creators
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default HeroSection;
