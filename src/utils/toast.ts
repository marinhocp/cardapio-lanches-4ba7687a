
export const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
  // Remove any existing toast
  const existingToast = document.getElementById('global-toast');
  if (existingToast) {
    existingToast.remove();
  }

  // Create toast element
  const toast = document.createElement('div');
  toast.id = 'global-toast';
  toast.className = `
    fixed top-4 right-4 z-[9999] px-4 py-3 rounded-lg shadow-lg
    transform transition-all duration-300 ease-in-out
    ${type === 'success' ? 'bg-green-500 text-white' : ''}
    ${type === 'error' ? 'bg-red-500 text-white' : ''}
    ${type === 'info' ? 'bg-blue-500 text-white' : ''}
  `;
  
  toast.innerHTML = `
    <div class="flex items-center space-x-2">
      <span>${message}</span>
      <button onclick="this.parentElement.parentElement.remove()" class="ml-2 hover:opacity-75">×</button>
    </div>
  `;

  // Add to body
  document.body.appendChild(toast);

  // Auto remove after 3 seconds
  setTimeout(() => {
    if (toast.parentElement) {
      toast.remove();
    }
  }, 3000);
};
