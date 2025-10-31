'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function Navbar() {
    return (
        <nav className=" fixed top-0 left-0 w-full z-50  bg-transparent px-6 py-4 flex items-center justify-start">
            <Link href="/" className="flex items-center gap-2 group">
                <Image
                    src="/images/isologo.png"
                    alt="Music Data Explorer Logo"
                    width={40}
                    height={40}
                    priority
                    className="transition-transform duration-300 group-hover:scale-105"
                />
                <span className="sr-only">Go to homepage</span>
            </Link>
        </nav>
    );
}
