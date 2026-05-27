import { useNavigate } from 'react-router-dom';

interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
}

interface QuickActionsProps {
  actions: QuickAction[];
}

const QuickActionsPresenter = ({ actions }: QuickActionsProps) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white dark:bg-[#1a1a2e] rounded-2xl shadow-xl p-6 border border-[#015EB0]/10 dark:border-[#015EB0]/20 animate-slide-in">
      <h3 className="text-xl font-bold text-[#002E5E] dark:text-white mb-6 flex items-center gap-2">
        <span className="w-2 h-8 bg-[#3EA32A] rounded-full"></span>
        Acciones Rápidas
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={() => navigate(action.path)}
            className="flex items-center gap-4 p-5 rounded-xl border-2 border-[#015EB0]/20 dark:border-[#015EB0]/30 hover:border-[#015EB0] dark:hover:border-[#3EA32A] hover:bg-gradient-to-br hover:from-[#002E5E]/5 hover:to-[#015EB0]/5 dark:hover:from-[#015EB0]/10 dark:hover:to-[#3EA32A]/10 transition-all duration-300 group transform hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="text-[#015EB0] dark:text-[#3EA32A] group-hover:scale-110 transition-transform duration-300">
              {action.icon}
            </div>
            <span className="font-bold text-[#002E5E] dark:text-white group-hover:text-[#015EB0] dark:group-hover:text-[#3EA32A] transition-colors">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActionsPresenter;
