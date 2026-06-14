const Loader = () => {
  return (
    <>
      <div className="absolute top-0 left-0 w-full z-50 h-screen bg-black/30 flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    </>
  );
};

export default Loader;
