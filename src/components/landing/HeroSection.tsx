import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section
      className="min-h-screen pt-20 relative overflow-hidden"
      style={{
        backgroundColor: "#F5D9A5",
      }}
    >
      {/* Main container - full width layout */}
      <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-4">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-8 w-full max-w-[1400px]">

          {/* Left side - Tagline text (hidden on mobile/tablet) */}
          <div className="hidden xl:flex flex-col items-end justify-center flex-shrink-0 pr-4">
            <h2
              className="text-4xl 2xl:text-5xl font-bold leading-relaxed italic text-right"
              style={{ color: "#4A0E0E", fontFamily: "Georgia, serif" }}
            >
              What haffen,
              <br />
              Ruizians?
              <br />
              I know I.L.T.
              <br />
              rayt??
              <br />
              I.L.T. will
              <br />
              feyt to us...
            </h2>
          </div>

          {/* Center - Signboard with Logo */}
          <div className="flex flex-col items-center justify-center flex-shrink-0">
            {/* Signboard container with bulb positioned relative to it */}
            <div className="relative">
              {/* Light Bulb - positioned top-left overlapping the signboard */}
              <div
                className="absolute z-40"
                style={{
                  left: "-32px",
                  top: "15%",
                }}
              >
                <img
                  src="/bulb.png"
                  alt="Light Bulb Logo"
                  className="object-contain drop-shadow-lg animate-float"
                  style={{
                    width: "clamp(120px, 20vw, 320px)",
                    height: "clamp(120px, 20vw, 320px)"
                  }}
                />
              </div>

              {/* Wooden Signboard */}
              <img
                src="/Signboard.png"
                alt="Wooden Signboard"
                className="object-contain drop-shadow-2xl"
                style={{
                  width: "clamp(300px, 60vw, 800px)",
                  maxWidth: "90vw"
                }}
              />

              {/* Signage image overlay centered on signboard */}
              <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ paddingTop: "10%" }}>
                <img
                  src="/Signage.png"
                  alt="Talino Ruiziano"
                  className="object-contain drop-shadow-md"
                  style={{
                    width: "clamp(180px, 35vw, 500px)",
                    marginLeft: "2%"
                  }}
                />
              </div>

              {/* Login Button - positioned at bottom of signboard */}
              <div className="absolute left-1/2 -translate-x-1/3" style={{ bottom: "calc(26% - 15px)" }}>
                <Link to="/login">
                  <Button
                    className="px-4 sm:px-6 md:px-8 py-1.5 sm:py-2 text-sm sm:text-base md:text-lg font-semibold rounded-full hover:opacity-90 transition-all hover:scale-105 shadow-lg"
                    style={{
                      backgroundColor: "#801B1B",
                      color: "#fff",
                      transform: "rotate(-7deg)",
                    }}
                  >
                    Log in
                  </Button>
                </Link>
              </div>
            </div>

            {/* Instruction text */}
            <p
              className="text-xs sm:text-sm text-center mt-3 sm:mt-4 max-w-xs font-medium"
              style={{ color: "#4A0E0E" }}
            >
              Click 'Join' first to create your account.
              <br />
              Then, click 'Log in' to continue.
            </p>

            {/* Mobile/Tablet navigation - show below lg */}
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mt-4 sm:mt-6 xl:hidden">
              <Link to="/about">
                <Button
                  variant="outline"
                  className="px-4 sm:px-6 py-1.5 sm:py-2 text-sm sm:text-base font-semibold rounded-full border-2 shadow-md hover:scale-105 transition-transform"
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
                  className="px-4 sm:px-6 py-1.5 sm:py-2 text-sm sm:text-base font-semibold rounded-full border-2 shadow-md hover:scale-105 transition-transform"
                  style={{
                    backgroundColor: "#FFF9F0",
                    borderColor: "#d4c5b5",
                    color: "#4A0E0E",
                  }}
                >
                  Programs
                </Button>
              </Link>
              <Link to="/bulletin">
                <Button
                  variant="outline"
                  className="px-4 sm:px-6 py-1.5 sm:py-2 text-sm sm:text-base font-semibold rounded-full border-2 shadow-md hover:scale-105 transition-transform"
                  style={{
                    backgroundColor: "#FFF9F0",
                    borderColor: "#d4c5b5",
                    color: "#4A0E0E",
                  }}
                >
                  Bulletin
                </Button>
              </Link>
            </div>
          </div>

          {/* Right side - Navigation buttons (desktop only) */}
          <div className="hidden xl:flex flex-col items-start justify-center gap-4 flex-shrink-0 pl-4">
            <Link to="/about">
              <Button
                variant="outline"
                className="w-52 2xl:w-60 py-6 2xl:py-7 text-xl 2xl:text-2xl font-semibold rounded-full border-2 shadow-md hover:scale-105 transition-all"
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
                className="w-52 2xl:w-60 py-6 2xl:py-7 text-xl 2xl:text-2xl font-semibold rounded-full border-2 shadow-md hover:scale-105 transition-all"
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
                className="w-52 2xl:w-60 py-6 2xl:py-7 text-xl 2xl:text-2xl font-semibold rounded-full border-2 shadow-md hover:scale-105 transition-all"
                style={{
                  backgroundColor: "#FFF9F0",
                  borderColor: "#d4c5b5",
                  color: "#4A0E0E",
                }}
              >
                Bulletin
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-32 left-8 w-20 h-20 bg-yellow-400/20 rounded-full blur-2xl" />
      <div className="absolute bottom-20 right-16 w-32 h-32 bg-orange-400/15 rounded-full blur-3xl" />
    </section>
  );
};

export default HeroSection;
