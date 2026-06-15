const Loader = ({ type }: { type: string }) => {
  return (
    <>
      <div className="absolute inset-0 bg-black/30 z-50 flex items-center justify-center">
        <div className="bg-white rounded-lg p-4 flex items-center gap-3 shadow-xl">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-gray-700">
            {type === "resending"
              ? "Sending new code..."
              : type === "login"
                ? "Logging in..."
                : type === "signup"
                  ? "Authenticating..."
                  : "Verifying..."}
          </span>
        </div>
      </div>
    </>
  );
};

export default Loader;
