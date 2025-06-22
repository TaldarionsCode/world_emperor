import { neon } from '@netlify/neon';


export const metadata = {
    title: 'Land'
};

export const sql = neon(); // automatically uses env NETLIFY_DATABASE_URL
export const [players] = await sql`SELECT * FROM players`;

export default async function Page() {
    
    console.log('players', players);
    return (
        <>
            <h1 className="mb-8">Land</h1>
            <p className="mb-4">This is a page that uses the Netlify Database to fetch players. Length: {players.length}</p>
            <p className="mb-4">{players}</p>
            {!!players?.length && (
                <ul className="flex flex-wrap gap-x-4 gap-y-1">
                    
                </ul>
            )}
        </>
    );
}
