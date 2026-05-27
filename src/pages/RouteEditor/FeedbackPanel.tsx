interface FeedbackPanelProps {
  feedback: string[];
}

const FeedbackPanelPresenter = ({ feedback }: FeedbackPanelProps) => {
  return (
    <div className="bg-white dark:bg-[#1a1a2e] rounded-2xl shadow-xl p-6 border border-[#015EB0]/10 dark:border-[#015EB0]/20 animate-slide-in">
      <h3 className="text-xl font-bold text-[#002E5E] dark:text-white mb-6 flex items-center gap-2">
        <span className="w-2 h-8 bg-[#3EA32A] rounded-full"></span>
        Retroalimentación
      </h3>
      {feedback.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-[#015EB0]/10 dark:bg-[#3EA32A]/10 rounded-full flex items-center justify-center">
            <div className="w-8 h-8 bg-[#015EB0]/20 dark:bg-[#3EA32A]/20 rounded-full"></div>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-semibold">No hay retroalimentación aún</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {feedback.map((msg, index) => (
            <div key={index} className="p-4 bg-[#015EB0]/10 dark:bg-[#015EB0]/20 rounded-xl border-2 border-[#015EB0]/30 dark:border-[#015EB0]/40 text-sm text-[#002E5E] dark:text-white font-medium hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              {msg}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FeedbackPanelPresenter;
