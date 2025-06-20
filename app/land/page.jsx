import { neon } from '@netlify/neon';
const sql = neon(); // automatically uses env NETLIFY_DATABASE_URL
const [players] = await sql`SELECT * FROM players`;

export const metadata = {
    title: 'Land'
};

export default async function Page() {
    console.log('players', players);
    return (
        <>
            <h1 className="mb-8">Land</h1>
            {!!players?.length && (
                <ul className="flex flex-wrap gap-x-4 gap-y-1">
                    {players.map((item, index) => (
                        <li key={index}>
                            <p className="text-sm text-gray-500">{item.name} has {item.land}ha land.</p>
                        </li>
                    ))}
                </ul>
            )}
        </>
    );
}
