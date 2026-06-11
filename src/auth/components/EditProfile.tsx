import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, Save, X } from 'lucide-react';

interface EditProfileProps {
  onClose: () => void;
}

const EditProfile = ({ onClose }: EditProfileProps) => {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    email: user?.email || '',
    full_name: user?.name || '',
    current_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(null);
    setSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Validar contraseña si se está cambiando
      if (formData.new_password || formData.confirm_password) {
        if (formData.new_password !== formData.confirm_password) {
          setError('Las contraseñas nuevas no coinciden');
          setIsLoading(false);
          return;
        }
        if (formData.new_password.length < 6) {
          setError('La nueva contraseña debe tener al menos 6 caracteres');
          setIsLoading(false);
          return;
        }
      }

      const updateData: { email?: string; full_name?: string; password?: string } = {};

      if (formData.email !== user?.email) {
        updateData.email = formData.email;
      }
      if (formData.full_name !== user?.name) {
        updateData.full_name = formData.full_name;
      }
      if (formData.new_password) {
        updateData.password = formData.new_password;
      }

      if (Object.keys(updateData).length === 0) {
        setError('No hay cambios para guardar');
        setIsLoading(false);
        return;
      }

      await updateProfile(updateData);
      setSuccess(true);

      // Limpiar campos de contraseña después de actualizar
      setFormData({
        ...formData,
        current_password: '',
        new_password: '',
        confirm_password: '',
      });

      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar perfil');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-[#1a1a2e] rounded-2xl shadow-2xl w-full max-w-md animate-scale-in">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-[#191c1e] dark:text-white">Editar Perfil</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-[#191c1e] dark:text-white" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 px-4 py-3 rounded-lg">
              Perfil actualizado exitosamente
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-[#191c1e] dark:text-white mb-2">
              Nombre Completo
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border-2 border-[#926f6b] dark:border-[#015EB0]/30 rounded-lg bg-white dark:bg-[#2a2a4a] text-[#191c1e] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#3EA32A]"
                placeholder="Tu nombre completo"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#191c1e] dark:text-white mb-2">
              Correo Electrónico
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border-2 border-[#926f6b] dark:border-[#015EB0]/30 rounded-lg bg-white dark:bg-[#2a2a4a] text-[#191c1e] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#3EA32A]"
                placeholder="tu@email.com"
              />
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Cambiar contraseña (opcional)
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-semibold text-[#191c1e] dark:text-white mb-2">
                  Nueva Contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="password"
                    name="new_password"
                    value={formData.new_password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border-2 border-[#926f6b] dark:border-[#015EB0]/30 rounded-lg bg-white dark:bg-[#2a2a4a] text-[#191c1e] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#3EA32A]"
                    placeholder="Nueva contraseña (mínimo 6 caracteres)"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#191c1e] dark:text-white mb-2">
                  Confirmar Nueva Contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="password"
                    name="confirm_password"
                    value={formData.confirm_password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border-2 border-[#926f6b] dark:border-[#015EB0]/30 rounded-lg bg-white dark:bg-[#2a2a4a] text-[#191c1e] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#3EA32A]"
                    placeholder="Confirma tu nueva contraseña"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border-2 border-[#926f6b] dark:border-[#015EB0]/30 text-[#191c1e] dark:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-semibold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-[#3EA32A] to-[#2E7A1F] text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Guardar Cambios
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
