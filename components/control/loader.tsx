const Loader = () => {
  return (
    <div className="h-6 py-2">
      <div className="relative max-w-[500px] h-2 border rounded-full border-purple-100/30 overflow-hidden">
        <span className="absolute h-full bg-purple-100 w-[40px] rounded-md animate-slide"></span>
      </div>
    </div>
  );
}

export default Loader;
