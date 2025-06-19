import Image from 'next/image';
import Link from 'next/link';
import projectEdenLogo from 'public/project-eden-logo.png';
import githubLogo from 'public/images/github-mark-white.svg';

const navItems = [
    { linkText: 'Overview', href: '/' },
    { linkText: 'Land', href: '/land' },
    { linkText: 'Production', href: '/production' },
    { linkText: 'Military', href: '/military' },
    { linkText: 'Citizens', href: '/citizens' },
    { linkText: 'Market', href: '/market' }
];

export function Header() {
    return (
        <nav className="flex flex-wrap items-center gap-4 pt-6 pb-12 sm:pt-12 md:pb-24">
            <Link href="/">
                <Image src={projectEdenLogo} alt="Project Eden logo" style="width: 10%; height: auto;"/>
            </Link>
            {!!navItems?.length && (
                <ul className="flex flex-wrap gap-x-4 gap-y-1">
                    {navItems.map((item, index) => (
                        <li key={index}>
                            <Link href={item.href} className="inline-flex px-1.5 py-1 sm:px-3 sm:py-2">
                                {item.linkText}
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
            <Link
                href="https://github.com/netlify-templates/next-platform-starter"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden lg:inline-flex lg:ml-auto"
            >
                <Image src={githubLogo} alt="GitHub logo" className="w-7" />
            </Link>
        </nav>
    );
}
