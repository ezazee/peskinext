"use client";

type Props = {
  label: string; // ex: "Rumah Garut Garut"
  onOpen: () => void; // buka AddressModal
  loading?: boolean;
};

export default function AddressCardMobile({ label, onOpen, loading }: Props) {
  return (
    <header className="sticky top-[60px] z-30 bg-white border-b border-gray-50 px-5 py-4">
      <div className="flex items-center gap-3">
        <div className="bg-primary/10 p-2 rounded-xl text-primary">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
          </svg>
        </div>
        <button
          onClick={onOpen}
          disabled={loading}
          className="flex-1 text-left flex items-center justify-between cursor-pointer group disabled:cursor-default"
        >
          <div className="min-w-0 flex-1">
            <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-0.5">Dikirim ke</div>
            {loading ? (
              <div className="h-5 w-3/4 bg-gray-100 rounded-md animate-pulse mt-0.5" />
            ) : (
              <div className="font-bold text-gray-900 line-clamp-1 text-sm tracking-tight">{label}</div>
            )}
          </div>
          {!loading && (
            <span className="text-primary text-xs font-black uppercase tracking-widest ml-4 bg-primary/5 px-3 py-1.5 rounded-lg group-active:scale-95 transition-all">Ubah</span>
          )}
        </button>
      </div>
    </header>
  );
}
