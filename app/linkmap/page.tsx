import type { Metadata } from 'next';
import Image from 'next/image';
import LinkMapPage from './LinkMapPage';

export const metadata: Metadata = {
    title: 'BootWay | Links',
    description: 'BootWay — India\'s First iNaaS Provider. All our important links in one place.',
    openGraph: {
        title: 'BootWay | Links',
        description: 'Navigate large indoor spaces effortlessly with BootWay\'s cutting-edge indoor navigation technology.',
        images: ['/logo-w-re.png'],
    },
};

export default function Page() {
    return <LinkMapPage />;
}
