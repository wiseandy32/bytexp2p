import Link from 'next/link';
import { MdAdminPanelSettings, MdPerson, MdBeenhere, MdKey } from 'react-icons/md';

export default function AccountDropdown() {
  return (
    <div className="absolute right-0 mt-2 w-64 bg-gray-800 border border-gray-700 rounded-md shadow-lg">
      <div className="p-3 border-b border-gray-700 flex items-center">
        <MdAdminPanelSettings className="text-blue-400" size={22} />
        <div className="ml-3">
          <p className="text-sm text-gray-100">Hello, John Doe</p>
          <p className="text-xs text-gray-400">realjohndoe8167@gmail.com</p>
        </div>
      </div>
      <Link href="/user/change-password">
        <div className="px-3 py-2 pb-3 hover:bg-gray-700 flex items-center">
          <MdPerson className="text-gray-400" size={18} />
          <small className="ml-2 text-sm text-gray-300">Account Settings</small>
        </div>
      </Link>
      <Link href="/user/kyc-application">
        <div className="px-3 py-2 pb-3 hover:bg-gray-700 flex items-center">
          <MdBeenhere className="text-gray-400" size={18} />
          <small className="ml-2 text-sm text-gray-300">Verification</small>
        </div>
      </Link>
      <a href="#">
        <div className="px-3 py-2 pb-3 hover:bg-gray-700 flex items-center">
          <MdKey className="text-gray-400" size={18} />
          <small className="ml-2 text-sm text-gray-300">Sign out</small>
        </div>
      </a>
      <form id="logout-form" action="/logout" method="POST" style={{ display: 'none' }}>
      </form>
    </div>
  );
}
