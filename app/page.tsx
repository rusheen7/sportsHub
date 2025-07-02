import Link from 'next/link';

const teams = [
  {
    name: 'McLaren F1',
    href: '/mclaren',
    logo: '/file.svg', // Placeholder, replace with real logo if available
    color: 'bg-orange-100',
  },
  {
    name: 'Real Madrid',
    href: '/real-madrid',
    logo: '/globe.svg',
    color: 'bg-yellow-100',
  },
  {
    name: 'Admin Panel',
    href: '/admin',
    logo: '/vercel.svg',
    color: 'bg-gray-100',
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen p-8 flex flex-col items-center justify-center bg-gradient-to-br from-orange-50 via-white to-blue-50">
      <div className="max-w-2xl w-full text-center mb-10">
        <h1 className="text-5xl font-extrabold mb-4 text-orange-600 drop-shadow">Welcome to sportsHub</h1>
        <p className="mb-6 text-lg text-gray-700">Your dashboard for all your favorite teams. Select a team to view their stats and cool info:</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full max-w-3xl">
        {teams.map((team) => (
          <Link
            key={team.name}
            href={team.href}
            className={`flex items-center gap-4 p-6 rounded-xl shadow-md hover:scale-105 transition-transform border ${team.color} hover:border-orange-400`}
          >
            <img src={team.logo} alt={team.name + ' logo'} className="w-14 h-14 object-contain rounded-full bg-white border" />
            <span className="text-2xl font-semibold text-gray-800">{team.name}</span>
          </Link>
        ))}
      </div>
    </main>
  );
}